import { NextRequest, NextResponse } from 'next/server'
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
        const healthQuery = await getDocs(collection(db, 'health'));
        const healthDocs = []
        for (const doc of healthQuery.docs) {
            if (doc.data().cat.id === catId) {
                healthDocs.push(doc.data());
            }
        }

        const data = [];
        for (const doc of healthDocs) {
            let date : string = doc.date.toDate().toLocaleTimeString('vi-VN', {  day: 'numeric', month: 'numeric', year: 'numeric'});
            date = date.split(' ')[1].replaceAll('/', '-');
            
            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${year}-${month}-${day}`;
            
            doc.time = formattedDate;
            doc.food = doc.food;
            doc.drink = doc.drink;

            const catData = {
                time: doc.time,
                food: doc.food,
                drink: doc.drink
            }
            data.push(catData);
        }
        return NextResponse.json(data, jsonHeader);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}