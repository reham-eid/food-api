import { Request, Response, NextFunction } from "express";
import { findVendor } from "./adminController";
import { createFoodInput, loginVendorInput, updateVendorInput } from "../dto";
import { ValidatePassword, generateSignature } from "../utils";
import { foodModel } from "../models/foodModel";

const vendorLoginCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <loginVendorInput>req.body;

  const exisitVendor = await findVendor("", email);

  if (exisitVendor !== null) {
    const comparePass = await ValidatePassword(
      password,
      exisitVendor.password,
      exisitVendor.salt
    );
    if (comparePass) {
      const signature = generateSignature({
        _id: exisitVendor.id,
        name: exisitVendor.name,
        email: exisitVendor.email,
        foodType: exisitVendor.foodType,
      });
      return res.json({ vendor: exisitVendor, token: signature });
    } else {
      return res.json({ message: "password not valid" });
    }
  }
  res.json({ message: "Login credential not valid" });
};

const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "Vendor Info not found" });
  }
  const exisitVendor = await findVendor(user._id);
  res.json({ vendor: exisitVendor });
};

const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address, name, phone, foodType } = <updateVendorInput>req.body;
  const user = req.user;
  if (!user) {
    return res.json({ message: "Vendor Info not found" });
  }
  const exisitVendor = await findVendor(user._id);
  if (exisitVendor !== null) {
    name ? (exisitVendor.name = name) : exisitVendor.name,
      address ? (exisitVendor.address = address) : exisitVendor.address,
      phone ? (exisitVendor.phone = phone) : exisitVendor.phone,
      foodType ? (exisitVendor.foodType = foodType) : exisitVendor.foodType;

    const vendor = await exisitVendor.save();
    res.json({ vendor });
  }
};
const updateVendorCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "somthing went wrong with add food" });
  }

  const vendor = await findVendor(user._id);
  if (vendor !== null) {
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);
    vendor.coverImages.push(...images);
    const createdCoverImg = await vendor.save();
    res.json({ data: createdCoverImg });
  }
};
const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "Vendor Info not found" });
  }
  const exisitVendor = await findVendor(user._id);
  if (exisitVendor !== null) {
    exisitVendor.serviceAvaliable = !exisitVendor.serviceAvaliable;
    const vendor = await exisitVendor.save();
    res.json({ vendor });
  }
};

const addFoodCon = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "somthing went wrong with add food" });
  }
  const { name, description, category, foodType, readyTime, price } = <
    createFoodInput
  >req.body;
  const vendor = await findVendor(user._id);
  if (vendor !== null) {
    const files = req.files as [Express.Multer.File];
    const images = files.map((file: Express.Multer.File) => file.filename);
    const createdFood = await foodModel.create({
      vendorId: vendor._id,
      name,
      description,
      category,
      foodType,
      readyTime,
      price,
      rating: 0,
      images,
    });

    vendor.foods.push(createdFood);
    const result = await vendor.save();
    res.json({ data: result });
  }
};

const getFoodCon = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "fooods Info not found" });
  }
  const food = await foodModel.find({ vendorId: user._id });
  res.json({ data: food });
};

export {
  vendorLoginCon,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  addFoodCon,
  getFoodCon,
};
