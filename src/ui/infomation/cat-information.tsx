'use client';

import { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { TitleSection } from '@/ui/common';
import { useNotification } from '@/context/noti-context';
import LoadingButton from '@mui/lab/LoadingButton';

export default function CatInformation() {
    const [loading, setLoading] = useState(false);
    const [showNotification] = useNotification();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            showNotification(
                'Cập nhật thông tin của mèo thành công!',
                'success',
            );
        } catch (error) {
            showNotification('Cập nhật thông tin của mèo thất bại!', 'error');
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <TitleSection>Mèo của bạn</TitleSection>

            <TextField label="Tên" variant="standard" fullWidth />

            <TextField
                label="Tuổi"
                type="number"
                variant="standard"
                fullWidth
            />

            <TextField
                label="Cân nặng (kg)"
                type="number"
                variant="standard"
                fullWidth
            />

            <TextField
                label="Chiều cao (cm)"
                type="number"
                variant="standard"
                fullWidth
            />

            <LoadingButton
                sx={{ marginLeft: 'auto' }}
                variant="contained"
                color="primary"
                type="submit"
                loading={loading}
            >
                Cập nhật
            </LoadingButton>
        </Box>
    );
}
