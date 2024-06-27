import express from "express";
import {
  getAllFoods,
  getFoodAvaliability,
  getFoodIn30Min,
  getRestaurantById,
  getTopRestaurants,
  customerSignUp,
  customerVerify,
  customerLogin,
  requestOtp,
  getCustomerProfile,
  editCustomerProfile,
} from "../controllers";
import { authentication } from "../middlewares";

const router = express();

//========================= SignUp / create customer =============================
router.post("/signup", customerSignUp);
//========================= Login =============================
router.post("/login", customerLogin);

router.use(authentication);
//========================= verify customer account =============================
router.patch("/verify", customerVerify);
//========================= OTP =============================
router.get("/otp", requestOtp);
//========================= Profile =============================
router.get("/profile", getCustomerProfile);
router.put("/profile", editCustomerProfile);

export { router as customerRoute };
