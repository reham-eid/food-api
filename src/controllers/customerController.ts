import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import {
  createCustomerInput,
  editCustomerProfileInput,
  loginCustomerInput,
} from "../dto/customer.dto";
import {
  generateSalt,
  generateHashPassword,
  GenerateOtp,
  generateSignature,
  onRequestOtp,
  ValidatePassword,
} from "../utils";
import { customerModel } from "../models/customerModel";

const customerSignUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert the request body to an instance of createCustomerInput and validate it
    const customerInputs = plainToClass(createCustomerInput, req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });
    // If there are validation errors, return a 400 status code with the error details
    if (inputError.length > 0) {
      return res
        .status(400)
        .json({ message: `Error in customer SignUp inputs { ${inputError} }` });
    }

    // Destructure phone, email, and password from the validated input data
    const { phone, email, password } = customerInputs;

    // Generate a salt for password hashing
    const salt = await generateSalt();
    // Hash the password using the generated salt
    const hashedPass = await generateHashPassword(password, salt);

    // Generate a one-time password (OTP) and its expiry time
    const { otp, expiry } = GenerateOtp();
    console.log(`OTP >> ${otp} , OTP_expiry >> ${expiry}`);

    const exisitCustomer = await customerModel.findOne({ email });
    if (exisitCustomer !== null) {
      return res
        .status(409)
        .json({ message: " an user exisit with the same email " });
    }
    // Create an object with customer data including default values for firstName and lastName
    const data = {
      firstName: "e",
      lastName: "a",
      address: "",
      phone,
      email,
      password: hashedPass,
      salt,
      verfied: false, // Note: This should be 'verified'
      otp,
      otp_expiry: expiry,
      lat: 0,
      lng: 0,
    };

    // Save the customer data to the database
    const result = await customerModel.create(data);

    // If the operation fails, return a JSON response indicating an error
    if (!result) {
      return res.json({ message: "somthin went wrong in customer signup" });
    }

    // // Send the OTP to the customer's phone number
    // await onRequestOtp(otp, phone);

    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: result.id,
      email: result.email,
      verfied: result.verfied, // Note: This should be 'verified'
    });

    // Respond with a JSON object containing a success message, the generated signature,
    // the verification status, and the customer's email
    res.json({
      message: "success",
      signature,
      verfied: result.verfied, // Note: This should be 'verified'
      email: result.email,
    });
  } catch (error) {
    next(error);
  }
};

const customerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Convert the request body to an instance of createCustomerInput and validate it
    const customerInputs = plainToClass(loginCustomerInput, req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });

    if (inputError.length > 0) {
      return res
        .status(400)
        .json({ message: `Error in customer Login inputs { ${inputError} }` });
    }

    const { email, password } = customerInputs;

    const exisitCustomer = await customerModel.findOne({ email });
    if (!exisitCustomer) {
      return res
        .status(404)
        .json({ message: "user not found with this email " });
    }

    const comparePass = await ValidatePassword(
      password,
      exisitCustomer.password,
      exisitCustomer.salt
    );
    if (!comparePass) {
      return res
        .status(404)
        .json({ message: "passrod is wrong in customer login" });
    }
    // Generate a signature for the customer using their ID, email, and verified status
    const signature = generateSignature({
      _id: exisitCustomer.id,
      email: exisitCustomer.email,
      verfied: exisitCustomer.verfied,
    });
    // the verification status, and the customer's email
    res.json({
      message: "success",
      signature,
      verfied: exisitCustomer.verfied,
      email: exisitCustomer.email,
    });
  } catch (error) {
    next(error);
  }
};

const customerVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otp } = req.body;
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    // If the operation fails, return a JSON response indicating an error
    if (!profile) {
      return res.json({ message: "somthin went wrong in verify customer" });
    }

    if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
      profile.verfied = true;
      await profile.save();

      const signature = generateSignature({
        _id: profile.id,
        email: profile.email,
        verfied: profile.verfied,
      });

      res.json({
        message: "success",
        signature,
        verfied: profile.verfied,
        email: profile.email,
      });
    }
  } catch (error) {
    next(error);
  }
};

const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({
        message: "somthin went wrong in request OTP customer",
      });
    }
    const { otp, expiry } = GenerateOtp();

    profile.otp = otp;
    profile.otp_expiry = expiry;
    await profile.save();

    const sendOtp = onRequestOtp(otp, profile.phone);

    res.json({
      status: "success",
      message: "OTP send to your phone",
      sendOtp,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;

    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile customer" });
    }
    res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
};

const editCustomerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = req.user;
    const customerInputs = plainToClass(editCustomerProfileInput , req.body);
    const inputError = await validate(customerInputs, {
      validationError: { target: true },
    });
    if (inputError.length > 0) {
      return res.status(400).json({ inputError });
    }
    const { firstName, lastName, address } = customerInputs;
    const profile = await customerModel.findById(customer?._id);

    if (!profile) {
      return res.json({ message: "somthin went wrong in Profile customer" });
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

export {
  customerSignUp,
  customerLogin,
  customerVerify,
  requestOtp,
  getCustomerProfile,
  editCustomerProfile,
};
