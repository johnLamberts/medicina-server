import { validator } from "@/utils";
import { NextFunction } from "express";
import addMedicineSchema from "./medicine.schema";


export const addMedicineValidation: any = async (
  req: Request, res: Response, next: NextFunction
) => await validator(addMedicineSchema, req.body!, next)
