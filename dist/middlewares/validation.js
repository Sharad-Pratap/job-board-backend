"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.companyRegistrationValidation = void 0;
const express_validator_1 = require("express-validator");
exports.companyRegistrationValidation = [
    (0, express_validator_1.check)('name', 'Name is required').not().isEmpty(),
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('phone', 'Phone number is required').not().isEmpty(),
    (0, express_validator_1.check)('companyName', 'Company name is required').not().isEmpty(),
    (0, express_validator_1.check)('employeeSize', 'Employee size is required').isNumeric().withMessage('Employee size must be a number'),
];
exports.loginValidation = [
    (0, express_validator_1.check)('email', 'Please include a valid email').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').exists(),
];
