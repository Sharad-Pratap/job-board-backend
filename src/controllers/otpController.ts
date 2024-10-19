import { OTP } from "../models/Otp";

export const storeOTP = async (email: string, emailOtp: string, mobileOtp: string) => {
    const expiresAt = new Date(Date.now() + 300000); 

    await OTP.create({ email, emailOtp, mobileOtp, expiresAt });
};

export const getStoredOTP = async (email: string) => {
    const otp = await OTP.findOne({ email });

    if (!otp) {
        return null; 
    }

    
    if (otp.expiresAt < new Date()) {
        await OTP.deleteOne({ email }); 
        return null; 
    }

    
    return {
        emailOtp: otp.emailOtp,
        mobileOtp: otp.mobileOtp,
    };
};