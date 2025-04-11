import { supabase } from "@/config";
import { HttpStatusCodes } from "@/constants";
import { TPaginationResponse } from "@/interface";
import { customReponse } from "@/utils";
import { decode } from "base64-arraybuffer";
import { NextFunction, Request, Response } from "express";
import IPharmacy from "./phamarcy.interface";
import PharmacyService from "./phamarcy.service";

export class PharmacyController {

  private phamarcyService: PharmacyService | any;
  
  constructor() {
    this.phamarcyService = new PharmacyService();
   }


   addPhamarcyHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {


      console.log(req.body.pharmacyImg)

      let storageRefUrl = '';
            
      if (req.body.pharmacyImg && req.body.pharmacyImg.startsWith('data:image/')) {
        // The cover photo is Base64-encoded
        const base64Image = req.body.pharmacyImg;
       
        const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image
  
      // Upload image to Supabase Storage
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('booklet-senior')
        .upload(`phamarcy/${Date.now()}-cover.png`, decode(base64Data), {
          contentType: 'image/png'
        })
  
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`)
        }

        // Get public URL for the uploaded image
        const { data: urlData } = await supabase.storage
        .from('booklet-senior')
        .getPublicUrl(imageData.path)


        storageRefUrl = urlData.publicUrl;

      }


      console.log(storageRefUrl)

      const userData = {
        ...req.body,
        pharmacyImg: storageRefUrl
      }


      const data = await this.phamarcyService.createPharmacy(userData);


      const response = customReponse().success(HttpStatusCodes.OK, data, `Phamarcy has been added.`)

      return res.status(response.statusCode).json(response);

    } catch (err) {
      console.log(`[AddPhamarcyControllerError]: ${err}`)
      
      next(err);

    }
  }

  getPharmaciesHandler = async (_req: Request, res: TPaginationResponse) => {
    try {
      if(res.paginatedResults) {
        const { results, next, previous, currentPage, totalDocs, totalPages, lastPage } = res.paginatedResults;
  
        const responseObject: any = {
          totalDocs: totalDocs || 0,
          totalPages: totalPages || 0,
          lastPage: lastPage || 0,
          count: results?.length || 0,
          currentPage: currentPage || 0,
        };
  
        if(next) {
          responseObject.nextPage = next;
        }
        if(previous) {
          responseObject.prevPage = previous;
        }
  
        responseObject.pharmacies = results?.map((user: IPharmacy) => {
          return {
            ...user,
            request: {
              type: 'GET',
              description: 'Get one phamarcy with the ID',
              url: `http://localhost:8080/api/v1/phamarcy/${user.pharmacy_id}`
            }
          }
        })
  
        const success = customReponse<typeof responseObject>().success(HttpStatusCodes.OK, responseObject, "Successfully found pharmacies");
  
        return res.status(success.statusCode).json(success)
      } else {
        const error = customReponse().error(404, new Error('No students found.'), "No students found")
        return res.status(error.statusCode).json(error)
      }
    } catch (error) {
      return res.status(500).send(
        customReponse().error(404, error as Error, 'An error occurred while retrieving products')
      )
    }
  } 
  
  updatePhamarcyHandler = async (req: Request, res: Response, next: NextFunction) => {
      try {
       
        console.log(req.body)
      let pharmacyImg = req.body.pharmacyImg;

        
      if (req.body.pharmacyImg && req.body.pharmacyImg.startsWith('data:image/')) {
        // The cover photo is Base64-encoded
        const base64Image = req.body.pharmacyImg;
        const base64Data = base64Image.includes('base64,') 
        ? base64Image.split('base64,')[1] 
        : base64Image
  
      // Upload image to Supabase Storage
      const { data: imageData, error: uploadError } = await supabase.storage
        .from('booklet-senior')
        .upload(`pharmacy/${Date.now()}-cover.png`, decode(base64Data), {
          contentType: 'image/png'
        })
  
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`)
        }

        // Get public URL for the uploaded image
        const { data: urlData } = await supabase.storage
        .from('booklet-senior')
        .getPublicUrl(imageData.path)


        pharmacyImg = urlData.publicUrl;

      }

    
        // Prepare medicine data
        const medicine: IPharmacy = {
          ...req.body,
          pharmacyImg,
        };
    
        // Update medicine
        const updatedMedicine = await this.phamarcyService.updatePharmacy(medicine);
    
        const response = customReponse().success(
          HttpStatusCodes.OK,
          updatedMedicine.data,
          'Pharmacy has been updated successfully.'
        );
    
        return res.status(response.statusCode).json(response);
      } catch (err) {
        console.error(`[UpdatePhamarcyControllerError]: ${err}`);
        next(err);
      }
    }
}
