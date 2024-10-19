import { name } from './../../node_modules/ci-info/index.d';

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import Company from '../models/Company';
import { sendEmail } from '../utils/email';
import { getStoredOTP, storeOTP } from './otpController';
import { sendSMS } from '../utils/sendSMS';
import { generateOTP } from '../utils/generateOTP';
import { generateRandomPassword } from '../utils/generatePassword';

export const registerCompany = async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email, phone, companyName, employeeSize } = req.body;

        let company = await Company.findOne({ email });

        if (company) {
            res.status(400).json({ msg: 'Company already exists' });
            return;
        }

        company = new Company({
            name,
            email,
            phone,
            companyName,
            employeeSize,
            password: "password", 
        });

        await company.save();


    
         const emailOtp = generateOTP();
         const mobileOtp = generateOTP();
         await storeOTP(email, emailOtp, mobileOtp);
 
        const password = generateRandomPassword();
         await sendEmail(email, 'Your Email OTP Code', `Your OTP code is: ${emailOtp}
            Your temporary password is: ${password}
            `);
    
         await sendSMS(phone, `Your Mobile OTP code is: ${mobileOtp}`);


         

        res.json({ msg: 'Registration successful. Please verify your email and phone with the OTP sent.' });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const loginCompany = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email });
        if (!company) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }

        
        const token = jwt.sign({ id: company.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });
        res.json({ token,company });
    } catch (err:any) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp, type } = req.body;

    const storedOTPs = await getStoredOTP(email);

    if (!storedOTPs) {
        res.status(400).json({ msg: 'OTP has expired or does not exist.' });
        return;
    }

    const validOtp = type === 'email' ? storedOTPs.emailOtp : storedOTPs.mobileOtp;

    if (validOtp !== otp) {
        res.status(400).json({ msg: 'Invalid OTP.' });
        return;
    }


    await Company.updateOne({ email }, { verified: true }); 
    const company = await Company.findOne({ email });
    if (!company) {
        res.status(400).json({ msg: 'Company not found.' });
        return;
    }
    const token = jwt.sign({ id: company.id }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    res.json({ msg: 'OTP verified successfully.', token, company});
}