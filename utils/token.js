import jwt from "jsonwebtoken";

const configCookieOptions = {
    httpOnly: true,
    secure: true, 
    sameSite: 'Strict'
};

const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRY_TIME
    });
    res.cookie('jwt', token, {
            ...configCookieOptions
    });
};

export default generateToken;