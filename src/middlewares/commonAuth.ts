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
  try {
    const validation = await validateSignature(req);
    if (!validation) {
      return res.json({ message: "user not authorize" });
    }
    next();
  } catch (error) {
    // console.log("errorName " , error.name , "errorMessage " ,error.message);
        if (error.name == "TokenExpiredError") {
          return res.status(400).json({
            message: "token expired",
            success: false,
          })
        }
    
        if (error.name == "JsonWebTokenError") {
          return res.status(200).json({
            message: "invalid token",
            success: false,
          })
        }
  }

};
