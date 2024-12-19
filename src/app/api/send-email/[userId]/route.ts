import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const jsonHeader = { headers: { "Content-Type": "application/json" } };
import app from '../../../../firebase/config';
const db = getFirestore(app);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASSWORD,  
  },
});

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = await params;
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests allowed', status: 405 }, jsonHeader);
  }

  const data = await req.json();
  const { subject, text } = data;

  if (!subject || !text) {
    return NextResponse.json({ message: 'Missing required fields: to, subject, text' }, jsonHeader);
  }

  try {
    const userQuery = await getDocs(collection(db, 'users'));
    const userDoc = userQuery.docs.find(doc => doc.id === userId);
    if (!userDoc) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const mailOptions = {
      from: process.env.MAIL_FROM,  
      to: userDoc.data().email,                            
      subject,                       
      text,                         
    };
      
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully', info });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send email', error });
  }
}
