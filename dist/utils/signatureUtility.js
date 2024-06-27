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
exports.validateSignature = exports.generateSignature = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../config/.env" });
const generateSignature = (payload) => {
    const secret = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn: "1d" });
};
exports.generateSignature = generateSignature;
const validateSignature = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.get("Auth");
    const secret = process.env.JWT_SECRET;
    if (signature) {
        const payload = (yield jsonwebtoken_1.default.verify(signature.split(" ")[1], secret));
        req.user = payload;
        return true;
    }
    return false;
});
exports.validateSignature = validateSignature;
//# sourceMappingURL=signatureUtility.js.map