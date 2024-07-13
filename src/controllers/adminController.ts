import { Request, Response, NextFunction } from "express";
import { createVendorInput } from "../dto";
import { vendorModel } from "../models/vendorModel";
import { generateHashPassword, generateSalt } from "../utils";
import { deliveryModel, transactionModel } from "../models";

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
    lat,
    lng,
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
    foods: [],
    lat: 0,
    lng: 0,
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

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transactions = await transactionModel.find();
  if (transactions.length > 0) {
    return res.status(200).json({ transactions });
  }
  res.json({ message: `no Transactions available` });
};

const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: transactionId } = req.params;
  const transactions = await transactionModel.findById(transactionId);
  if (transactions !== null) {
    return res.status(200).json({ transactions });
  }
  res.json({
    message: `transaction data with the ID ${transactionId} is not available`,
  });
};

// ==============================
const verifyDelivery = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id, status } = req.body;

    const profile = await deliveryModel.findById(_id);

    if (!profile) {
      return res
        .status(400)
        .json({ message: "unable to verify delivery user" });
    }

    profile.verified = status;
    const reslut = await profile.save();

    res.status(200).json({ message: "user delivery is verified ", reslut });
  } catch (error) {
    next(error);
  }
};

const getDeliveryUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deliveryUsers = await deliveryModel.find();

    res.status(200).json({ message: " delivery users", deliveryUsers });
  } catch (error) {
    next(error);
  }
};

export {
  createVendorCon,
  getVendors,
  getVendorById,
  getTransactions,
  getTransactionById,
  verifyDelivery,
  getDeliveryUsers
};

//==========================helper-function===================
export const findVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await vendorModel
      .findOne({ email })
      .populate("foods", "name description price")
      .exec();
  } else {
    return await vendorModel
      .findById(id)
      .populate("foods", "name description price")
      .exec();
  }
};
//============================================================
