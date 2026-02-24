import asyncHandler from "express-async-handler";
import sendEmail from "../utils/sendEmail.js";
import User from "../models/user.model.js";
import generateToken from "../utils/createToken.js";
import bcrypt from "bcryptjs";
import ApiError from '../utils/apiError.js';

// import { use } from "passport";

export const signup = asyncHandler(async (req, res, next) => {
    const { name, email, username, password} = req.body;
    const findByEmail = await User.findOne({ email });
    if(findByEmail){
        return next(new ApiError('Email already exists', 400));
    }
    const findByUsername = await User.findOne({ username });
    if(findByUsername){
        return next(new ApiError('Username already exists', 400));
    }
    const user = await User.create({
        name: name,
        username: username,
        email: email,
        password: password
    });

    if(user) {
        generateToken(user._id, res);
        res.status(201).json({ data: user });
    }
    
});

export const login = asyncHandler(async (req, res, next) => {
    const { username , password } = req.body;
    const user = await User.findOne({ username });
    if(!user || !(await user.comparePassword(password))){
        return next(new ApiError('Invalid username or password', 401));
    }

    if(user) {
        generateToken(user._id, res);
        res.status(200).json({ data: user });
    }
});

// export const refresh = asyncHandler(async (req, res, next) => {
//     const refreshToken = req.cookies.refreshToken;
//     if(!refreshToken){
//         return next(new ApiError('No token found, please login again', 401));
//     }

//     const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     if(!decoded){
//         return next(new ApiError('Invalid or Expired token, please login again', 403));
//     }
    
//     const currentuser = await User.findById(decoded.userId).select('-password');
//     if(!currentuser){
//         return next(new ApiError('User that belongs to this token does not exist', 401));
//     }

//     const newAccessToken = await generateAccessToken(currentuser._id);

//     res.cookie('accesstoken', newAccessToken, {
//         ...configCookieOptions,
//         maxAge: 24 * 60 * 60 * 1000 //  1 day
//     });

//     res.status(200).json({message: "Access token refreshed successfully" });
// })

export const logout = async(req, res) =>{
    res.clearCookie("jwt");
    return res.status(200).json({ message: "logged out successfully" });
}

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user){
        return next(new ApiError(`No user found with this email ${email}`, 404));
    }

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; 
    user.isOtpVerified = false;

    await user.save();

    const message = ` Hi ${user.name} 
     <p>You requested a password reset for your account ${user.email}. 
     Use the following OTP to reset your password:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 5 minutes.</p>
    `;

    try {
        await sendEmail({
        email: user.email,
        subject: "Password Reset OTP",
        html: message
    });
    } catch (error) {
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        user.isOtpVerified = undefined;

        await user.save();
        return next(new ApiError('Failed to send OTP email, please try again later', 500));
    }
     res.status(200).json({ message: "OTP sent to email successfully" });
});

export const verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email }).select('+resetOtp +otpExpires +isOtpVerified');
    if(!user){
        return next(new ApiError(`No user found with this email ${email}`, 404));
    } 
    if(user.resetOtp !== otp || user.otpExpires < Date.now()){
        return next(new ApiError('Invalid OTP or expired', 400))
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).select('+isOtpVerified');
    if(!user){
        return next(new ApiError(`No user found with this email ${email}`, 404));
    }
    if(!user.isOtpVerified){
        return next(new ApiError('OTP not verified', 400));
    }
    user.password = newPassword;
    user.isOtpVerified = false;

    await user.save();

    if(user) {
        generateToken(user._id, res);
    }
    res.status(200).json({ message: "Password reset successfully" });
})