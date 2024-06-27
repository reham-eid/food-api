"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorRoute = void 0;
const commonAuth_1 = require("../middlewares/commonAuth");
const express_1 = __importDefault(require("express"));
const multer_1 = __importStar(require("multer"));
const controllers_1 = require("../controllers");
const router = (0, express_1.default)();
exports.vendorRoute = router;
const imageStorage = (0, multer_1.diskStorage)({
    destination(req, file, cb) {
        cb(null, "images");
    },
    filename(req, file, cb) {
        cb(null, new Date().toISOString + "-" + file.originalname);
    },
});
const image = (0, multer_1.default)({ storage: imageStorage }).array("images", 4);
router.post("/login", controllers_1.vendorLoginCon);
router.use(commonAuth_1.authentication);
router.get("/profile", controllers_1.getVendorProfile);
router.put("/profile", controllers_1.updateVendorProfile);
router.put("/cover-image", image, controllers_1.updateVendorCoverImage);
router.get("/service", controllers_1.updateVendorService);
router.post("/food", image, controllers_1.addFoodCon);
router.get("/food", controllers_1.getFoodCon);
//# sourceMappingURL=vendorRoute.js.map