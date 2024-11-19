import Link from 'next/link';
import Image from 'next/image';
import { subDays } from 'date-fns';
import { Card, Typography } from '@mui/material';
import imageIcon from '@/public/pet-monitoring/image.svg';
import videoIcon from '@/public/pet-monitoring/video.svg';
import TitleSection from '@/ui/common/title-section';

export default function DataStorageHistory() {
    const data = [
        {
            video: 'https://example.com/video1',
            image: 'https://example.com/image1',
        },
        {
            video: 'https://example.com/video2',
            image: 'https://example.com/image2',
        },
        {
            video: 'https://example.com/video3',
            image: 'https://example.com/image3',
        },
        {
            video: 'https://example.com/video4',
            image: 'https://example.com/image4',
        },
        {
            video: 'https://example.com/video5',
            image: 'https://example.com/image5',
        },
        {
            video: 'https://example.com/video6',
            image: 'https://example.com/image6',
        },
        {
            video: 'https://example.com/video7',
            image: 'https://example.com/image7',
        },
    ];

    const daysOfWeek = ['Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'CN'];
    const today = new Date();

    return (
        <>
            <TitleSection>Lịch sử lưu trữ dữ liệu</TitleSection>

            <Typography variant="h6">
                <i>
                    Dữ liệu sẽ được lưu trữ trong 7 ngày gần nhất, sau 7 ngày
                    mọi dữ liệu sẽ được xóa khỏi Lịch Sử Lưu Trữ.
                    <br />
                    <b>
                        Nhấn để xem chi tiết video và hình ảnh của ngày bạn muốn
                        xem.
                    </b>
                </i>
            </Typography>

            <div className="grid grid-cols-7 gap-4">
                {data.map((item, index) => (
                    <CardItem
                        key={index}
                        dayLabel={
                            daysOfWeek[subDays(today, 8 - index).getDay()]
                        }
                        day={subDays(today, 7 - index).getDate()}
                        video={item.video}
                        image={item.image}
                    />
                ))}
            </div>
        </>
    );
}

const CardItem = ({
    dayLabel,
    day,
    video,
    image,
}: {
    dayLabel: string;
    day: number;
    video: string;
    image: string;
}) => {
    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px 24px',
                borderRadius: '16px',
                textAlign: 'center',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    padding: 0,
                    textAlign: 'center',
                    fontWeight: '600',
                    fontFamily: '"Quicksand", sans-serif',
                }}
            >
                {dayLabel}
            </Typography>

            <Typography
                variant="h2"
                sx={{
                    marginBottom: '16px',
                    fontWeight: '600',
                    fontFamily: '"Quicksand", sans-serif',
                }}
            >
                {day}
            </Typography>

            <Link
                className="flex items-center gap-2"
                href={video}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src={videoIcon}
                    alt="image-icon"
                    width={25}
                    height={25}
                />
                <Typography variant="body2">Video</Typography>
            </Link>

            <Link
                className="flex items-center gap-2"
                href={image}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Image
                    src={imageIcon}
                    alt="video-icon"
                    width={25}
                    height={25}
                />
                <Typography variant="body2">Hình ảnh</Typography>
            </Link>
        </Card>
    );
};
