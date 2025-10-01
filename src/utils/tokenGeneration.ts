import jwt from "jsonwebtoken";
import { IUser } from "../models/userModels";

export const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.userRole }, // payload
    process.env.JWT_SECRET || "secretkey",                   // secret key
    { expiresIn: "1d" }                                      // token expiration
  );
};
