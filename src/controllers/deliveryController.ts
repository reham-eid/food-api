import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  createDeliveryInput,
  editCustomerProfileInput,
  loginCustomerInput,
} from "../dto/customer.dto";
import {
  generateSalt,
  generateHashPassword,
  generateSignature,
  ValidatePassword,
} from "../utils";
import { deliveryModel } from "../models/deliveryModel";

const deliverySignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deliveryInputs = plainToClass(createDeliveryInput, req.body);
    const inputError = await validate(deliveryInputs, {
      validationError: { target: true },
    });
    // If there are validation errors, return a 400 status code with the error details
    if (inputError.length > 0) {
      return res
        .status(400)
        .json({ message: `Error in delivery SignUp inputs { ${inputError} }` });
    }

    // Destructure phone, email, and password from the validated input data
    const { phone, email, password, address, firstName, lastName, pinCode } =
      deliveryInputs;

    // Generate a salt for password hashing
    const salt = await generateSalt();
    // Hash the password using the generated salt
    const hashedPass = await generateHashPassword(password, salt);

    const exisitDelivery = await deliveryModel.findOne({ email });
    if (exisitDelivery !== null) {
      return res
        .status(409)
        .json({ message: " a delivery user exisit with the same email " });
    }
    const data = {
      firstName,
      lastName,
      address,
      pinCode,
      phone,
      email,
      password: hashedPass,
      salt,
      verified: false,
      isAvaliable: false,
      lat: 0,
      lng: 0,
    };

    // Save the customer data to the database
    const result = await deliveryModel.create(data);

    // If the operation fails, return a JSON response indicating an error
    if (!result) {
      return res.json({
        message: "somthin went wrong in delivery user signup",
      });
    }

    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: result.id,
      email: result.email,
      verified: result.verified, // Note: This should be 'verified'
    });

    // Respond with a JSON object containing a success message, the generated signature,
    // the verification status, and the customer's email
    res.json({
      message: "success",
      signature,
      verified: result.verified, // Note: This should be 'verified'
      email: result.email,
    });
  } catch (error) {
    next(error);
  }
};

const deliveryLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deliveryInputs = plainToClass(loginCustomerInput, req.body);
    const inputError = await validate(deliveryInputs, {
      validationError: { target: false },
    });

    if (inputError.length > 0) {
      return res.status(400).json({
        message: `Error in delivery user Login inputs { ${inputError} }`,
      });
    }

    const { email, password } = deliveryInputs;

    const exisitDelivery = await deliveryModel.findOne({ email });
    if (!exisitDelivery) {
      return res
        .status(404)
        .json({ message: "delivery user not found with this email " });
    }

    const comparePass = await ValidatePassword(
      password,
      exisitDelivery.password,
      exisitDelivery.salt
    );
    if (!comparePass) {
      return res
        .status(404)
        .json({ message: "passwrod is wrong in delivery user login" });
    }
    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: exisitDelivery.id,
      email: exisitDelivery.email,
      verified: exisitDelivery.verified,
    });
    // the verification status, and the Delivery's email
    res.json({
      message: "success",
      signature,
      verified: exisitDelivery.verified,
      email: exisitDelivery.email,
    });
  } catch (error) {
    next(error);
  }
};

const getDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const delivery = req.user;

    const profile = await deliveryModel.findById(delivery?._id);

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile delivery" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

const editDeliveryProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const delivery = req.user;
    const deliveryInputs = plainToClass(editCustomerProfileInput, req.body);
    const inputError = await validate(deliveryInputs, {
      validationError: { target: true },
    });
    if (inputError.length > 0) {
      return res.status(400).json({ inputError });
    }
    const { firstName, lastName, address } = deliveryInputs;
    const profile = await deliveryModel.findById(delivery?._id);

    if (!profile) {
      return res.json({
        message: "somthin went wrong in Profile delivery user",
      });
    }
    profile.firstName = firstName;
    profile.lastName = lastName;
    profile.address = address;
    const result = profile.save();

    res.json({
      message: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
// ==============================
const editDeliveryUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const delivery = req.user;
    const { lat, lng } = req.body;

    const profile = await deliveryModel.findById(delivery?._id);

    if (!profile) {
      return res.status(400).json({ message: "somthin went wrong in Profile delivery" });
    }
    
    profile.lat = lat;
    profile.lng = lng;
    profile.isAvaliable = !profile.isAvaliable 

    const reslut = await profile.save();

    res.status(200).json({message:"user delivery is avaliable " , reslut})
  } catch (error) {
    next(error);
  }
};
export {
  deliverySignUp,
  deliveryLogin,
  getDeliveryProfile,
  editDeliveryProfile,
  editDeliveryUserStatus
};
