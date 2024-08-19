import admin from 'firebase-admin';
import { envs } from './src/config/envs';

admin.initializeApp({
  credential: admin.credential.cert(envs.firebaseServiceAccountKey as any),
});

const db = admin.firestore();

export { db };