import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, getDocs, DocumentReference } from 'firebase/firestore';
import app from '../../../../firebase/config';
const jsonHeader = { headers: { 'Content-Type': 'application/json' } };
const db = getFirestore(app);
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {

        const { userId } = await params;

        const userQuery = await getDocs(collection(db, 'users'));
        const userDoc = userQuery.docs.find(doc => doc.id === userId);
        if (!userDoc) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        
        const catRef = userDoc.data().cat;
        if (!catRef || !(catRef instanceof DocumentReference)) {
            return NextResponse.json({ error: 'Cat reference not found or invalid' }, { status: 404 });
        }
        const catId = catRef.id; 
        const envQuery = await getDocs(collection(db, 'env'));
        const envDocs = []
        for (const doc of envQuery.docs) {
            if (doc.data().cat.id === catId) {
                envDocs.push(doc.data());
            }
        }

        const data: any[] = []
        envDocs.forEach((doc) => {
            let date: string = doc.date.toDate().toLocaleTimeString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
            });
            date = date.split(' ')[1].replaceAll('/', '-');

            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${year}-${month}-${day}`;

            doc.time = formattedDate;
            doc.humid = doc.humid;
            doc.temp = doc.temp;
            
            const catData = {
                time: doc.time,
                humid: doc.humid,
                temp: doc.temp
            }
            data.push(catData);
        });
        return NextResponse.json(data, jsonHeader);
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json(
            { error: e.message },
            { status: e.status ?? 500 },
        );
    }
}
