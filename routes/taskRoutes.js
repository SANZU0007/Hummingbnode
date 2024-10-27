import express from 'express';
import { getAllTasks, getTaskById, updateTask, deleteTask, createTask } from '../controllers/taskController.js';

const router = express.Router();

// Route to get all tasks
router.get('/all', getAllTasks);

// Route to get a specific task by ID
router.get('/tasks/:id', getTaskById);

// Route to update a task by ID
router.put('/updateTask/:id', updateTask);

// Route to delete a task by ID
router.delete('/deleteTask/:id', deleteTask);


router.post('/create', createTask);

export default router;
