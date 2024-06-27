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
exports.editCustomerProfile = exports.getCustomerProfile = exports.requestOtp = exports.customerVerify = exports.customerLogin = exports.customerSignUp = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const customer_dto_1 = require("../dto/customer.dto");
const utils_1 = require("../utils");
const customerModel_1 = require("../models/customerModel");
const customerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert the request body to an instance of createCustomerInput and validate it
        const customerInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.createCustomerInput, req.body);
        const inputError = yield (0, class_validator_1.validate)(customerInputs, {
            validationError: { target: true },
        });
        // If there are validation errors, return a 400 status code with the error details
        if (inputError.length > 0) {
            return res
                .status(400)
                .json({ message: `Error in customer SignUp inputs { ${inputError} }` });
        }
        // Destructure phone, email, and password from the validated input data
        const { phone, email, password } = customerInputs;
        // Generate a salt for password hashing
        const salt = yield (0, utils_1.generateSalt)();
        // Hash the password using the generated salt
        const hashedPass = yield (0, utils_1.generateHashPassword)(password, salt);
        // Generate a one-time password (OTP) and its expiry time
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        console.log(`OTP >> ${otp} , OTP_expiry >> ${expiry}`);
        const exisitCustomer = yield customerModel_1.customerModel.findOne({ email });
        if (exisitCustomer !== null) {
            return res
                .status(409)
                .json({ message: " an user exisit with the same email " });
        }
        // Create an object with customer data including default values for firstName and lastName
        const data = {
            firstName: "e",
            lastName: "a",
            address: "",
            phone,
            email,
            password: hashedPass,
            salt,
            verfied: false, // Note: This should be 'verified'
            otp,
            otp_expiry: expiry,
            lat: 0,
            lng: 0,
        };
        // Save the customer data to the database
        const result = yield customerModel_1.customerModel.create(data);
        // If the operation fails, return a JSON response indicating an error
        if (!result) {
            return res.json({ message: "somthin went wrong in customer signup" });
        }
        // // Send the OTP to the customer's phone number
        // await onRequestOtp(otp, phone);
        // Generate a signature for the customer using their ID, email, and verified status
        const signature = (0, utils_1.generateSignature)({
            _id: result.id,
            email: result.email,
            verfied: result.verfied, // Note: This should be 'verified'
        });
        // Respond with a JSON object containing a success message, the generated signature,
        // the verification status, and the customer's email
        res.json({
            message: "success",
            signature,
            verfied: result.verfied, // Note: This should be 'verified'
            email: result.email,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.customerSignUp = customerSignUp;
const customerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Convert the request body to an instance of createCustomerInput and validate it
        const customerInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.loginCustomerInput, req.body);
        const inputError = yield (0, class_validator_1.validate)(customerInputs, {
            validationError: { target: true },
        });
        if (inputError.length > 0) {
            return res
                .status(400)
                .json({ message: `Error in customer Login inputs { ${inputError} }` });
        }
        const { email, password } = customerInputs;
        const exisitCustomer = yield customerModel_1.customerModel.findOne({ email });
        if (!exisitCustomer) {
            return res
                .status(404)
                .json({ message: "user not found with this email " });
        }
        const comparePass = yield (0, utils_1.ValidatePassword)(password, exisitCustomer.password, exisitCustomer.salt);
        if (!comparePass) {
            return res
                .status(404)
                .json({ message: "passrod is wrong in customer login" });
        }
        // Generate a signature for the customer using their ID, email, and verified status
        const signature = (0, utils_1.generateSignature)({
            _id: exisitCustomer.id,
            email: exisitCustomer.email,
            verfied: exisitCustomer.verfied,
        });
        // the verification status, and the customer's email
        res.json({
            message: "success",
            signature,
            verfied: exisitCustomer.verfied,
            email: exisitCustomer.email,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.customerLogin = customerLogin;
const customerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = req.body;
        const customer = req.user;
        const profile = yield customerModel_1.customerModel.findById(customer === null || customer === void 0 ? void 0 : customer._id);
        // If the operation fails, return a JSON response indicating an error
        if (!profile) {
            return res.json({ message: "somthin went wrong in verify customer" });
        }
        if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
            profile.verfied = true;
            yield profile.save();
            const signature = (0, utils_1.generateSignature)({
                _id: profile.id,
                email: profile.email,
                verfied: profile.verfied,
            });
            res.json({
                message: "success",
                signature,
                verfied: profile.verfied,
                email: profile.email,
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.customerVerify = customerVerify;
const requestOtp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        const profile = yield customerModel_1.customerModel.findById(customer === null || customer === void 0 ? void 0 : customer._id);
        if (!profile) {
            return res.json({
                message: "somthin went wrong in request OTP customer",
            });
        }
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        profile.otp = otp;
        profile.otp_expiry = expiry;
        yield profile.save();
        const sendOtp = (0, utils_1.onRequestOtp)(otp, profile.phone);
        res.json({
            status: "success",
            message: "OTP send to your phone",
            sendOtp,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.requestOtp = requestOtp;
const getCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        const profile = yield customerModel_1.customerModel.findById(customer === null || customer === void 0 ? void 0 : customer._id);
        if (!profile) {
            return res.json({ message: "somthin went wrong in Profile customer" });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomerProfile = getCustomerProfile;
const editCustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.user;
        const customerInputs = (0, class_transformer_1.plainToClass)(customer_dto_1.editCustomerProfileInput, req.body);
        const inputError = yield (0, class_validator_1.validate)(customerInputs, {
            validationError: { target: true },
        });
        if (inputError.length > 0) {
            return res.status(400).json({ inputError });
        }
        const { firstName, lastName, address } = customerInputs;
        const profile = yield customerModel_1.customerModel.findById(customer === null || customer === void 0 ? void 0 : customer._id);
        if (!profile) {
            return res.json({ message: "somthin went wrong in Profile customer" });
        }
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.address = address;
        const result = profile.save();
        res.json({
            message: "success",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editCustomerProfile = editCustomerProfile;
//# sourceMappingURL=customerController.js.map