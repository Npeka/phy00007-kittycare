'use client';

import Loading from './loading';
import { Suspense } from 'react';
import { Typography } from '@mui/material';
import { Header, Sidebar } from '@/ui/common';
import { Chatbot } from '@/ui/chat';
import ProtectedRoute from './protected-route';

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
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
        </ProtectedRoute>
    );
}
