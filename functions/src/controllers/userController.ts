import { Request, Response } from 'express';
import { userService } from '../services/userService';


export const userController = {
  getUserByEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid email provided' });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User found' }); 
    } catch (error) {
      console.error('Error in get user by email', error);
      res.status(500).json({ message: 'Internal server error' });
    }

    return;
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid email provided' });
      }
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: 'Invalid name provided' });
      }

      const existingUser = await userService.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      const newUser = await userService.createUser({ email, name });
      res.status(201).json({ message: 'User created', id: newUser.id }); 

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

    return;
  }
};