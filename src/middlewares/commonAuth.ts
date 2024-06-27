import { AuthPayload } from '../dto/auth.dto';
import { validateSignature } from '../utils/signatureUtility';
import { NextFunction, Request, Response } from "express";

// so req.user in payload of token has type
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = await validateSignature(req);
  if (!validation) {
    return res.json({ message: "user not authorize" });
  }
  next();
};
