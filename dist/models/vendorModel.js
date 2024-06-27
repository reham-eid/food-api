"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorModel = void 0;
const mongoose_1 = require("mongoose");
const vendorShema = new mongoose_1.Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pinCode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvaliable: { type: Boolean },
    coverImages: { type: [String] },
    rating: { type: Number },
    foods: { type: mongoose_1.Types.ObjectId, ref: "food" },
}, {
    toJSON: {
        /**
         * sensitive fields or unnecessary fields are excluded
         * It allows you to modify the structure or content of the JSON
         * representation of a Mongoose document before it is serialized
         */
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        },
    },
    timestamps: true,
});
const vendorModel = (0, mongoose_1.model)("vendor", vendorShema);
exports.vendorModel = vendorModel;
//# sourceMappingURL=vendorModel.js.map