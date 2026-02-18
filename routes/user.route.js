import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import { getCurrentUser } from '../controllers/user.controller.js';


const router = express.Router();
router.get('/profile', auth, getCurrentUser)

export default router;