import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { signUpSchema, loginSchema } from '../utils/validator/user.validator.js';
import { signup, login, logout, forgotPassword, verifyOtp, resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validate(signUpSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);  
router.get('/logout', logout);

export default router;
