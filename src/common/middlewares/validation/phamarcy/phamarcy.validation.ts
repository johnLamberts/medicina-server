import { validator } from "@/utils";
import { NextFunction } from "express";
import addUserPhamarcy from "./phamarcy.schema";


export const addPhamarcyValidation: any = async (
  req: Request, res: Response, next: NextFunction
) => await validator(addUserPhamarcy, req.body!, next)
