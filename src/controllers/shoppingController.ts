import { Request, Response, NextFunction } from "express";
import { offerModel, vendorModel } from "../models";
import { foodDoc } from "../models/foodModel";

const getFoodAvaliability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode: pinCode } = req.params;

  const vendor = await vendorModel
    .find({ pinCode, serviceAvaliable: false }) // true
    .sort([["rating", "descending"]])
    .populate("foods");
  if (vendor.length < 0) {
    return res.json({ message: "NO Food Avaliability" });
  }
  return res.json({ vendor });
};

const getTopRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { pincode: pinCode } = req.params;

    const vendor = await vendorModel
      .find({ pinCode, serviceAvaliable: false })
      .sort([["rating", "descending"]])
      .limit(10);
    if (vendor.length === 0) {
      return res.json({ message: "NO Food Avaliability" });
    }
    return res.json({ data: vendor });
  } catch (error) {
    next(error);
  }
};

const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode: pinCode } = req.params;

  const result = await vendorModel
    .find({ pinCode, serviceAvaliable: false })
    .populate("foods");
  if (result.length < 0) {
    return res.json({ message: "NO Food Avaliability" });
  }
  const foodResult: any = [];
  result.map((vendor) => {
    const foods = vendor.foods as [foodDoc];
    foodResult.push(...foods.filter((food) => food.readyTime <= 30));
  });
  return res.json({ foodResult });
};
const getAllFoods = async (req: Request, res: Response, next: NextFunction) => {
  const { pincode: pinCode } = req.params;

  const result = await vendorModel
    .find({ pinCode, serviceAvaliable: false })
    .populate("foods");
  if (result.length < 0) {
    return res.json({ message: "NO Food Avaliability" });
  }
  const foodResult: any = [];
  result.map((vendor) => foodResult.push(vendor.foods));
  return res.json({ foodResult });
};
const getRestaurantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const vendor = await vendorModel.findById(id).populate("foods");
  if (!vendor) {
    return res.status(400).json({ message: "NO Food Avaliability" });
  }
  return res.status(200).json({ vendor });
};
//========================= Offers =============================
const getOffersCon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pinCode } = req.params;
  const offer = await offerModel.find({ pinCode, isActive: true });
  if (!offer) {
    return res.status(400).json({ message: "NO offers Avaliability" });
  }
  res.status(200).json({ offer });
};

export {
  getFoodAvaliability,
  getFoodIn30Min,
  getAllFoods,
  getTopRestaurants,
  getRestaurantById,
  getOffersCon,
};
