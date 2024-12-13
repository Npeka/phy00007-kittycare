'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardMedia,
    TextField,
    Button,
} from '@mui/material';
import { TitleSection } from '@/ui/common';

export default function CameraLive() {
    const [streamUrl, setStreamUrl] = useState('');
    const [ipAddress, setIpAddress] = useState('');
    const [loading, setLoading] = useState(true);

    const handleIpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIpAddress(event.target.value);
    };

    const handleSubmit = () => {
        if (ipAddress) {
            setStreamUrl(`http://${ipAddress}`);
            setLoading(true);
        }
    };

    useEffect(() => {
        if (streamUrl) {
            setLoading(false);
        }
    }, [streamUrl]);

    return (
        <>
            <TitleSection>
                {new Date().toLocaleDateString()}{' '}
                {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </TitleSection>

            <div className="flex items-center gap-4">
                <TextField
                    size="small"
                    label="Nhập IP Camera"
                    variant="outlined"
                    fullWidth
                    value={ipAddress}
                    onChange={handleIpChange}
                    sx={{ flex: 3 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{ width: 'auto' }}
                >
                    Xác nhận
                </Button>
            </div>

            <Box sx={{ position: 'relative' }}>
                {!loading && (
                    <Card sx={{ position: 'relative', borderRadius: 2 }}>
                        <CardMedia
                            className="aspect-video w-full rounded-2xl"
                            component="iframe"
                            allowFullScreen
                            src={streamUrl}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                backgroundColor: '#fff',
                                padding: '4px 8px',
                                borderRadius: 1,
                            }}
                        >
                            <Typography variant="caption">Trực tiếp</Typography>
                        </Box>
                    </Card>
                )}
            </Box>
        </>
    );
}
