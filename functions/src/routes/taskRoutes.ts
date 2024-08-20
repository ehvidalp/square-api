import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

router.get('/', taskController.getTasksByEmail);   

router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export const taskRoutes = router;