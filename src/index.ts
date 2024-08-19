import express, { Request, Response } from 'express';
import { envs } from './config/envs';
import { db } from '../firebaseConfig';
import * as admin from 'firebase-admin'; // Asegúrate de importar Firebase Admin SDK 
import { doc, updateDoc } from 'firebase/firestore';

const app = express();
const port = envs.port;
const dbTask = admin.firestore(); 

app.use(express.json());

// users
app.get('/users', async (req: Request, res: Response) => {
  try {
    const email = req.query.email; 
    
    if (!email) return res.status(400).send('Email is required');
    
    const userRef = await db.collection('users').where('email', '==', email).get();
    
    if (userRef.empty) {
      res.status(404).json({ message: 'User not found' });
      return;
    } 

    res.status(200).json({ message: 'User found' });
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
});

app.post('/users', async (req: Request, res: Response) => {
  const { email, name } = req.body;

  try {    
    if (!email) return res.status(400).send('Email is required');
    
    const userRef = await db.collection('users').where('email', '==', email).get();
    
    if (!userRef.empty) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    } 

    const newUser = await db.collection('users').add({ email, name});
    res.status(201).json({ message: 'User created', id: newUser.id });
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
});

// tasks
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const email = req.query.email ?? '';  
    const userRef = await db.collection('tasks').where('email', '==', email).get();
    
    if (userRef.empty) {
      res.status(404).json({ message: 'User dont have tasks' });
      return;
    } 

    let tasks: any = [];
    userRef.forEach((doc) => {
      console.log(doc);
      const taskData = doc.data();
      taskData.id = doc.id;
      tasks.push(taskData);
    });
    res.status(200).json({ tasks: res.json(tasks) });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
  
});

app.post('/tasks', async (req: Request, res: Response) => {
  const { title = null, description, created_at, completed, email } = req.body;

  try {    
    if (!title) return res.status(400).send('Title is required');
    
    const newTask = await db.collection('users').add({ title, description, created_at, completed, email });
    res.status(201).json({ message: 'Task created', id: newTask.id });
    
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
});

app.put('/tasks/:taskId', async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const updatedTaskData = req.body; 

  try {
    const taskRef = doc(dbTask, 'tasks', taskId); // Referencia al documento de la tarea

    // Verificar si la tarea existe (opcional pero recomendado)
    const taskSnapshot = await taskRef.get();
    if (!taskSnapshot.exists()) {
      return res.status(404).send('Tarea no encontrada');
    }

    await updateDoc(taskRef, updatedTaskData);
    res.send('Tarea actualizada correctamente');
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).send('Error interno del servidor');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});