"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintService = void 0;
const config_1 = require("@/config");
class FingerprintService {
    constructor() { }
    async registerFingerprint(seniorId, templateData, fingerPosition = 'right_thumb', qualityScore = 80) {
        try {
            console.log(seniorId);
            const { data: seniorData, error: seniorError } = await config_1.supabase
                .from('senior_citizens')
                .select('id')
                .eq('id', seniorId)
                .single();
            if (seniorError || !seniorData) {
                console.error('Senior citizen not found:', seniorError);
                return false;
            }
            const { data: existingTemplate, error: templateQueryError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('id')
                .eq('senior_id', seniorData.id)
                .eq('finger_position', fingerPosition)
                .eq('is_active', true);
            if (templateQueryError) {
                console.error('Error checking existing template:', templateQueryError);
                return false;
            }
            if (existingTemplate && existingTemplate.length > 0) {
                const { error: updateError } = await config_1.supabase
                    .from('senior_citizen_fingerprints')
                    .update({ is_active: false })
                    .eq('id', existingTemplate[0].id);
                if (updateError) {
                    console.error('Error deactivating existing template:', updateError);
                    return false;
                }
            }
            const { error: insertError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .insert({
                senior_id: seniorData.id,
                template_data: templateData,
                finger_position: fingerPosition,
                quality_score: qualityScore,
                device_info: 'Web Registration',
                is_active: true
            });
            if (insertError) {
                console.error('Error inserting fingerprint template:', insertError);
                return false;
            }
            return true;
        }
        catch (error) {
            console.error('Error in registerFingerprint:', error);
            return false;
        }
    }
    async hasRegisteredFingerprint(seniorId) {
        try {
            const { data: seniorData, error: seniorError } = await config_1.supabase
                .from('senior_citizens')
                .select('id')
                .eq('id', seniorId)
                .single();
            if (seniorError || !seniorData) {
                return false;
            }
            const { data: templates, error: templateError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('id')
                .eq('senior_id', seniorData.id)
                .eq('is_active', true);
            if (templateError) {
                return false;
            }
            return templates && templates.length > 0;
        }
        catch (error) {
            console.error('Error in hasRegisteredFingerprint:', error);
            return false;
        }
    }
    async getActiveTemplates(seniorId) {
        try {
            const { data: seniorData, error: seniorError } = await config_1.supabase
                .from('senior_citizens')
                .select('id')
                .eq('id', seniorId)
                .single();
            if (seniorError || !seniorData) {
                return [];
            }
            const { data: templates, error: templateError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('*')
                .eq('senior_id', seniorData.id)
                .eq('is_active', true);
            if (templateError || !templates) {
                return [];
            }
            return templates;
        }
        catch (error) {
            console.error('Error in getActiveTemplates:', error);
            return [];
        }
    }
}
exports.FingerprintService = FingerprintService;
//# sourceMappingURL=fingerprint.service.js.map