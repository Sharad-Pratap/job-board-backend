import express from 'express';
import {loginCompany, registerCompany, verifyOTP}  from '../controllers/authController';
import { companyRegistrationValidation, loginValidation } from '../middlewares/validation';

const router = express.Router();

router.post('/register',companyRegistrationValidation, registerCompany);
router.post('/login', loginValidation, loginCompany);
router.post('/verify-otp', verifyOTP);
export default router;