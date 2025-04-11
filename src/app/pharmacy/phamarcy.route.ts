import { uploadImage } from "@/common/middlewares/file-upload";
import { pharmacyFeature } from "@/common/middlewares/sort-filter-pagination";
import express from "express";
import { PharmacyController } from "./phamarcy.controller";

const router = express.Router();

const phamarcyController = new PharmacyController;


// router.get("/", UserController.getUsersHandler)
router.post("/add_pharmacy", uploadImage.single('pharmacyImg'), (phamarcyController as any).addPhamarcyHandler)
router.put("/update_pharmacy", uploadImage.single('pharmacyImg'), (phamarcyController as any).updatePhamarcyHandler)
router.get("/", pharmacyFeature(), phamarcyController.getPharmaciesHandler as any)



export const PharmacyRoute: express.Router = router;
