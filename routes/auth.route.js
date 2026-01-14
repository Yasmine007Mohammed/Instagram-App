import express from 'express';
import validate from '../middlewares/validate.middleware.js';
import { signUpSchema, loginSchema } from '../utils/validator/user.validator.js';
import { signUp, logIn, signOut} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/login', validate(loginSchema), logIn);
router.post('/signout', signOut);

export default router;
