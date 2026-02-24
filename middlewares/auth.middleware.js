import jwt from 'jsonwebtoken';
import asynchandler from 'express-async-handler';
import User from '../models/user.model.js';
import apiError from '../utils/apiError.js';

const auth = asynchandler(async (req, res, next) => {
    // check if token exists
    const token = req.cookies.jwt;
    if (!token) {
        return next(new apiError('No token found, please login to access this route', 401));
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return next(new apiError('Invalid or Expired token, please login again', 401));
    }

    //check if user still exists
    const currentUser = await User.findById(decoded.userId).select('-password');
    if (!currentUser) {
        return next(new apiError('User that belongs to this token does not exist', 401));
    }

    req.user = currentUser;
    next();
});

export default auth;