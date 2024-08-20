import * as admin from 'firebase-admin';
import { cert } from 'firebase-admin/app'; // Importa la función cert

// Inicializa Firebase Admin SDK (solo una vez)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: cert('./keys/serviceAccountKey.json') // Carga las credenciales desde el archivo
  });
}

const db = admin.firestore();

export { db };