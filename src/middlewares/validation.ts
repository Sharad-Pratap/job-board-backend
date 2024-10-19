import { check } from 'express-validator';

export const companyRegistrationValidation = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('companyName', 'Company name is required').not().isEmpty(),
    check('employeeSize', 'Employee size is required').isNumeric().withMessage('Employee size must be a number'),
   
];
export const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
];
