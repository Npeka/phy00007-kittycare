'use client';

import Loading from './loading';
import { Suspense, useContext, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Header, Sidebar } from '@/ui/common';
import { Chatbot } from '@/ui/chat';
import ProtectedRoutes from '@/context/auth-context';
import { AuthContext } from '@/context/auth-context';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase/config';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useContext(AuthContext);
    const [isEscaped, setIsEscaped] = useState<boolean | null>(null);
    const handleNotification = async (isEscaped) => {
        const data = isEscaped ? 'Phát hiện thú cưng đã ra khỏi chuồng!' : 'Thú cưng đã vào trong chuồng!';
        const mobileResponse = await fetch(
            `http://localhost:3000/api/notification`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'KittyCare Notification',
                    body: data,
                }),
            },
        );

        if (!mobileResponse.ok) {
            throw new Error('Failed to send notification');
        }   
    }

    useEffect(() => {
        if (!user) return;

        const deviceRef = ref(database, `${user.uid}/devices`);
        onValue(deviceRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            const { protect } = data;
            if (protect !== isEscaped) {
                setIsEscaped(protect);
                handleNotification(protect);
            }
        });
    });
    return (
        <ProtectedRoutes>
            <div className="grid max-h-screen min-h-screen grid-cols-12 grid-rows-[max-content_1fr] gap-8 bg-[#edf8e8] p-8">
                <Chatbot />
                <div className="col-span-2">
                    <Typography
                        sx={{
                            fontFamily: 'Mouse Memoirs',
                            fontWeight: 'bold',
                            WebkitTextStroke: '0.1px #989c94',
                        }}
                        variant="h2"
                        align="center"
                    >
                        KittyCare
                    </Typography>
                </div>

                <div className="col-span-10">
                    <Header />
                </div>

                <div className="col-span-2">
                    <Sidebar />
                </div>

                <div className="col-span-10 overflow-y-auto pb-4 pr-4">
                    <Suspense fallback={<Loading />}>{children}</Suspense>
                </div>
            </div>
        </ProtectedRoutes>
    );
}
