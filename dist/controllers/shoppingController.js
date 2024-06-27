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
exports.getAllFoods = exports.getRestaurantById = exports.getTopRestaurants = exports.getFoodIn30Min = exports.getFoodAvaliability = void 0;
const models_1 = require("../models");
const getFoodAvaliability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode: pinCode } = req.params;
    const vendor = yield models_1.vendorModel
        .find({ pinCode, serviceAvaliable: true })
        .sort([["rating", "descending"]])
        .populate("foods");
    if (vendor.length < 0) {
        return res.json({ message: "NO Food Avaliability" });
    }
    return res.json({ vendor });
});
exports.getFoodAvaliability = getFoodAvaliability;
const getTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode: pinCode } = req.params;
    const vendor = yield models_1.vendorModel
        .find({ pinCode, serviceAvaliable: true })
        .sort([["rating", "descending"]])
        .limit(10);
    if (vendor.length < 0) {
        return res.json({ message: "NO Food Avaliability" });
    }
    return res.json({ vendor });
});
exports.getTopRestaurants = getTopRestaurants;
const getFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode: pinCode } = req.params;
    const result = yield models_1.vendorModel
        .find({ pinCode, serviceAvaliable: true })
        .populate("foods");
    if (result.length < 0) {
        return res.json({ message: "NO Food Avaliability" });
    }
    const foodResult = [];
    result.map((vendor) => {
        const foods = vendor.foods;
        foodResult.push(...foods.filter((food) => food.readyTime <= 30));
    });
    return res.json({ foodResult });
});
exports.getFoodIn30Min = getFoodIn30Min;
const getAllFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pincode: pinCode } = req.params;
    const result = yield models_1.vendorModel
        .find({ pinCode, serviceAvaliable: true })
        .populate("foods");
    if (result.length < 0) {
        return res.json({ message: "NO Food Avaliability" });
    }
    const foodResult = [];
    result.map((vendor) => foodResult.push(vendor.foods));
    return res.json({ foodResult });
});
exports.getAllFoods = getAllFoods;
const getRestaurantById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const vendor = yield models_1.vendorModel.findById(id).populate('foods');
    if (!vendor) {
        return res.json({ message: "NO Food Avaliability" });
    }
    return res.json({ vendor });
});
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=shoppingController.js.map