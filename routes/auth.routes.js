import { Router } from 'express';
import { registration } from '../controllers/auth.controller.js';

const router = Router();

router.post('/registration', registration);

export default router;
