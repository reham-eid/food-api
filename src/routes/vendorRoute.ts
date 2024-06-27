import { authentication } from "../middlewares/commonAuth";
import express from "express";
import multer, { diskStorage } from "multer";
import {
  addFoodCon,
  getFoodCon,
  getVendorProfile,
  updateVendorCoverImage,
  updateVendorProfile,
  updateVendorService,
  vendorLoginCon,
} from "../controllers";

const router = express();

const imageStorage = diskStorage({
  destination(req, file, cb) {
    cb(null, "images");
  },
  filename(req, file, cb) {
    cb(null, new Date().toISOString + "-" + file.originalname);
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

export { router as vendorRoute };
