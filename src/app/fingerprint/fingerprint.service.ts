import { supabase } from "@/config";

export interface FingerprintTemplate {
  id: string;
  senior_id: string;
  template_data: string;
  finger_position: string;
  device_info: string;
  quality_score: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class FingerprintService {
  
  constructor() { }
  
  // Register senior citizen's fingerprint
  async registerFingerprint(
    seniorId: string, 
    template_data: string,
    fingerPosition: string = 'right_thumb',
    qualityScore: number = 80
  ): Promise<boolean> {
    try {
      console.log(`Registering fingerprint for senior ID: ${seniorId}`);
      
      // First, verify the senior ID exists
      const { data: seniorData, error: seniorError } = await supabase
        .from('senior_citizens')
        .select('id')
        .eq('id', seniorId)
        .single();
      
      if (seniorError || !seniorData) {
        console.error('Senior citizen not found:', seniorError);
        return false;
      }
      
      // Check if a template for this finger already exists
      const { data: existingTemplate, error: templateQueryError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('id')
        .eq('senior_id', seniorData.id)
        .eq('finger_position', fingerPosition)
        .eq('is_active', true);
      
      if (templateQueryError) {
        console.error('Error checking existing template:', templateQueryError);
        return false;
      }
      
      // If template exists, deactivate it
      if (existingTemplate && existingTemplate.length > 0) {
        console.log(`Deactivating existing ${fingerPosition} template for senior ID: ${seniorId}`);
        const { error: updateError } = await supabase
          .from('senior_citizen_fingerprints')
          .update({ 
            is_active: false,
            updated_at: new Date().toISOString() 
          })
          .eq('id', existingTemplate[0].id);
        
        if (updateError) {
          console.error('Error deactivating existing template:', updateError);
          return false;
        }
      }
      
      // Generate device info
      const deviceInfo = this.generateDeviceInfo();
      
      // Insert new template
      const { error: insertError } = await supabase
        .from('senior_citizen_fingerprints')
        .insert({
          senior_id: seniorData.id,
          template_data: template_data,
          finger_position: fingerPosition,
          quality_score: qualityScore,
          device_info: deviceInfo,
          is_active: true
          // created_at and updated_at will be handled by Supabase defaults
        });
      
      if (insertError) {
        console.error('Error inserting fingerprint template:', insertError);
        return false;
      }
      
      console.log(`Successfully registered ${fingerPosition} fingerprint for senior ID: ${seniorId}`);
      return true;
    } catch (error) {
      console.error('Error in registerFingerprint:', error);
      return false;
    }
  }

  // Generate device info for registration/verification
  private generateDeviceInfo(): string {
    const browserInfo = navigator.userAgent;
    const deviceType = this.getDeviceType();
    const timestamp = new Date().toISOString();
    
    return `Web ${deviceType} | ${timestamp.split('T')[0]} | DigitalPersona 4500`;
  }
  
  // Helper to determine device type
  private getDeviceType(): string {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  // Check if senior citizen has registered fingerprint
  async hasRegisteredFingerprint(seniorId: string): Promise<boolean> {
    try {
      // Verify the senior ID exists and get any active fingerprints
      const { data: templates, error: templateError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('id')
        .eq('senior_id', seniorId)
        .eq('is_active', true);
      
      if (templateError) {
        console.error('Error checking fingerprint registration:', templateError);
        return false;
      }
      
      return templates && templates.length > 0;
    } catch (error) {
      console.error('Error in hasRegisteredFingerprint:', error);
      return false;
    }
  }
  
  // Get fingerprint template(s) for verification
  async getActiveTemplates(seniorId: string): Promise<FingerprintTemplate[]> {
    try {
      // Get active templates
      const { data: templates, error: templateError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('*')
        .eq('senior_id', seniorId)
        .eq('is_active', true);
      
      if (templateError || !templates) {
        console.error('Error fetching active templates:', templateError);
        return [];
      }
      
      return templates as FingerprintTemplate[];
    } catch (error) {
      console.error('Error in getActiveTemplates:', error);
      return [];
    }
  }

  // Function to verify a fingerprint against stored templates
  async verifyFingerprint(
    seniorId: string,
    templateData: string
  ): Promise<{ matched: boolean; score?: number; fingerId?: string; fingerPosition?: string }> {
    try {
      console.log(`Verifying fingerprint for senior ID: ${seniorId}`);
      
      // Ensure we're working with clean template data
      const cleanTemplateData = this.cleanupTemplateData(templateData);
      
      // Get active fingerprint templates for this senior
      const templates = await this.getActiveTemplates(seniorId);
      
      if (templates.length === 0) {
        console.log(`No active fingerprint templates found for senior ID: ${seniorId}`);
        return { matched: false };
      }
      
      console.log(`Found ${templates.length} active fingerprint templates for verification`);
      
      // We'll try all active templates and return the best match if above threshold
      let bestMatch = { matched: false, score: 0, fingerId: '', fingerPosition: '' };
      
      // Compare with stored templates
      for (const template of templates) {
        const storedTemplate = this.cleanupTemplateData(template.template_data);
        
        // Get the comparison score
        const matchScore = this.compareTemplates(cleanTemplateData, storedTemplate);
        console.log(`Template comparison score for ${template.finger_position}: ${matchScore}`);
        
        // Track the best match
        if (matchScore > bestMatch.score!) {
          bestMatch = {
            matched: matchScore >= 0.80, // 80% threshold
            score: matchScore,
            fingerId: template.id,
            fingerPosition: template.finger_position
          };
        }
      }
      
      return bestMatch;
    } catch (error) {
      console.error('Error verifying fingerprint:', error);
      return { matched: false };
    }
  }

  // Compare two fingerprint templates - enhanced for DigitalPersona 4500
  private compareTemplates(sample: string, stored: string): number {
    // For exact matches (same person, same finger, same scan)
    if (sample === stored) {
      return 1.0; // 100% match
    }
    
    // Check if the data appears to be base64 image data
    const isImageData = sample.startsWith('iVBOR') || stored.startsWith('iVBOR');
    
    if (isImageData) {
      // For image-based comparison, use more sophisticated techniques
      return this.compareImageBasedTemplates(sample, stored);
    } else {
      // For minutiae-based comparison (feature data)
      return this.compareFeatureBasedTemplates(sample, stored);
    }
  }

  // Compare image-based templates (common with DigitalPersona scanners)
  private compareImageBasedTemplates(sample: string, stored: string): number {
    // This is a simplified approach - in a real implementation,
    // you would use specialized image processing techniques
    
    // For this example, we'll:
    // 1. Break the templates into chunks
    // 2. Compare corresponding chunks for similarity
    // 3. Calculate overall similarity score
    
    const chunkSize = 64; // Use larger chunks for image data
    const matches = [];
    const totalChunks = Math.min(
      Math.floor(sample.length / chunkSize),
      Math.floor(stored.length / chunkSize)
    );
    
    if (totalChunks < 10) {
      // Not enough data for a good comparison
      return 0;
    }
    
    // Sample points throughout the image data
    // (beginning, middle, end sections are most discriminative)
    const samplePoints = [
      0, 1, 2, 3, 4, // Start of image
      Math.floor(totalChunks / 2) - 2, Math.floor(totalChunks / 2) - 1, 
      Math.floor(totalChunks / 2), Math.floor(totalChunks / 2) + 1, 
      Math.floor(totalChunks / 2) + 2, // Middle of image
      totalChunks - 5, totalChunks - 4, totalChunks - 3, 
      totalChunks - 2, totalChunks - 1 // End of image
    ];
    
    for (const i of samplePoints) {
      const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
      const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
      
      // Calculate similarity for this chunk
      const similarity = this.calculateChunkSimilarity(sampleChunk, storedChunk);
      matches.push(similarity);
    }
    
    // Calculate overall match score by averaging the chunk similarities
    const averageSimilarity = matches.reduce((sum, val) => sum + val, 0) / matches.length;
    
    return averageSimilarity;
  }

  // Compare feature-based templates
  private compareFeatureBasedTemplates(sample: string, stored: string): number {
    // For partial matches (same person, same finger, different scan)
    // Count matching characters in chunks
    let matchCount = 0;
    const chunkSize = 10; // Smaller chunks for feature data
    const totalChunks = Math.floor(Math.min(sample.length, stored.length) / chunkSize);
    
    if (totalChunks === 0) return 0;
    
    for (let i = 0; i < totalChunks; i++) {
      const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
      const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
      
      // If chunks are similar (at least 70% of characters match), count as a match
      const chunkSimilarity = this.calculateChunkSimilarity(sampleChunk, storedChunk);
      if (chunkSimilarity >= 0.7) {
        matchCount++;
      }
    }
    
    return matchCount / totalChunks;
  }
  
  // Calculate similarity between two chunks of template data
  private calculateChunkSimilarity(chunk1: string, chunk2: string): number {
    let matches = 0;
    const length = Math.min(chunk1.length, chunk2.length);
    
    for (let i = 0; i < length; i++) {
      // For image data, we consider characters with small ASCII differences
      // to be potentially similar (allowing for minor differences in grayscale etc.)
      const charDiff = Math.abs(chunk1.charCodeAt(i) - chunk2.charCodeAt(i));
      if (charDiff < 5) { // Stricter tolerance
        matches += 1 - (charDiff / 5); // Higher score for closer matches
      }
    }
    
    return matches / length;
  }

  // Clean up template data for comparison
  private cleanupTemplateData(templateData: string): string {
    // Remove all whitespace and newlines
    templateData = templateData.trim().replace(/\s/g, '');
    
    // If it's a data URL, extract the base64 part
    if (templateData.includes('data:image') && templateData.includes('base64,')) {
      templateData = templateData.split('base64,')[1];
    }
    
    // Remove any non-base64 characters
    return templateData.replace(/[^A-Za-z0-9+/=]/g, '');
  }
  
  // For deleting a fingerprint (used in ProfilePage)
  async deleteFingerprint(seniorId: string): Promise<boolean> {
    try {
      // Get all fingerprint records for this senior
      const { data: templates, error: fetchError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('id')
        .eq('senior_id', seniorId);
      
      if (fetchError) {
        console.error('Error fetching fingerprints for deletion:', fetchError);
        return false;
      }
      
      if (!templates || templates.length === 0) {
        console.log('No fingerprints found for senior ID:', seniorId);
        return true; // Nothing to delete
      }
      
      // Update all fingerprints to inactive
      const { error: updateError } = await supabase
        .from('senior_citizen_fingerprints')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('senior_id', seniorId);
      
      if (updateError) {
        console.error('Error deactivating fingerprints:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteFingerprint:', error);
      return false;
    }
  }
}
