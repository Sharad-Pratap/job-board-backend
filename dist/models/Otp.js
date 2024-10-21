"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OTPSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    emailOtp: { type: String, required: true },
    mobileOtp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});
exports.OTP = mongoose_1.default.model('OTP', OTPSchema);
