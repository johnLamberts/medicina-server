import { addUserValidation } from "@/common/middlewares/validation";
import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();



router.get("/", UserController.getUsersHandler)
router.post("/create_user", addUserValidation, UserController.addUserHandler)


export const UserRoute: express.Router = router;
