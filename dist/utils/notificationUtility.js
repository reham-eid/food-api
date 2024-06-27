"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOtp = exports.GenerateOtp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../config/.env" });
// OTP
const GenerateOtp = () => {
    const otp = Math.floor(Math.random() * 900000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000); // 30 min
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const onRequestOtp = (otp, toPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = (0, twilio_1.default)(accountSid, authToken);
    const message = yield client.messages.create({
        body: `You OTP is ${otp}`,
        to: toPhone,
        from: process.env.RECEIVE_SMS_TO,
    });
    console.log(message);
    return message;
});
exports.onRequestOtp = onRequestOtp;
//# sourceMappingURL=notificationUtility.js.map