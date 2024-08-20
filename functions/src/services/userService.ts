import { db } from '../firebaseConfig';

export const userService = {
  getUserByEmail: async (email: string) => {
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return null;
    }

    return userSnapshot.docs[0].data();
  },

  createUser: async (userData: { email: string, name: string }) => {
    const newUserRef = await db.collection('users').add(userData);
    return { id: newUserRef.id, ...userData };
  }
};