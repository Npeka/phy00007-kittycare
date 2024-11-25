import { Box, Typography, Card, CardMedia } from '@mui/material';
import { TitleSection } from '@/ui/common';

export default function CameraLive() {
    const streamUrl =
        'https://www.youtube.com/live/6TtLd9O1Ajg?si=kDoSB58vTJWvexjJ';
    return (
        <>
            <TitleSection>
                {new Date().toLocaleDateString()}{' '}
                {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </TitleSection>

            <Box sx={{ position: 'relative' }}>
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
            </Box>
        </>
    );
}
