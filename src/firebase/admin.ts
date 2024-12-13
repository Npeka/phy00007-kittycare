import admin from 'firebase-admin';

import serviceAccount from './config/serviceAccountKey.json';
import { ServiceAccount } from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
        databaseAuthVariableOverride: null,
    });
}

const db = admin.database();

export { db };
export default admin;
