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
    templateData: string,
    fingerPosition: string = 'right_thumb',
    qualityScore: number = 80
  ): Promise<boolean> {
    try {

      console.log(seniorId)
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
          template_data: templateData,
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
}
