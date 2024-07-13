import jwt from "jsonwebtoken";
import { Request } from "express";
import { AuthPayload } from "../dto/auth.dto";
import config from "config";

const jwt_secret = config.get("JWT_SECRET") as string;
export const generateSignature = (payload: AuthPayload) => {
  const secret = jwt_secret;
  return jwt.sign(payload, secret, { expiresIn: "5d" });
};

export const validateSignature = async (req: Request) => {
  const signature = req.get("Auth");
  const secret = jwt_secret;
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
