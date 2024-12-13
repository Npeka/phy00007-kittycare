import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../../../firebase/config';
const jsonHeader = { headers: { 'Content-Type': 'application/json' } };
const db = getFirestore(app);
export async function GET(req: NextRequest) {
    try {
        const querySnapshot = await getDocs(collection(db, 'health'));
        const data = querySnapshot.docs.map(doc => doc.data()); 
        data.forEach((doc) => {
            let date : string = doc.time.toDate().toLocaleTimeString('vi-VN', {  day: 'numeric', month: 'numeric', year: 'numeric'});
            date = date.split(' ')[1].replaceAll('/', '-');
            
            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${year}-${month}-${day}`;
    
            doc.time = formattedDate;
            doc.food = doc.food;
            doc.drink = doc.drink;
        });
        return NextResponse.json(data, jsonHeader);
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}