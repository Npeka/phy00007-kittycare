import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, getDocs, where, orderBy, limit, query, doc } from 'firebase/firestore';
import app from '../../../../firebase/config';
const jsonHeader = { headers: { 'Content-Type': 'application/json' } };
const db = getFirestore(app);
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {

        const { userId } = await params;

        const analysisQuery = query(
            collection(db, 'analysis'),
            where('userId', '==', doc(db, 'users', userId)),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        
        const querySnapshot = await getDocs(analysisQuery);
        if (querySnapshot.empty) {
            return NextResponse.json("Chưa có phân tích nào", { status: 404 });
        }

        const latestAnalysis = querySnapshot.docs[0].data().responseText;
        return NextResponse.json(latestAnalysis, jsonHeader);
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json(
            { error: e.message },
            { status: e.status ?? 500 },
        );
    }
}
