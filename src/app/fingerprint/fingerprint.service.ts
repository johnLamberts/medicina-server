import { supabase } from "@/config";

export interface FingerprintTemplate {
  id: string;
  senior_id: string;
  template_data: string;
  finger_position: string;
  quality_score: number;
  is_active: boolean;
  created_at: string;
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

      console.log(template_data, seniorId)
      // First, get the senior UUID from the senior_id
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
        const { error: updateError } = await supabase
          .from('senior_citizen_fingerprints')
          .update({ is_active: false })
          .eq('id', existingTemplate[0].id);
        
        if (updateError) {
          console.error('Error deactivating existing template:', updateError);
          return false;
        }
      }
      
      // Insert new template
      const { error: insertError } = await supabase
        .from('senior_citizen_fingerprints')
        .insert({
          senior_id: seniorData.id,
          template_data: template_data,
          finger_position: fingerPosition,
          quality_score: qualityScore,
          device_info: 'Web Registration', // This would be more specific in production
          is_active: true
        });
      
      if (insertError) {
        console.error('Error inserting fingerprint template:', insertError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in registerFingerprint:', error);
      return false;
    }
  }

  // Check if senior citizen has registered fingerprint
   async hasRegisteredFingerprint(seniorId: string): Promise<boolean> {
    try {
      // Get senior's UUID
      const { data: seniorData, error: seniorError } = await supabase
        .from('senior_citizens')
        .select('id')
        .eq('id', seniorId)
        .single();
      
      if (seniorError || !seniorData) {
        return false;
      }
      
      // Check for active fingerprint templates
      const { data: templates, error: templateError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('id')
        .eq('senior_id', seniorData.id)
        .eq('is_active', true);
      
      if (templateError) {
        return false;
      }
      
      return templates && templates.length > 0;
    } catch (error) {
      console.error('Error in hasRegisteredFingerprint:', error);
      return false;
    }
  }
  
  // Get fingerprint template for verification
   async getActiveTemplates(seniorId: string): Promise<FingerprintTemplate[]> {
    try {
      // Get senior's UUID
      const { data: seniorData, error: seniorError } = await supabase
        .from('senior_citizens')
        .select('id')
        .eq('id', seniorId)
        .single();
      
      if (seniorError || !seniorData) {
        return [];
      }
      
      // Get active templates
      const { data: templates, error: templateError } = await supabase
        .from('senior_citizen_fingerprints')
        .select('*')
        .eq('senior_id', seniorData.id)
        .eq('is_active', true);
      
      if (templateError || !templates) {
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
): Promise<{ matched: boolean; score?: number; fingerId?: string }> {
  try {
    console.log(`Verifying fingerprint for senior ID: ${seniorId}`);
    
    // Ensure we're working with clean template data
    const cleanTemplateData = this.cleanupTemplateData(templateData);
    
    // 1. Get the senior citizen's stored fingerprint templates
    const { data: seniorData, error: seniorError } = await supabase
      .from('senior_citizens')
      .select('id')
      .eq('id', seniorId)
      .single();
    
    if (seniorError || !seniorData) {
      console.error('Senior citizen not found:', seniorError);
      return { matched: false };
    }
    
    // 2. Get active fingerprint templates for this senior
    const { data: templates, error: templateError } = await supabase
      .from('senior_citizen_fingerprints')
      .select('*')
      .eq('senior_id', seniorData.id)
      .eq('is_active', true);
    
    if (templateError || !templates || templates.length === 0) {
      console.error('No active fingerprint templates found:', templateError);
      return { matched: false };
    }
    
    console.log(`Found ${templates.length} active fingerprint templates for verification`);
    
    // 3. Compare with stored templates
    // For your specific implementation, comparing the first 2000 characters
    // as that's what your extractTemplate method uses
    for (const template of templates) {
      const storedTemplate = this.cleanupTemplateData(template.template_data);
      
      // Get the comparison parts (first 2000 chars) as your client-side code does
      const samplePart = cleanTemplateData.substring(0, 2000);
      const storedPart = storedTemplate.substring(0, 2000);
      
      // Compare using a simplified approach matching your client implementation
      const matchScore = this.compareTemplateParts(samplePart, storedPart);
      console.log(`Template comparison score: ${matchScore}`);
      
      // If score is above threshold, consider it a match
      if (matchScore >= 0.80) { // 80% similarity threshold - adjust based on testing
        return {
          matched: true,
          score: matchScore,
          fingerId: template.id
        };
      }
    }
    
    // No match found
    return { matched: false };
  } catch (error) {
    console.error('Error verifying fingerprint:', error);
    return { matched: false };
  }
}

  private cleanupTemplateData(templateData: string): string {
    // If it's a data URL, extract the base64 part
    if (templateData.includes('base64,')) {
      templateData = templateData.split('base64,')[1];
    }
    
    // Remove any non-base64 characters
    return templateData.replace(/[^A-Za-z0-9+/=]/g, '');
  }

  private compareTemplateParts(sample: string, stored: string): number {
    // For exact matches (same person, same finger, same scan)
    // This is useful during testing and development
    if (sample === stored) {
      return 1.0; // 100% match
    }
    
    // For partial matches (same person, same finger, different scan)
    // Count matching characters in chunks
    let matchCount = 0;
    const chunkSize = 10; // Check in 10-character chunks
    const totalChunks = Math.floor(Math.min(sample.length, stored.length) / chunkSize);
    
    if (totalChunks === 0) return 0;
    
    for (let i = 0; i < totalChunks; i++) {
      const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
      const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
      
      // If chunks are similar (at least 70% of characters match), count as a match
      const chunkMatches = this.countMatchingCharacters(sampleChunk, storedChunk);
      if (chunkMatches / chunkSize >= 0.7) {
        matchCount++;
      }
    }
    
    return matchCount / totalChunks;
  }
  
  private countMatchingCharacters(str1: string, str2: string): number {
    let matches = 0;
    const length = Math.min(str1.length, str2.length);
    
    for (let i = 0; i < length; i++) {
      if (str1[i] === str2[i]) {
        matches++;
      }
    }
    
    return matches;
  }
  
}
