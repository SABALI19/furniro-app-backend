// this is a function to generate a one-time password (OTP) for authentication purposes. The OTP is typically a random numeric code that is valid for a short period of time, often used in two-factor authentication (2FA) processes.

// The function `generateOtp` takes a user ID as an argument and performs the following steps:

import bcrypt from "bcrypt";
import OtpToken from "../models/otp/otpToken.js";

export const generateNumericOtp = () => {
    // 6-digit numeric OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const createAndSaveOtp = async (userId, expireMinutes = 10) => {
    //invalidate previous unused OTPs for the user
    await OtpToken.updateMany({ userId, used: false }, { used: true });

    const otp = generateNumericOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + expireMinutes * 60 * 1000);

    const doc = await OtpToken.create({
         userId, 
        otpHash,
         expiresAt, });

    return { otp, doc }; // Return the plain OTP for sending to the user
};
