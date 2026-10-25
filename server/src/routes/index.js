import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import movieRoutes from './movieRoutes.js';
import bookingRoutes from './bookingRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ ok: true }));

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.use('/bookings', bookingRoutes);

export default router;
