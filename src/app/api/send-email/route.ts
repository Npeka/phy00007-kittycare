import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const jsonHeader = { headers: { "Content-Type": "application/json" } };

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASSWORD,  
  },
});

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Only POST requests allowed', status: 405 }, jsonHeader);
  }

  const data = await req.json();
  const { to, subject, text } = data;

  if (!to || !subject || !text) {
    return NextResponse.json({ message: 'Missing required fields: to, subject, text' }, jsonHeader);
  }

  const mailOptions = {
    from: process.env.MAIL_FROM,  
    to,                            
    subject,                       
    text,                         
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully', info });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send email', error });
  }
}
