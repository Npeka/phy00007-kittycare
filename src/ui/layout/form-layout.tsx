'use client';

import { FormControl, Typography } from '@mui/material';

export default function FormLayout({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <FormControl
            sx={{
                gap: '1.5rem',
                padding: '3rem 7rem',
                minHeight: '30rem',
            }}
            fullWidth
        >
            <Typography
                className="h-"
                sx={{ fontWeight: 'bold' }}
                variant="h3"
                align="center"
            >
                {title}
            </Typography>
            {children}
        </FormControl>
    );
}
