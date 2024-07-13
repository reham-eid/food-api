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
  createOrderCon,
  getAllOrdersCon,
  getOrderByIdCon,
  addToCartCon,
  getCartCon,
  deleteCartCon,
  applayOfferCon,
  createPaymentCon,
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
//========================= Cart =============================
router.post("/cart", addToCartCon);
router.get("/cart", getCartCon);
router.delete("/cart", deleteCartCon);
//=========================Apply Offers =============================
router.get("/offer/verify/:id", applayOfferCon);
//========================= Payment =============================
router.post("/create-payment", createPaymentCon);
//========================= Order =============================
router.post("/create-order", createOrderCon);
router.get("/orders", getAllOrdersCon);
router.get("/order/:id", getOrderByIdCon);

export { router as customerRoute };
