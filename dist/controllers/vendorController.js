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
exports.getFoodCon = exports.addFoodCon = exports.updateVendorService = exports.updateVendorProfile = exports.updateVendorCoverImage = exports.getVendorProfile = exports.vendorLoginCon = void 0;
const adminController_1 = require("./adminController");
const utils_1 = require("../utils");
const foodModel_1 = require("../models/foodModel");
const vendorLoginCon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const exisitVendor = yield (0, adminController_1.findVendor)("", email);
    if (exisitVendor !== null) {
        const comparePass = yield (0, utils_1.ValidatePassword)(password, exisitVendor.password, exisitVendor.salt);
        if (comparePass) {
            const signature = (0, utils_1.generateSignature)({
                _id: exisitVendor.id,
                name: exisitVendor.name,
                email: exisitVendor.email,
                foodType: exisitVendor.foodType,
            });
            return res.json({ vendor: exisitVendor, token: signature });
        }
        else {
            return res.json({ message: "password not valid" });
        }
    }
    res.json({ message: "Login credential not valid" });
});
exports.vendorLoginCon = vendorLoginCon;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.json({ message: "Vendor Info not found" });
    }
    const exisitVendor = yield (0, adminController_1.findVendor)(user._id);
    res.json({ vendor: exisitVendor });
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, name, phone, foodType } = req.body;
    const user = req.user;
    if (!user) {
        return res.json({ message: "Vendor Info not found" });
    }
    const exisitVendor = yield (0, adminController_1.findVendor)(user._id);
    if (exisitVendor !== null) {
        name ? (exisitVendor.name = name) : exisitVendor.name,
            address ? (exisitVendor.address = address) : exisitVendor.address,
            phone ? (exisitVendor.phone = phone) : exisitVendor.phone,
            foodType ? (exisitVendor.foodType = foodType) : exisitVendor.foodType;
        const vendor = yield exisitVendor.save();
        res.json({ vendor });
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorCoverImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.json({ message: "somthing went wrong with add food" });
    }
    const vendor = yield (0, adminController_1.findVendor)(user._id);
    if (vendor !== null) {
        const files = req.files;
        const images = files.map((file) => file.filename);
        vendor.coverImages.push(...images);
        const createdCoverImg = yield vendor.save();
        res.json({ data: createdCoverImg });
    }
});
exports.updateVendorCoverImage = updateVendorCoverImage;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.json({ message: "Vendor Info not found" });
    }
    const exisitVendor = yield (0, adminController_1.findVendor)(user._id);
    if (exisitVendor !== null) {
        exisitVendor.serviceAvaliable = !exisitVendor.serviceAvaliable;
        const vendor = yield exisitVendor.save();
        res.json({ vendor });
    }
});
exports.updateVendorService = updateVendorService;
const addFoodCon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.json({ message: "somthing went wrong with add food" });
    }
    const { name, description, category, foodType, readyTime, price } = req.body;
    const vendor = yield (0, adminController_1.findVendor)(user._id);
    if (vendor !== null) {
        const files = req.files;
        const images = files.map((file) => file.filename);
        const createdFood = yield foodModel_1.foodModel.create({
            vendorId: vendor._id,
            name,
            description,
            category,
            foodType,
            readyTime,
            price,
            rating: 0,
            images,
        });
        vendor.foods.push(createdFood);
        const result = yield vendor.save();
        res.json({ data: result });
    }
});
exports.addFoodCon = addFoodCon;
const getFoodCon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        return res.json({ message: "fooods Info not found" });
    }
    const food = yield foodModel_1.foodModel.find({ vendorId: user._id });
    res.json({ data: food });
});
exports.getFoodCon = getFoodCon;
//# sourceMappingURL=vendorController.js.map