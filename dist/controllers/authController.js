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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.loginCompany = exports.registerCompany = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const Company_1 = __importDefault(require("../models/Company"));
const email_1 = require("../utils/email");
const otpController_1 = require("./otpController");
const sendSMS_1 = require("../utils/sendSMS");
const generateOTP_1 = require("../utils/generateOTP");
const generatePassword_1 = require("../utils/generatePassword");
const registerCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { name, email, phone, companyName, employeeSize } = req.body;
        let company = yield Company_1.default.findOne({ email });
        if (company) {
            res.status(400).json({ msg: 'Company already exists' });
            return;
        }
        company = new Company_1.default({
            name,
            email,
            phone,
            companyName,
            employeeSize,
            password: "password",
        });
        yield company.save();
        const emailOtp = (0, generateOTP_1.generateOTP)();
        const mobileOtp = (0, generateOTP_1.generateOTP)();
        yield (0, otpController_1.storeOTP)(email, emailOtp, mobileOtp);
        const password = (0, generatePassword_1.generateRandomPassword)();
        yield (0, email_1.sendEmail)(email, 'Your Email OTP Code', `Your OTP code is: ${emailOtp}
            Your temporary password is: ${password}
            `);
        yield (0, sendSMS_1.sendSMS)(phone, `Your Mobile OTP code is: ${mobileOtp}`);
        res.json({ msg: 'Registration successful. Please verify your email and phone with the OTP sent.' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.registerCompany = registerCompany;
const loginCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const company = yield Company_1.default.findOne({ email });
        if (!company) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, company.password);
        if (!isMatch) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: company.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.json({ token, company });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.loginCompany = loginCompany;
const verifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, type } = req.body;
    const storedOTPs = yield (0, otpController_1.getStoredOTP)(email);
    if (!storedOTPs) {
        res.status(400).json({ msg: 'OTP has expired or does not exist.' });
        return;
    }
    const validOtp = type === 'email' ? storedOTPs.emailOtp : storedOTPs.mobileOtp;
    if (validOtp !== otp) {
        res.status(400).json({ msg: 'Invalid OTP.' });
        return;
    }
    yield Company_1.default.updateOne({ email }, { verified: true });
    const company = yield Company_1.default.findOne({ email });
    if (!company) {
        res.status(400).json({ msg: 'Company not found.' });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ id: company.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
    res.json({ msg: 'OTP verified successfully.', token, company });
});
exports.verifyOTP = verifyOTP;
