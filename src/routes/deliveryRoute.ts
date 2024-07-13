import express from "express";
import {
  deliveryLogin,
  deliverySignUp,
  getDeliveryProfile,
  editDeliveryProfile,
  editDeliveryUserStatus,
} from "../controllers";
import { authentication } from "../middlewares";

const router = express();

//========================= SignUp =============================
router.post("/signup", deliverySignUp );
//========================= Login =============================
router.post("/login", deliveryLogin);

router.use(authentication);
//========================= Change Service Status =============================
//delivery person can be online or offline 
router.put("/change-status",editDeliveryUserStatus);

//========================= Profile =============================
router.get("/profile", getDeliveryProfile);
router.put("/profile", editDeliveryProfile);

export { router as deliveryRoute };
