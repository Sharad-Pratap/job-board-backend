"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.companyRegistrationValidation, authController_1.registerCompany);
router.post('/login', validation_1.loginValidation, authController_1.loginCompany);
router.post('/verify-otp', authController_1.verifyOTP);
exports.default = router;
