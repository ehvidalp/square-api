// src/services/taskService.ts

import { db } from '../firebaseConfig';
import { Task } from '../interfaces/taskInterface';

export const taskService = {
  getTasksByEmail: async (email: string) => {
    const userRef = await db.collection('tasks').where('email', '==', email).get();
    return userRef.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[];
  },

  createTask: async (taskData: Partial<Task>) => {
    const newTaskRef = await db.collection('tasks').add(taskData);
    return { id: newTaskRef.id }
  },

  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      return null;
    }

    await taskRef.update(taskData as { [x: string]: any });
    return { id: taskId };
  },

  deleteTask: async (taskId: string) => {
    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      return false;
    }

    await taskRef.delete();
    return true;
  }
};