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
                gap: '1rem',
                padding: '2rem 4.5rem',
                minHeight: '28rem',
                justifyContent: 'center',
            }}
            size="small"
            fullWidth
        >
            <Typography sx={{ fontWeight: 'bold' }} variant="h4" align="center">
                {title}
            </Typography>
            {children}
        </FormControl>
    );
}
