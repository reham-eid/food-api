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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const signatureUtility_1 = require("../utils/signatureUtility");
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validation = yield (0, signatureUtility_1.validateSignature)(req);
    if (!validation) {
        return res.json({ message: "user not authorize" });
    }
    next();
});
exports.authentication = authentication;
//# sourceMappingURL=commonAuth.js.map