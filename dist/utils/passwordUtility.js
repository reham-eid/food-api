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
exports.ValidatePassword = exports.generateHashPassword = exports.generateSalt = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt();
});
exports.generateSalt = generateSalt;
const generateHashPassword = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.hashSync(password, salt);
});
exports.generateHashPassword = generateHashPassword;
const ValidatePassword = (password, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.generateHashPassword)(password, salt)) === savedPassword;
});
exports.ValidatePassword = ValidatePassword;
//# sourceMappingURL=passwordUtility.js.map