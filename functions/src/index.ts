
import { onRequest } from "firebase-functions/v2/https";
import express from 'express';
import cors from 'cors';
import { userRoutes } from "./routes/userRoutes";
import { taskRoutes } from "./routes/taskRoutes";


const app = express();

app.use(express.json());
app.use(cors({   
 origin: true }));

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes); 

exports.api = onRequest(app);