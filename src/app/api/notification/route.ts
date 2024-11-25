import { NextRequest, NextResponse } from "next/server";
import admin from "../../../firebase/admin";
const jsonHeader = { headers: { "Content-Type": "application/json" } };

export async function POST(req: NextRequest) {
  try {
      // Parse the incoming request body
      const data = await req.json();
      const { token, title, body } = data;

      if (!token || !title || !body) {
          return NextResponse.json({ message: 'Missing required fields: token, title, body', status: 400 }, jsonHeader);
      }

      const message = {
          notification: {
              title,
              body,
          },
          token,
      };

      // TBD
      //const response = await admin.messaging().send(message);
      return NextResponse.json({ message: 'Notification sent successfully'}, jsonHeader);
  } catch (error) {
      console.error('Error sending notification:', error);
      return NextResponse.json({ message: 'Failed to send notification', error, status: 500 }, jsonHeader);
  }
}