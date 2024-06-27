"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.default)();
exports.customerRoute = router;
//========================= SignUp / create customer =============================
router.post("/signup", controllers_1.customerSignUp);
//========================= Login =============================
router.post("/login", controllers_1.customerLogin);
router.use(middlewares_1.authentication);
//========================= verify customer account =============================
router.patch("/verify", controllers_1.customerVerify);
//========================= OTP =============================
router.get("/otp", controllers_1.requestOtp);
//========================= Profile =============================
router.get("/profile", controllers_1.getCustomerProfile);
router.put("/profile", controllers_1.editCustomerProfile);
//# sourceMappingURL=customerRoute.js.map