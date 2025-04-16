"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintService = void 0;
const config_1 = require("@/config");
class FingerprintService {
    constructor() { }
    async registerFingerprint(seniorId, template_data, fingerPosition = 'right_thumb', qualityScore = 80) {
        try {
            console.log(template_data, seniorId);
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
                template_data: template_data,
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
    async verifyFingerprint(seniorId, templateData) {
        try {
            console.log(`Verifying fingerprint for senior ID: ${seniorId}`);
            const cleanTemplateData = this.cleanupTemplateData(templateData);
            const { data: seniorData, error: seniorError } = await config_1.supabase
                .from('senior_citizens')
                .select('id')
                .eq('id', seniorId)
                .single();
            if (seniorError || !seniorData) {
                console.error('Senior citizen not found:', seniorError);
                return { matched: false };
            }
            const { data: templates, error: templateError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('*')
                .eq('senior_id', seniorData.id)
                .eq('is_active', true);
            if (templateError || !templates || templates.length === 0) {
                console.error('No active fingerprint templates found:', templateError);
                return { matched: false };
            }
            console.log(`Found ${templates.length} active fingerprint templates for verification`);
            for (const template of templates) {
                const storedTemplate = this.cleanupTemplateData(template.template_data);
                const samplePart = cleanTemplateData.substring(0, 2000);
                const storedPart = storedTemplate.substring(0, 2000);
                const matchScore = this.compareTemplateParts(samplePart, storedPart);
                console.log(`Template comparison score: ${matchScore}`);
                if (matchScore >= 0.80) {
                    return {
                        matched: true,
                        score: matchScore,
                        fingerId: template.id
                    };
                }
            }
            return { matched: false };
        }
        catch (error) {
            console.error('Error verifying fingerprint:', error);
            return { matched: false };
        }
    }
    cleanupTemplateData(templateData) {
        if (templateData.includes('base64,')) {
            templateData = templateData.split('base64,')[1];
        }
        return templateData.replace(/[^A-Za-z0-9+/=]/g, '');
    }
    compareTemplateParts(sample, stored) {
        if (sample === stored) {
            return 1.0;
        }
        let matchCount = 0;
        const chunkSize = 10;
        const totalChunks = Math.floor(Math.min(sample.length, stored.length) / chunkSize);
        if (totalChunks === 0)
            return 0;
        for (let i = 0; i < totalChunks; i++) {
            const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
            const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
            const chunkMatches = this.countMatchingCharacters(sampleChunk, storedChunk);
            if (chunkMatches / chunkSize >= 0.7) {
                matchCount++;
            }
        }
        return matchCount / totalChunks;
    }
    countMatchingCharacters(str1, str2) {
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
exports.FingerprintService = FingerprintService;
//# sourceMappingURL=fingerprint.service.js.map