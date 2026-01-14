import jwt from 'jsonwebtoken';
import asynchandler from 'express-async-handler';
import User from '../models/user.model';
import apiError from '../utils/apiError';

export const authMiddleware = asynchandler(async (req, res, next) => {
    // check if token exists
    const token = req.cookies.jwt;
    if (!token) {
        return next(new apiError('No token found, please login to access this route', 401));
    }

    // verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    next();
    
    if (!decoded) {
        return next(new apiError('Invalid token, please login again', 401));
    }

    //check if user still exists
    const currentUser = await User.findById(decoded.userId).select('-password');
    if (!currentUser) {
        return next(new apiError('User that belongs to this token does not exist', 401));
    }

    req.user = currentUser;
    next();
});