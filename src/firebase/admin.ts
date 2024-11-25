import admin from 'firebase-admin';

import serviceAccount from './config/serviceAccountKey.json';
import { ServiceAccount } from 'firebase-admin';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
}

export default admin;
