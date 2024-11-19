import { Typography } from '@mui/material';

export default function TitleSection({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {children}
        </Typography>
    );
}
