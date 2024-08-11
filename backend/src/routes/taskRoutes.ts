import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByUser,
} from '../controllers/taskController';

const router = Router();

router.get('/tasks', getTasks);
router.post('/users/:userId/tasks', createTask);
router.get('/users/:userId/tasks/:taskId', getTaskById);
router.put('/users/:userId/tasks/:taskId', updateTask);
router.delete('/users/:userId/tasks/:taskId', deleteTask);
router.get('/users/:userId/tasks', getTasksByUser);

export default router;
