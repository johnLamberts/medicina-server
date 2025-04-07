  import { HttpStatusCodes } from "@/constants";
import { customReponse } from "@/utils";
import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";

  // export class UserController {
  //   private userService: UserService | any;

  //   constructor() {
      
  //     this.userService = new UserService();

  //   }


  //   async getUserHandler (req: Request, res: Response): Promise<void> {
  //     // try {
  //     //   const users = await this.userService.getAllUsers();
        
  //     //   const response = customReponse().success(HttpStatusCodes.OK, users, `Retrieve student details successfully.`)

  //     //   return res.status(response.statusCode).json(response);
        
  //     // } catch (error) {
  //     //   return res.status(500).send(
  //     //     customReponse().error(404, error as Error, 'An error occurred while retrieving products')
  //     //   )
  //     // }

  //     try {
  //       const students = await this.userService.getAllUsers();
  //       console.log(this.userService.getAllUsers(), students)
  //        res.json({
  //         data: students,
  //         status: "Success",
  //       });
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         res.status(500).json({
  //           error: err.message,
  //         });
  //       }
  //     }
  //   }
  // }



  const getUsersHandler = async (req: Request, res: Response): Promise<any> => {
    try {
      const userService = new UserService();
      const students = await userService.getAllUsers();
  
      res.json({
        data: students,
        status: "Success",
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({
          error: err.message,
        });
      }
    }
  }

  const addUserHandler = async(req: Request, res: Response, next: NextFunction) => {
    try {

      
      const userService = new UserService();


      const data = await userService.createUser({ ...req.body });


      const response = customReponse().success(HttpStatusCodes.OK, data, `User has been added.`)

      res.status(HttpStatusCodes.OK).json({
        statusCode: HttpStatusCodes.OK, data: data, message: 'User has been added.'
      })

    } catch (err) {
      console.log(`[AddStudentControllerError]: ${err}`)
      
      next(err);

    }
  }




  export const UserController = { getUsersHandler, addUserHandler };
