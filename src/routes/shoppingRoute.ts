import express from "express";
import {
  getAllFoods,
  getFoodAvaliability,
  getFoodIn30Min,
  getRestaurantById,
  getTopRestaurants,
} from "../controllers";

const router = express();

//=========================Food Avaliability =============================
router.get("/:pincode", getFoodAvaliability);
//========================= Top Restaurants =============================
router.get("/top-restaurants/:pincode", getTopRestaurants);
//=========================Food Avaliabile in 30 min =============================
router.get("/foods-in-30-min/:pincode", getFoodIn30Min);
//=========================Search Foods =============================
router.get("/search/:pincode", getAllFoods);
//=========================Find Restaurants By ID =============================
router.get("/restaurant/:id", getRestaurantById);

export { router as shoppingRoute };
