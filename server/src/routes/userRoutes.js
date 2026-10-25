import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.patch('/me', userController.updateProfile);
router.patch('/me/password', userController.changePassword);
router.post('/me/favorites/toggle', userController.toggleFavorite);

export default router;
