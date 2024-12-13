import Image from 'next/image';
import { Card, CardContent, Typography } from '@mui/material';
import {
    food,
    water,
    temperatureIcon,
    humidityIcon,
    temperatureBg,
    humidityBg,
} from '@/public/home';
import { MeasurementUnit } from '@/ui/common';
import { memo } from 'react';

const HomeCard = ({ children }: { children: React.ReactNode }) => {
    return (
        <Card
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: '16px',
                height: '100%',
            }}
        >
            {children}
        </Card>
    );
};

const CardTitle = ({ children }: { children: React.ReactNode }) => {
    return <Typography variant="h5">{children}</Typography>;
};

const Status = ({
    statusColor,
    children,
}: {
    statusColor: string;
    children: React.ReactNode;
}) => {
    return (
        <p
            className="inline w-max rounded-full px-4 py-2 font-bold"
            style={{ backgroundColor: statusColor }}
        >
            {children}
        </p>
    );
};

export const Drink = memo(({ value }: { value: number }) => {
    const date = new Date().toLocaleDateString('vi-VN');
    return (
        <HomeCard>
            <CardContent>
                <CardTitle>{date}</CardTitle>
                <MeasurementUnit>{value}ml</MeasurementUnit>
            </CardContent>
            <Image className="mr-4" src={water} alt={'water'} height={120} />
        </HomeCard>
    );
});

export const Food = memo(({ value }: { value: number }) => {
    const date = new Date().toLocaleDateString('vi-VN');
    return (
        <HomeCard>
            <CardContent>
                <CardTitle>{date}</CardTitle>
                <MeasurementUnit>{value}mg</MeasurementUnit>
            </CardContent>
            <Image className="mr-4" src={food} alt={'food'} height={70} />
        </HomeCard>
    );
});

export const Temperature = memo(({ temperature }: { temperature: number }) => {
    let temperatureStatus;
    let statusColor;

    if (temperature > 25) {
        temperatureStatus = 'Nóng';
        statusColor = '#FFD1D1';
    } else if (temperature < 15) {
        temperatureStatus = 'Lạnh';
        statusColor = '#D1E7FF';
    } else {
        temperatureStatus = 'Bình thường';
        statusColor = '#BDE5F8';
    }

    return (
        <HomeCard>
            <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
                <div className="flex items-center gap-4">
                    <Image
                        className="min-h-20 min-w-20"
                        src={temperatureIcon}
                        alt="temperature-icon"
                    />
                    <CardTitle>Nhiệt độ môi trường</CardTitle>
                </div>

                <Typography variant="h4">
                    {temperature}
                    <MeasurementUnit>°C</MeasurementUnit>
                </Typography>

                <Status statusColor={statusColor}>{temperatureStatus}</Status>

                <Image
                    className="absolute bottom-0 left-[2%] w-[96%]"
                    src={temperatureBg}
                    alt="temperature-bg"
                    style={{ height: 'auto' }}
                />
            </CardContent>
        </HomeCard>
    );
});

export const Humidity = memo(({ humidity }: { humidity: number }) => {
    console.log('rendering humidity');
    let humidityStatus;
    let statusColor;

    if (humidity > 70) {
        humidityStatus = 'Cao';
        statusColor = '#FFD1D1';
    } else if (humidity < 30) {
        humidityStatus = 'Thấp';
        statusColor = '#D1E7FF';
    } else {
        humidityStatus = 'Bình thường';
        statusColor = '#F6FFD0';
    }

    return (
        <HomeCard>
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                <div className="flex items-center gap-4">
                    <Image
                        className="min-h-20 min-w-20"
                        src={humidityIcon}
                        alt="humidity-icon"
                    />
                    <CardTitle>Độ ẩm môi trường</CardTitle>
                </div>

                <Image
                    className="absolute bottom-0 left-[2%] h-auto w-[96%]"
                    src={humidityBg}
                    alt="humidity-bg"
                    style={{ height: 'auto' }}
                />

                <Typography variant="h4">
                    {humidity}
                    <MeasurementUnit>%</MeasurementUnit>
                </Typography>

                <Status statusColor={statusColor}>{humidityStatus}</Status>

                <Typography variant="body2"></Typography>
            </CardContent>
        </HomeCard>
    );
});
