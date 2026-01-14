import jwt from "jsonwebtoken";

const generateToken = async(userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: process.env.EXPIRY_TIME
    });
    
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
    });
};

export default generateToken;
