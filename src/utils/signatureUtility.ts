import jwt from "jsonwebtoken";
import { Request } from "express";
import { AuthPayload } from "../dto/auth.dto";
import { JWT_SECRET } from "../config/env";

export const generateSignature = (payload: AuthPayload) => {
  const secret = JWT_SECRET as string;
  return jwt.sign(payload, secret, { expiresIn: "5d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Auth");
  const secret = JWT_SECRET;
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
