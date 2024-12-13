import { NextRequest } from 'next/server';
import { getDatabase, ref, onValue, child, get, set } from 'firebase/database';
import { database } from '@/firebase/config';

export function GET(req: NextRequest) {
    let data = null;
    try {
        const devicesRef = ref(database, `dz25B3bRLVfWFxG6t5377ZSshlw2`);

        console.log('Fetching data...');

        onValue(devicesRef, (snapshot) => {
            data = snapshot.val();
        });

        return Response.json({ data });
    } catch (error) {
        return Response.error();
    }
}
