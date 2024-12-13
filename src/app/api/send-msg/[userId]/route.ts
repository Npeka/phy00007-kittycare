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

user: {input}
assistant:`;


export async function POST(req: NextRequest, { params }: { params: { userId: string}}) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();

        const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

        const currentMessageContent = messages.at(-1).content;
        
        const { userId } = await params;
        const ref = db.ref( `${userId}/environment`);
        ref.once("value", function(snapshot) {
            console.log(snapshot.val());
        });

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
            //environment: 
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