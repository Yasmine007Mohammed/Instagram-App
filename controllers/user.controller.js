import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if(!user){
        res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
})  