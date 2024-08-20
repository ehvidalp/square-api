
import { onRequest } from "firebase-functions/v2/https";
import express, { Request, Response } from 'express';
import { db } from './firebaseConfig';
import cors from 'cors';


const app = express();

app.use(express.json());
app.use(cors({ origin: true }));


app.get('/users', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email provided' });
    }

    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    return userSnapshot.empty
      ? res.status(404).json({ message: 'User not found' })
      : res.status(200).json({ message: 'User found' });

  } catch (error) {
    console.error('Error in get user by email', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  return;
});




app.post('/users', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email provided' });
    }
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'Invalid name provided' });
    }

    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    const newUser = await db.collection('users').add({ email, name });
    res.status(201).json({ message: 'User created', id: newUser.id });

  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  return;
});

// tasks
interface TaskData {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  completed: boolean;
}



app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string | undefined;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email provided' });
    }

    const userRef = await db.collection('tasks').where('email', '==', email).get();

    if (userRef.empty) {
      return res.status(204).json({ tasks: [] });
    }

    const tasks: TaskData[] = userRef.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TaskData[];

    res.status(200).json({ tasks });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }

  return;
});



app.post('/tasks', async (req: Request, res: Response) => {
  const { title = null, description, created_at, completed, email } = req.body;

  try {
    if (!title) return res.status(400).send('Title is required');

    const newTask = await db.collection('tasks').add({ title, description, created_at, completed, email });
    res.status(201).json({ message: 'Task created', id: newTask.id });

  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  return;
});

app.put('/tasks/:id', async (req: Request, res: Response) => {
  const taskId = req.params.id;
  const { title, description, created_at, completed, email } = req.body;

  try {
    if (!taskId) return res.status(400).send('Task ID is required');
    if (!title) return res.status(400).send('Title is required');

    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await taskRef.update({ title, description, created_at, completed, email });
    res.status(200).json({ message: 'Task updated' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  return
});

app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const taskId = req.params.id;

  try {
    if (!taskId) return res.status(400).send('Task ID is required');

    const taskRef = db.collection('tasks').doc(taskId);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    await taskRef.delete();
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

  return
});


exports.api = onRequest(app);