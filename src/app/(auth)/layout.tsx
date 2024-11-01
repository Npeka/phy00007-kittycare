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
                    fontSize: '9rem',
                    WebkitTextStroke: '4px #989c94',
                    marginBottom: '1rem',
                }}
                variant="h1"
                align="center"
                gutterBottom
            >
                KittyCare
            </Typography>

            <div className="m-auto max-w-2xl rounded-3xl bg-white">
                <Suspense fallback={<Loading />}>{children}</Suspense>
            </div>
        </div>
    );
}
