import { Request, Response, NextFunction } from "express";
import { createVendorInput } from "../dto";
import { vendorModel } from "../models/vendorModel";
import { generateHashPassword, generateSalt } from "../utils";

const createVendorCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    phone,
    email,
    password,
  } = <createVendorInput>req.body;
  const exisitVendor = await findVendor("", email);
  if (exisitVendor) {
    return res.json({
      message: `vendor exisit with the same email ID { ${email} }`,
    });
  }
  // generate salt
  const salt = await generateSalt();
  const hashedPass = await generateHashPassword(password, salt);

  const vendor = await vendorModel.create({
    name,
    ownerName,
    foodType,
    pinCode,
    address,
    phone,
    email,
    password: hashedPass,
    salt,
    serviceAvaliable: false,
    coverImages: [],
    rating: 0,
    foodes: [],
  });
  return res.json({ message: "success", vendor });
};

const getVendors = async (req: Request, res: Response, next: NextFunction) => {
  const vendors = await vendorModel.find();
  if (vendors !== null) {
    return res.json({ vendors });
  }
  res.json({ message: "vendors data not available" });
};

const getVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.vendorId;
  const vendor = await findVendor(id);
  if (vendor !== null) {
    return res.json({ vendor });
  }
  res.json({ message: `vendor data with the ID ${id} is not available` });
};

export { createVendorCon, getVendors, getVendorById };

//==========================helper-function===================
export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await vendorModel.findOne({ email });
  } else {
    return await vendorModel.findById(id);
  }
};
//============================================================
