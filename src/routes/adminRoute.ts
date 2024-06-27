import express from "express";
import { createVendorCon, getVendorById, getVendors } from "../controllers";

const router = express();

router.post("/", createVendorCon);
router.get("/", getVendors);
router.get("/:vendorId", getVendorById);

export { router as adminRoute };
