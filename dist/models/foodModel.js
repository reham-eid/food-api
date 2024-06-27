"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foodModel = void 0;
const mongoose_1 = require("mongoose");
const foodShema = new mongoose_1.Schema({
    vendorId: {
        type: mongoose_1.Types.ObjectId,
        ref: "vendor",
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: String },
    images: { type: [String] },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const foodModel = (0, mongoose_1.model)("food", foodShema);
exports.foodModel = foodModel;
//# sourceMappingURL=foodModel.js.map