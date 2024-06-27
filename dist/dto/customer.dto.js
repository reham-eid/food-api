"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCustomerProfileInput = exports.loginCustomerInput = exports.createCustomerInput = void 0;
const class_validator_1 = require("class-validator");
class createCustomerInput {
}
exports.createCustomerInput = createCustomerInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Phone is required' }),
    (0, class_validator_1.Length)(10, 15, { message: 'Phone must be between 10 and 15 digits' }),
    __metadata("design:type", String)
], createCustomerInput.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be a valid email address' }),
    __metadata("design:type", String)
], createCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be 6 characters or more' }),
    __metadata("design:type", String)
], createCustomerInput.prototype, "password", void 0);
class loginCustomerInput {
}
exports.loginCustomerInput = loginCustomerInput;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email must be a valid email address' }),
    __metadata("design:type", String)
], loginCustomerInput.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be 6 characters or more' }),
    __metadata("design:type", String)
], loginCustomerInput.prototype, "password", void 0);
class editCustomerProfileInput {
}
exports.editCustomerProfileInput = editCustomerProfileInput;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3, { message: "firstName must be 3 characters" }),
    __metadata("design:type", String)
], editCustomerProfileInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(3, { message: "lastName must be 3 characters" }),
    __metadata("design:type", String)
], editCustomerProfileInput.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Length)(1, 6, { message: "address must be between 1 and 6 characters" }),
    __metadata("design:type", String)
], editCustomerProfileInput.prototype, "address", void 0);
//# sourceMappingURL=customer.dto.js.map