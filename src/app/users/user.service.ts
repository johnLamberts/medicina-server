import getRandomAvatarImage from "@/utils/random-avatar.utils";
import generateRandomUsername from "@/utils/random-username.utils";
import * as admin from "firebase-admin";
import createHttpError from "http-errors";
import { IUser } from "./user.interface";

export class UserService {
  constructor() { }

  // async getUser(userId: string | undefined): Promise<IUser> {

  // }

  async createUser(payload: Partial<IUser>): Promise<Partial<IUser>> {
    try {
      // Create the user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email: payload.email,
        emailVerified: false,
        displayName: generateRandomUsername(),
        password: payload.password,
        photoURL: getRandomAvatarImage(),
        disabled: false
      });

      const userDocData: Partial<Omit<IUser, 'id' | 'password' | 'confirmPassword'>> = {
        firstName: payload?.firstName,
        middleName: payload.middleName,
        lastName: payload?.lastName,
        email: payload.email,
        userImg: getRandomAvatarImage(),
        userRole: payload.userRole || "admin",
        isVerified: false,
        status: 'active',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
  
      // Add the user document to Firestore
      await admin
        .firestore()
        .collection("users")
        .add({
          ...userDocData
        });
  
      // Combine the Auth user data and Firestore user data
      const newUser: Partial<IUser> = {
        ...userDocData,
        id: userRecord.uid,
        isVerified: userRecord.emailVerified
      };
  
      return newUser;

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        throw createHttpError(401, err.message);
      } else {
        throw createHttpError(401, 'An unknown error occurred');
      }
    }
  }

  // async updateUser(payload: Partial<IUser>, userId: string | undefined): Promise<IUser> {

  // }

  async getAllUsers() {
    const snapshot = await admin.firestore().collection("users").get();

    return snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data()
      }
    })
  }
}

export default UserService;
