import { authentication } from "../middlewares/commonAuth";
import express from "express";
import multer, { diskStorage } from "multer";
import {
  addFoodCon,
  addOfferCon,
  editOfferCon,
  getCurrentOrders,
  getFoodCon,
  getOffersCon,
  getOrderByIdCon,
  getOrderDetails,
  getVendorProfile,
  processOrder,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLoginCon,
} from "../controllers";
import { mkdirSync, existsSync } from "fs";
import { resolve } from "path";
const router = express();

const imageStorage = diskStorage({
  destination(req, file, cb) {
    const folderPath = resolve("src/uploads/images");
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true }); // Create nested folders
    }
    cb(null, folderPath);
  },
  filename(req, file, cb) {
    const uniqueFileName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueFileName + "." + file.mimetype.split("/")[1]
    );
  },
});
const image = multer({ storage: imageStorage }).array("images", 4);

router.post("/login", vendorLoginCon);

router.use(authentication);
router.get("/profile", getVendorProfile);
router.put("/profile", updateVendorProfile);
router.put("/cover-image", image, updateVendorCoverImage);
router.get("/service", updateVendorService);

router.post("/food", image, addFoodCon);
router.get("/food", getFoodCon);
//========================= Order =============================
router.get("/orders",getCurrentOrders)
router.put("/order/:id/process",processOrder)
router.get("/order/:id",getOrderDetails)
//========================= Offers =============================
router.get("/offers",getOffersCon)
router.post("/offer",addOfferCon)
router.put("/offer/:id",editOfferCon)

export { router as vendorRoute };
