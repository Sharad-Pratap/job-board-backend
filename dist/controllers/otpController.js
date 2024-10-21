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
exports.getStoredOTP = exports.storeOTP = void 0;
const Otp_1 = require("../models/Otp");
const storeOTP = (email, emailOtp, mobileOtp) => __awaiter(void 0, void 0, void 0, function* () {
    const expiresAt = new Date(Date.now() + 300000);
    yield Otp_1.OTP.create({ email, emailOtp, mobileOtp, expiresAt });
});
exports.storeOTP = storeOTP;
const getStoredOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = yield Otp_1.OTP.findOne({ email });
    if (!otp) {
        return null;
    }
    if (otp.expiresAt < new Date()) {
        yield Otp_1.OTP.deleteOne({ email });
        return null;
    }
    return {
        emailOtp: otp.emailOtp,
        mobileOtp: otp.mobileOtp,
    };
});
exports.getStoredOTP = getStoredOTP;
