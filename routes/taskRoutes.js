import express from 'express';
import { createTask, completeTask, deleteTask, UpdateTask } from '../controllers/taskController.js';

const router = express.Router();

router.post('/createTask', createTask);
router.post('/completeTask', completeTask);
router.post('/deleteTask', deleteTask);

router.put('/updateTask/:id', UpdateTask); 

export default router;


