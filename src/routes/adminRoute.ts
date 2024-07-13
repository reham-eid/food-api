import express from "express";
import {
  createVendorCon,
  getDeliveryUsers,
  getTransactionById,
  getTransactions,
  getVendorById,
  getVendors,
  verifyDelivery,
} from "../controllers";

const router = express();

router.post("/vendors", createVendorCon);
router.get("/vendors", getVendors);
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);
router.get("/vendors/:vendorId", getVendorById);
router.put('/delivery/verify',verifyDelivery)
router.get('/delivery/users',getDeliveryUsers)

export { router as adminRoute };
