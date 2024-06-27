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
exports.findVendor = exports.getVendorById = exports.getVendors = exports.createVendorCon = void 0;
const vendorModel_1 = require("../models/vendorModel");
const utils_1 = require("../utils");
const createVendorCon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, ownerName, foodType, pinCode, address, phone, email, password, } = req.body;
    const exisitVendor = yield (0, exports.findVendor)("", email);
    if (exisitVendor) {
        return res.json({
            message: `vendor exisit with the same email ID { ${email} }`,
        });
    }
    // generate salt
    const salt = yield (0, utils_1.generateSalt)();
    const hashedPass = yield (0, utils_1.generateHashPassword)(password, salt);
    const vendor = yield vendorModel_1.vendorModel.create({
        name,
        ownerName,
        foodType,
        pinCode,
        address,
        phone,
        email,
        password: hashedPass,
        salt,
        serviceAvaliable: false,
        coverImages: [],
        rating: 0,
        foodes: [],
    });
    return res.json({ message: "success", vendor });
});
exports.createVendorCon = createVendorCon;
const getVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendorModel_1.vendorModel.find();
    if (vendors !== null) {
        return res.json({ vendors });
    }
    res.json({ message: "vendors data not available" });
});
exports.getVendors = getVendors;
const getVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.vendorId;
    const vendor = yield (0, exports.findVendor)(id);
    if (vendor !== null) {
        return res.json({ vendor });
    }
    res.json({ message: `vendor data with the ID ${id} is not available` });
});
exports.getVendorById = getVendorById;
//==========================helper-function===================
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield vendorModel_1.vendorModel.findOne({ email });
    }
    else {
        return yield vendorModel_1.vendorModel.findById(id);
    }
});
exports.findVendor = findVendor;
//============================================================
//# sourceMappingURL=adminController.js.map