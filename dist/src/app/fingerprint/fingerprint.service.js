"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FingerprintService = void 0;
const config_1 = require("@/config");
class FingerprintService {
    constructor() { }
    async registerFingerprint(seniorId, template_data, fingerPosition = 'right_thumb', qualityScore = 80) {
        try {
            console.log(`Registering fingerprint for senior ID: ${seniorId}`);
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
                console.log(`Deactivating existing ${fingerPosition} template for senior ID: ${seniorId}`);
                const { error: updateError } = await config_1.supabase
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
            const deviceInfo = this.generateDeviceInfo();
            const { error: insertError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .insert({
                senior_id: seniorData.id,
                template_data: template_data,
                finger_position: fingerPosition,
                quality_score: qualityScore,
                device_info: deviceInfo,
                is_active: true
            });
            if (insertError) {
                console.error('Error inserting fingerprint template:', insertError);
                return false;
            }
            console.log(`Successfully registered ${fingerPosition} fingerprint for senior ID: ${seniorId}`);
            return true;
        }
        catch (error) {
            console.error('Error in registerFingerprint:', error);
            return false;
        }
    }
    generateDeviceInfo() {
        const browserInfo = navigator.userAgent;
        const deviceType = this.getDeviceType();
        const timestamp = new Date().toISOString();
        return `Web ${deviceType} | ${timestamp.split('T')[0]} | DigitalPersona 4500`;
    }
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'Mobile';
        }
        return 'Desktop';
    }
    async hasRegisteredFingerprint(seniorId) {
        try {
            const { data: templates, error: templateError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('id')
                .eq('senior_id', seniorId)
                .eq('is_active', true);
            if (templateError) {
                console.error('Error checking fingerprint registration:', templateError);
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
            const { data: templates, error: templateError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('*')
                .eq('senior_id', seniorId)
                .eq('is_active', true);
            if (templateError || !templates) {
                console.error('Error fetching active templates:', templateError);
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
            const templates = await this.getActiveTemplates(seniorId);
            if (templates.length === 0) {
                console.log(`No active fingerprint templates found for senior ID: ${seniorId}`);
                return { matched: false };
            }
            console.log(`Found ${templates.length} active fingerprint templates for verification`);
            let bestMatch = { matched: false, score: 0, fingerId: '', fingerPosition: '' };
            for (const template of templates) {
                const storedTemplate = this.cleanupTemplateData(template.template_data);
                const matchScore = this.compareTemplates(cleanTemplateData, storedTemplate);
                console.log(`Template comparison score for ${template.finger_position}: ${matchScore}`);
                if (matchScore > bestMatch.score) {
                    bestMatch = {
                        matched: matchScore >= 0.80,
                        score: matchScore,
                        fingerId: template.id,
                        fingerPosition: template.finger_position
                    };
                }
            }
            return bestMatch;
        }
        catch (error) {
            console.error('Error verifying fingerprint:', error);
            return { matched: false };
        }
    }
    compareTemplates(sample, stored) {
        if (sample === stored) {
            return 1.0;
        }
        const isImageData = sample.startsWith('iVBOR') || stored.startsWith('iVBOR');
        if (isImageData) {
            return this.compareImageBasedTemplates(sample, stored);
        }
        else {
            return this.compareFeatureBasedTemplates(sample, stored);
        }
    }
    compareImageBasedTemplates(sample, stored) {
        const chunkSize = 64;
        const matches = [];
        const totalChunks = Math.min(Math.floor(sample.length / chunkSize), Math.floor(stored.length / chunkSize));
        if (totalChunks < 10) {
            return 0;
        }
        const samplePoints = [
            0, 1, 2, 3, 4,
            Math.floor(totalChunks / 2) - 2, Math.floor(totalChunks / 2) - 1,
            Math.floor(totalChunks / 2), Math.floor(totalChunks / 2) + 1,
            Math.floor(totalChunks / 2) + 2,
            totalChunks - 5, totalChunks - 4, totalChunks - 3,
            totalChunks - 2, totalChunks - 1
        ];
        for (const i of samplePoints) {
            const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
            const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
            const similarity = this.calculateChunkSimilarity(sampleChunk, storedChunk);
            matches.push(similarity);
        }
        const averageSimilarity = matches.reduce((sum, val) => sum + val, 0) / matches.length;
        return averageSimilarity;
    }
    compareFeatureBasedTemplates(sample, stored) {
        let matchCount = 0;
        const chunkSize = 10;
        const totalChunks = Math.floor(Math.min(sample.length, stored.length) / chunkSize);
        if (totalChunks === 0)
            return 0;
        for (let i = 0; i < totalChunks; i++) {
            const sampleChunk = sample.substring(i * chunkSize, (i + 1) * chunkSize);
            const storedChunk = stored.substring(i * chunkSize, (i + 1) * chunkSize);
            const chunkSimilarity = this.calculateChunkSimilarity(sampleChunk, storedChunk);
            if (chunkSimilarity >= 0.7) {
                matchCount++;
            }
        }
        return matchCount / totalChunks;
    }
    calculateChunkSimilarity(chunk1, chunk2) {
        let matches = 0;
        const length = Math.min(chunk1.length, chunk2.length);
        for (let i = 0; i < length; i++) {
            const charDiff = Math.abs(chunk1.charCodeAt(i) - chunk2.charCodeAt(i));
            if (charDiff < 5) {
                matches += 1 - (charDiff / 5);
            }
        }
        return matches / length;
    }
    cleanupTemplateData(templateData) {
        templateData = templateData.trim().replace(/\s/g, '');
        if (templateData.includes('data:image') && templateData.includes('base64,')) {
            templateData = templateData.split('base64,')[1];
        }
        return templateData.replace(/[^A-Za-z0-9+/=]/g, '');
    }
    async deleteFingerprint(seniorId) {
        try {
            const { data: templates, error: fetchError } = await config_1.supabase
                .from('senior_citizen_fingerprints')
                .select('id')
                .eq('senior_id', seniorId);
            if (fetchError) {
                console.error('Error fetching fingerprints for deletion:', fetchError);
                return false;
            }
            if (!templates || templates.length === 0) {
                console.log('No fingerprints found for senior ID:', seniorId);
                return true;
            }
            const { error: updateError } = await config_1.supabase
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
        }
        catch (error) {
            console.error('Error in deleteFingerprint:', error);
            return false;
        }
    }
}
exports.FingerprintService = FingerprintService;
//# sourceMappingURL=fingerprint.service.js.map