import { Request, Response } from 'express';
import { taskService } from '../services/taskService';
import { Task } from '../interfaces/taskInterface';

export const taskController = {
    getTasksByEmail: async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string | undefined;

            if (!email || typeof email !== 'string') {
                return res.status(400).json({ message: 'Invalid email provided' });
            }

            const tasks = await taskService.getTasksByEmail(email);
            res.status(200).json({ tasks });

        } catch (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).json({
                message: 'Internal server error'
            });
        }
        return;
    },

    createTask: async (req: Request, res: Response) => {
        try {
            const { title, description, created_at, completed, email } = req.body as Task;

            if (!title) {
                return res.status(400).send('Title is required');
            }

            const newTask = await taskService.createTask({ title, description, created_at, completed, email });
            res.status(201).json({ message: 'Task created', id: newTask.id });

        } catch (error) {
            console.error('Error creating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

        return;
    },

    updateTask: async (req: Request, res: Response) => {
        try {
            const taskId = req.params.id;
            const { title, description, created_at, completed, email } = req.body as Task;

            if (!taskId) {
                return res.status(400).send('Task ID is required');
            }
            if (!title) {
                return res.status(400).send('Title is required');
            }

            const updatedTask = await taskService.updateTask(taskId, { title, description, created_at, completed, email });
            if (!updatedTask) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.status(200).json({ message: 'Task updated' });
        } catch (error) {
            console.error('Error updating task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

        return;
    },

    deleteTask: async (req: Request, res: Response) => {
        try {
            const taskId = req.params.id;

            if (!taskId) {
                return res.status(400).send('Task ID is required');
            }

            const wasDeleted = await taskService.deleteTask(taskId);
            if (!wasDeleted) {
                return res.status(404).json({ message: 'Task not found' });
            }

            res.status(200).json({ message: 'Task deleted' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

        return;
    }

};