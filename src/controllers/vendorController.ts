import { Request, Response, NextFunction } from "express";
import { findVendor } from "./adminController";
import {
  createFoodInput,
  createOfferInput,
  loginVendorInput,
  updateVendorInput,
} from "../dto";
import { ValidatePassword, generateSignature } from "../utils";
import { foodModel } from "../models/foodModel";
import { orderModel } from "../models/orderModel";
import { offerModel } from "../models/offerModel";

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
//================Delivery=======================
const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const { lat, lng } = req.body;

  if (!user) {
    return res.json({ message: "Vendor Info not found" });
  }
  const exisitVendor = await findVendor(user._id);
  if (exisitVendor !== null) {
    exisitVendor.serviceAvaliable = !exisitVendor.serviceAvaliable;

    if (lat && lng) {
      exisitVendor.lat = lat;
      exisitVendor.lng = lng;
    }
    const vendor = await exisitVendor.save();
    res.status(200).json({ vendor });
  }
};
//========================= Food =============================
const addFoodCon = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "somthing went wrong with add food" });
  }
  const { name, description, category, foodType, readyTime, price } = <
    createFoodInput
  >req.body;
  const vendor = await findVendor(user._id);
  console.log({ vendor });

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
//========================= Order =============================
const getCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) {
    return res.json({ message: "orders not found" });
  }
  const orders = await orderModel
    .find({ vendorId: user._id })
    .populate("items.food");

  res.status(200).json({ data: orders });
};
const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: orderId } = req.params;

  const order = await orderModel.findById(orderId).populate("items.food");
  if (!order) {
    return res.status(404).json({ message: "order not found" });
  }
  res.status(200).json({ data: order });
};
const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: orderId } = req.params;
  const { status, remarks, time } = req.body;

  const order = await orderModel.findById(orderId).populate("items.food");

  order.orderStatus = status;
  order.remarks = remarks;
  time ? (order.readyTime = time) : order.readyTime;

  const orderResult = await order.save();

  if (!order) {
    return res.status(404).json({ message: "unable to process order!" });
  }
  res.status(200).json({ data: orderResult });
};
//========================= Offers =============================
const addOfferCon = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  const {
    offerType,
    title,
    description,
    minValue,
    offreAmount,
    strtValidity,
    endValidity,
    promoCode,
    promoType,
    bank,
    bins,
    pinCode,
    isActive,
  } = <createOfferInput>req.body;

  const vendor = await findVendor(user._id);

  if (!vendor) {
    return res.status(404).json({ message: "unable to add Offer!" });
  }

  const offerData = {
    offerType,
    title,
    description,
    minValue,
    offreAmount,
    strtValidity,
    endValidity,
    promoCode,
    promoType,
    bank,
    bins,
    pinCode,
    isActive,
    vendors: [vendor],
  };
  const offer = await offerModel.create(offerData);

  res.status(201).json({ message: "success", data: offer });
};
const editOfferCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export {
  vendorLoginCon,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  addFoodCon,
  getFoodCon,
  getCurrentOrders,
  getOrderDetails,
  processOrder,
  addOfferCon,
  editOfferCon,
};
