import { HttpStatusCodes } from "@/constants";
import { customReponse } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { FingerprintService } from "./fingerprint.service";

export class FingerprintController {
  private fingerprintService: FingerprintService | any;

  constructor() {
    this.fingerprintService = new FingerprintService();
  }

  // Register a new fingerprint
  registerFingerprintHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senior_id, template_data, fingerPosition, qualityScore } = req.body as any;
console.log(req.body)
      // Validation
      if (!senior_id || !template_data) {
        const error = new Error('seniorId and template_data are required');
        const response = customReponse().error(HttpStatusCodes.BAD_REQUEST, error, `Error has been added.`)
        res.status(response.statusCode).json(response)
      }

      const success = await this.fingerprintService.registerFingerprint(
        senior_id,
        template_data,
        fingerPosition || 'right_thumb',
        qualityScore || 80
      );

      if (success) {
        const response = customReponse().success(
          HttpStatusCodes.CREATED,
          { senior_id },
          'Fingerprint registered successfully'
        );
        return res.status(response.statusCode).json(response);
      } else {
        const error = new Error('Failed to register fingerprint');
        return res.status(HttpStatusCodes.BAD_REQUEST).json(
          customReponse().error(HttpStatusCodes.BAD_REQUEST, error, error.message)
        );
      }
    } catch (err) {
      console.error(`[RegisterFingerprintControllerError]: ${err}`);
      next(err);
    }
  };

  // Check if a senior has a registered fingerprint
  hasRegisteredFingerprintHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seniorId } = req.params;


      console.log(seniorId)
      if (!seniorId) {
        const error = new Error('seniorId is required');
        return res.status(HttpStatusCodes.BAD_REQUEST).json(
          customReponse().error(HttpStatusCodes.BAD_REQUEST, error, error.message)
        );
      }

      const hasFingerprint = await this.fingerprintService.hasRegisteredFingerprint(seniorId);

      const response = customReponse().success(
        HttpStatusCodes.OK,
        { hasFingerprint },
        'Fingerprint status retrieved successfully'
      );
      return res.status(response.statusCode).json(response);
    } catch (err) {
      console.error(`[HasRegisteredFingerprintControllerError]: ${err}`);
      next(err);
    }
  };

  // Get active fingerprint templates
  getActiveTemplatesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seniorId } = req.params;

      if (!seniorId) {
        const error = new Error('seniorId is required');
        return res.status(HttpStatusCodes.BAD_REQUEST).json(
          customReponse().error(HttpStatusCodes.BAD_REQUEST, error, error.message)
        );
      }

      const templates = await this.fingerprintService.getActiveTemplates(seniorId);

      const response = customReponse().success(
        HttpStatusCodes.OK,
        { templates },
        'Active fingerprint templates retrieved successfully'
      );
      return res.status(response.statusCode).json(response);
    } catch (err) {
      console.error(`[GetActiveTemplatesControllerError]: ${err}`);
      next(err);
    }
  };

  // Verify
  handleFingerprintVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { senior_id, template_data } = req.body;
      
      if (!senior_id || !template_data) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: senior_id and template_data are required'
        });
      }
      
      const result = await this.fingerprintService.verifyFingerprint(senior_id, template_data);
      
      return res.status(200).json({
        success: true,
        data: result,
        message: result.matched 
          ? 'Fingerprint verification successful' 
          : 'No matching fingerprint found'
      });
    } catch (error) {
      console.error('Fingerprint verification API error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error during fingerprint verification'
      });
    }
  }


  // Delete a fingerprint (for handleDeleteFingerprint in ProfilePage)
  deleteFingerprintHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { seniorId } = req.params;

      if (!seniorId) {
        const error = new Error('seniorId is required');
        return res.status(HttpStatusCodes.BAD_REQUEST).json(
          customReponse().error(HttpStatusCodes.BAD_REQUEST, error, error.message)
        );
      }

      // Assuming FingerprintService has a deleteFingerprint method
      const success = await this.fingerprintService.deleteFingerprint(seniorId);

      if (success) {
        const response = customReponse().success(
          HttpStatusCodes.OK,
          { seniorId },
          'Fingerprint deleted successfully'
        );
        return res.status(response.statusCode).json(response);
      } else {
        const error = new Error('Failed to delete fingerprint');
        return res.status(HttpStatusCodes.BAD_REQUEST).json(
          customReponse().error(HttpStatusCodes.BAD_REQUEST, error, error.message)
        );
      }
    } catch (err) {
      console.error(`[DeleteFingerprintControllerError]: ${err}`);
      next(err);
    }
  };
}
