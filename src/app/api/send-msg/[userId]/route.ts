import {
    Message as VercelChatMessage,
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { NextRequest, NextResponse } from 'next/server';
import app from '../../../../firebase/config';
export const dynamic = 'force-dynamic'
import { Environment } from '@/types/firebase';
import { collection, doc, getDocs, getFirestore, query, where } from 'firebase/firestore';
const dtb = getFirestore(app);
import { db } from '@/firebase/admin'; 
/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
    console.log(message);
    return `${message.role}: ${message.content}`;
};


const TEMPLATE = `KittyCare là một ứng dụng IoT chăm sóc thú cưng (mèo) thông qua việc lưu trữ thông tin môi trường như nhiệt độ, độ ẩm, ánh sáng, tình trạng cửa chuồng, lượng thức ăn, nước uống nhằm đưa ra những lời khuyên và nhận xét hữu ích cho sức khỏe của thú cưng. Bạn chính là chatbot được tích hợp vào Kittycare, giúp hướng dẫn sử dụng trang web và tương tác với người dùng. Bạn có thể được hỏi về bất kỳ vấn đề nào liên quan đến tình trạng thú cưng và các chức năng trên trang. Trả lời bằng Tiếng Việt. Nếu không biết câu trả lời, hãy trả lời không biết, giữ câu trả lời trong vòng 10 câu và câu trả lời phải chính xác. Đừng sử dụng cú pháp Markdown. Nếu câu trả lời là dạng liệt kê, hãy xuống dòng mỗi lần liệt kê. Không sử dụng từ 'nó' khi nhắc đến ứng dụng Kittycare.

Current conversation:
{chat_history}

Current environment:
{environment}

Last 7 days environment:
{last7days_env}

Current cat information:
{cat_info}

Last 7 days cat's nutrition information:
{nutrition}

user: {input}
assistant:`;


export async function POST(req: NextRequest, { params }: { params: { userId: string}}) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

        const currentMessageContent = messages.at(-1).content;
        
        const { userId } = await params;
        

        const getDataFromFirebase = (): Promise<Environment> => {
            return new Promise((resolve, reject) => {
                const ref = db.ref(`${userId}/environment`);
                ref.once('value', (snapshot) => {
                    if (snapshot.exists()) {
                        resolve(snapshot.val());
                    } else {
                        reject(new Error('No data found'));
                    }
                });
            });
        };

        /* cat information */
        const catInfo = query(
            collection(dtb, 'cats'), // Reference to 'cats' collection
            where('owner', '==', doc(dtb, 'users', userId))
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
            collection(dtb, 'env'),
            where('date', '>=', last7Days),
            where('date', '<=', currentDate),
        );
        const querySnapshot = await getDocs(q);
        const dataEnv = querySnapshot.docs.map(doc => {
            let { humid, temp, date } = doc.data();
            date = date.toDate().toLocaleTimeString('vi-VN', {  day: 'numeric', month: 'numeric', year: 'numeric'});
            date = date.split(' ')[1].replaceAll('/', '-');
            
            let [day, month, year] = date.split('-');
            if (day.length < 2) day = `0${day}`;
            const formattedDate = `${day}-${month}-${year}`;
            return { humid, temp, date: formattedDate };
        });

        const formattedEnv: string = dataEnv.map(d => `Ngày ${d.date}: Nhiệt độ: ${d.temp}°C, Độ ẩm: ${d.humid}%`).join('\n');

        /* food and drink for last 7 days */
        const queryNutrition = query(
            collection(dtb, 'health'),
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
        const data : Environment = await getDataFromFirebase();
        
        const environment: string = 'Temperature: ' + String(data.temperature) + '°C, Humidity: ' + String(data.humidity) + '% \n';
        const prompt = PromptTemplate.fromTemplate(TEMPLATE);

        const model = new ChatOpenAI({
            apiKey: process.env.OPENAI_API_KEY!,
            model: 'gpt-4o-mini',
            temperature: 0.5,
        });


        const parser = new HttpResponseOutputParser();

        const chain = prompt.pipe(model).pipe(parser);

        const stream = await chain.stream({
            chat_history: formattedPreviousMessages.join('\n'),
            environment: environment, 
            last7days_env: formattedEnv,
            nutrition: formattedNutrition,
            cat_info: formattedCatInfo,
            input: currentMessageContent,
        });

        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(e.message);
        return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
    }
}