import express from "express";
import { FingerprintController } from "./fingerprint.controller";

const router = express.Router();

const fingerprintController = new FingerprintController();

// Register a new fingerprint
router.post('/register', (fingerprintController as any).registerFingerprintHandler);

// Check if a senior has a registered fingerprint
router.get('/has-registered/:seniorId', (fingerprintController as any).hasRegisteredFingerprintHandler);

// Get active fingerprint templates
router.get('/templates/:seniorId', (fingerprintController as any).getActiveTemplatesHandler);


export const FingerprintRoute: express.Router = router;
