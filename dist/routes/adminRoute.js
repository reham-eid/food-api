"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = (0, express_1.default)();
exports.adminRoute = router;
router.post("/", controllers_1.createVendorCon);
router.get("/", controllers_1.getVendors);
router.get("/:vendorId", controllers_1.getVendorById);
//# sourceMappingURL=adminRoute.js.map