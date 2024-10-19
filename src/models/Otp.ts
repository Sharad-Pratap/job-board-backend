import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
        email: { type: String, required: true, unique: true },
        emailOtp: { type: String, required: true },
        mobileOtp: { type: String, required: true },
        expiresAt: { type: Date, required: true },

});

export const OTP = mongoose.model('OTP', OTPSchema);