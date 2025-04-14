import { usersFeature } from "@/common/middlewares/sort-filter-pagination/sb-users.features";
import { addUserValidation } from "@/common/middlewares/validation";
import express from "express";
import UserController from "./user.controller";

const router = express.Router();

const userController = new UserController;


// router.get("/", UserController.getUsersHandler)
router.post("/create_user", addUserValidation, (userController as any).addUserHandler)
router.put("/update_user", (userController as any).updateUserHandler)
router.put("/archive_user", (userController as any).updateUserArchiveHandler)
router.put("/unarchive_user", (userController as any).updateUserUnarchiveHandler)
router.get("/", usersFeature(), userController.getStudentsHandler as any)
// router.get('/api/v1/user/:id', (userController as any).getOneUserHandler);


export const SbUserRoute: express.Router = router;
