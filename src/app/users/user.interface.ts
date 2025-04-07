import * as admin from "firebase-admin";

export interface IUser {
  id?: string;
  
  firstName: string;
  middleName?: string;
  lastName: string;

  userImg?: string;

  email: string;
  password?: string;
  confirmPassword?: string;
  
  isVerified?: boolean;
  status?: string;
  createdAt?: admin.firestore.FieldValue;
  updatedAt?: admin.firestore.FieldValue;

  userRole: "senior_citizen" | "admin" | "pharmacist";
}
