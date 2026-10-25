import { Router } from 'express';
import * as movieController from '../controllers/movieController.js';

const router = Router();

router.get('/config', movieController.config);
router.get('/now-playing', movieController.nowPlaying);
router.get('/upcoming', movieController.upcoming);
router.get('/:id', movieController.details);

export default router;
