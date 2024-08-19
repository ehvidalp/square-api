import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    port: get('PORT').required().asPortNumber(),
    firebaseServiceAccountKey: get('FIREBASE_SERVICE_ACCOUNT_KEY').required().asJson(),
};
