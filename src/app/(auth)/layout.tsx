import { Typography } from '@mui/material';
import { Suspense } from 'react';
import Loading from './loading';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen content-center bg-[url('/auth-bg.png')] bg-cover bg-no-repeat">
            <Typography
                sx={{
                    fontFamily: 'Mouse Memoirs',
                    fontSize: '8rem',
                    WebkitTextStroke: '3px #989c94',
                    marginBottom: '1rem',
                }}
                variant="h1"
                align="center"
                gutterBottom
            >
                KittyCare
            </Typography>

            <div className="m-auto max-w-xl rounded-2xl bg-white">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
        </div>
    );
}
