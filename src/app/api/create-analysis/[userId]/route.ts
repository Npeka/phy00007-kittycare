import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
import { getFirestore, collection, getDocs, query, where, Firestore, doc, addDoc } from 'firebase/firestore';
import app from '../../../../firebase/config';
const jsonHeader = { headers: { 'Content-Type': 'application/json' } };
const db = getFirestore(app);
/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    console.log(message);
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `KittyCare là một ứng dụng IoT chăm sóc thú cưng (mèo) thông qua việc lưu trữ thông tin môi trường như nhiệt độ, độ ẩm, ánh sáng, tình trạng cửa chuồng, lượng thức ăn, nước uống nhằm đưa ra những lời khuyên và nhận xét hữu ích cho sức khỏe của thú cưng. Bạn chính là chatbot được tích hợp vào Kittycare, giúp hướng dẫn sử dụng trang web và tương tác với người dùng. Bạn có thể được hỏi về bất kỳ vấn đề nào liên quan đến tình trạng thú cưng và các chức năng trên trang. Trả lời bằng Tiếng Việt. Nếu không biết câu trả lời, hãy trả lời không biết, giữ câu trả lời trong vòng 10 câu và câu trả lời phải chính xác. Đừng sử dụng cú pháp Markdown. Không sử dụng dấu '-' cho liệt kê mà sử dụng những từ nối giữa các ý liệt kê. Không sử dụng từ 'nó' khi nhắc đến ứng dụng Kittycare. Dưới đây là những thông tin sức khỏe (tên, tuổi, cân nặng, chiều cao),  thông tin sinh hoạt (thức ăn,  nước uống) và thông số môi trường (độ ẩm, nhiệt độ) trong 7 ngày qua, hãy phân tích sức khỏe của thú cưng và đưa ra lời khuyên dựa trên thông tin phân tích.

Current environment:
{environment}

Current cat information:
{cat_info}

Current cat's nutrition information:
{nutrition}

assistant:`;


export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = await params;
        /* cat information */
        const catInfo = query(
            collection(db, 'cats'), // Reference to 'cats' collection
            where('owner', '==', doc(db, 'users', userId))
        );
        const queryCatInfo = await getDocs(catInfo);
        const cat = queryCatInfo.docs.map(doc => {
            const { name, age, height, weight } = doc.data();
            return { name, age, height, weight };
        });

        const formattedCatInfo: string=`Tên thú cưng: ${cat[0].name}, Tuổi: ${cat[0].age}, Chiều cao: ${cat[0].height} cm, Cân nặng: ${cat[0].weight} kg \n`;
        
        /* temp and humid for last 7 days */
        const currentDate = new Date();
        const last7Days = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const q = query(
            collection(db, 'env'),
            where('date', '>=', last7Days),
            where('date', '<=', currentDate),
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
            let { humid, temp, date } = doc.data();
            date = date.toDate().toLocaleTimeString('vi-VN', {  day: 'numeric', month: 'numeric', year: 'numeric'});
            date = date.split(' ')[1].replaceAll('/', '-');
            
            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${day}-${month}-${year}`;
            return { humid, temp, date: formattedDate };
        });

        const formattedEnv: string = data.map(d => `Ngày ${d.date}: Nhiệt độ: ${d.temp}°C, Độ ẩm: ${d.humid}%`).join('\n');

        /* food and drink for last 7 days */
        const queryNutrition = query(
            collection(db, 'health'),
            where('date', '>=', last7Days),
            where('date', '<=', currentDate),
        );
        const querySnapshotNutrition = await getDocs(queryNutrition);
        const nutrition = querySnapshotNutrition.docs.map(doc => {
            let { food, drink, date } = doc.data();
            date = date.toDate().toLocaleTimeString('vi-VN', {  day: 'numeric', month: 'numeric', year: 'numeric'});
            date = date.split(' ')[1].replaceAll('/', '-');
            
            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${day}-${month}-${year}`;
            return { food, drink, date: formattedDate };
        });

        const formattedNutrition: string = nutrition.map(n => `Ngày ${n.date}: Thức ăn: ${n.food} g, Nước uống: ${n.drink} ml`).join('\n');

        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-4o-mini',
            temperature: 0.5,
        });


        const parser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(parser);

        const stream = await chain.stream({
            environment: formattedEnv, 
            cat_info: formattedCatInfo,
            nutrition: formattedNutrition,
        });

        const responseText = await new Response(stream).text();
        await addDoc(collection(db, 'analysis'), {
            userId: doc(db, 'users', userId),
            responseText,
            createdAt: new Date(), 
        });
        return NextResponse.json({message: "Update analysis data successfully"}, jsonHeader);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
