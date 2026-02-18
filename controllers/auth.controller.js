import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/token.js";
import bcrypt from "bcryptjs";
import ApiError from '../utils/apiError.js';

const configCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
}

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
    if(!user || !(await bcrypt.compare(password, user.password))){
        return next(new ApiError('Invalid username or password', 401));
    }

    if(user) {
        generateToken(user._id, res);
        res.status(201).json({ data: user });
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