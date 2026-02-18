import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { signUpSchema, loginSchema } from '../utils/validator/user.validator.js';
import { signup, login, logout} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validate(signUpSchema), signup);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

export default router;
