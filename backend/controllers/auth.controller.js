import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../utils/token.js";
import bcrypt from "bcryptjs";
import ApiError from '../utils/apiError.js';
import { token } from "morgan";


export const signUp = asyncHandler(async (req, res, next) => {
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

    if(user){
        generateToken(user._id, res);
        res.status(201).json({ data: user });
    }
});

export const logIn = asyncHandler(async (req, res, next) => {
    const { username , password } = req.body;
    const user = await User.findOne({ username });
    if(!user || !(await bcrypt.compare(password, user.password))){
        return next(new ApiError('Invalid username or password', 401));
    }

    if(user){
        generateToken(user._id, res);
        res.status(201).json({data: user});
    }
});

export const signOut = async(req, res) =>{
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Signed out successfully" });
}