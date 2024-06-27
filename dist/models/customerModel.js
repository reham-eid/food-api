"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerModel = void 0;
const mongoose_1 = require("mongoose");
const customerShema = new mongoose_1.Schema({
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    verfied: { type: Boolean },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number },
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
const customerModel = (0, mongoose_1.model)("customer", customerShema);
exports.customerModel = customerModel;
//# sourceMappingURL=customerModel.js.map