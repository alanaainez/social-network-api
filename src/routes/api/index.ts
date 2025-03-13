import { Router } from 'express';
import { thoughtRouter } from './thought-routes.js';
import { userRouter } from './user-routes.js';

const router = Router();

router.use('/thoughts', thoughtRouter);
router.use('/users', userRouter);

export default router;
