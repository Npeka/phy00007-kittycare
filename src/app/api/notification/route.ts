import { NextRequest, NextResponse } from "next/server";
import admin from "../../../firebase/admin";
const jsonHeader = { headers: { "Content-Type": "application/json" } };

export async function POST(req: NextRequest) {
  try {
      const data = await req.json();
      const { title, body } = data;

      if (!title || !body) {
          return NextResponse.json({ message: 'Missing required fields: token, title, body', status: 400 }, jsonHeader);
      }
      
      const token = process.env.NEXT_PUBLIC_FIREBASE_FCM as string;

      const message = {
          notification: {
              title,
              body,
          },
          token,
      };

      const response = await admin.messaging().send(message);
      return NextResponse.json(response, jsonHeader);
  } catch (error) {
      console.error('Error sending notification:', error);
      return NextResponse.json({ message: 'Failed to send notification', error, status: 500 }, jsonHeader);
  }
}