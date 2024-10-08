import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

router.get('/', userController.getUserByEmail);
router.post('/', userController.createUser);

export const userRoutes = router;