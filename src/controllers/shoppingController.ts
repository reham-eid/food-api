import { Request, Response, NextFunction } from "express";
import { vendorModel } from "../models";
import { foodDoc } from "../models/foodModel";

const getFoodAvaliability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode: pinCode } = req.params;

  const vendor = await vendorModel
    .find({ pinCode, serviceAvaliable: true })
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
  const { pincode: pinCode } = req.params;

  const vendor = await vendorModel
    .find({ pinCode, serviceAvaliable: true })
    .sort([["rating", "descending"]])
    .limit(10);
  if (vendor.length < 0) {
    return res.json({ message: "NO Food Avaliability" });
  }
  return res.json({ vendor });
};

const getFoodIn30Min = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { pincode: pinCode } = req.params;

  const result = await vendorModel
    .find({ pinCode, serviceAvaliable: true })
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
    .find({ pinCode, serviceAvaliable: true })
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

  const vendor = await vendorModel.findById(id).populate('foods');
  if (!vendor) {
    return res.json({ message: "NO Food Avaliability" });
  }
  return res.json({ vendor });
};

export {
  getFoodAvaliability,
  getFoodIn30Min,
  getTopRestaurants,
  getRestaurantById,
  getAllFoods,
};
