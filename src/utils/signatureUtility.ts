import jwt from "jsonwebtoken";
import { Request } from "express";
import { AuthPayload } from "../dto/auth.dto";
import dotenv from "dotenv";

dotenv.config({ path: "../config/.env" });

export const generateSignature = (payload: AuthPayload) => {
  const secret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Auth");
  const secret = process.env.JWT_SECRET as string;
  if (signature) {
    const payload = (await jwt.verify(
      signature.split(" ")[1],
      secret
    )) as AuthPayload;
    req.user = payload;
    return true;
  }
  return false;
};
