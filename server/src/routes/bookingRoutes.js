import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public: seat availability must be visible before logging in.
router.get('/taken/:showKey', bookingController.takenSeats);

router.get('/', requireAuth, bookingController.listMine);
router.post('/', requireAuth, bookingController.create);
router.post('/:id/cancel', requireAuth, bookingController.cancel);

export default router;
