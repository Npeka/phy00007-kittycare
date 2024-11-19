import { Card, CardContent, Typography } from '@mui/material';
import Image from 'next/image';
import food from '@/public/home/food.svg';
import water from '@/public/home/water.svg';
import temperatureIcon from '@/public/home/temperature-icon.svg';
import humidityIcon from '@/public/home/humidity-icon.svg';
import temperatureBg from '@/public/home/temperature-bg.svg';
import humidityBg from '@/public/home/humidity-bg.svg';
import MeasurementUnit from '@/ui/common/measurement-unit';

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

export const Water = () => {
    const date = new Date().toLocaleDateString('en-GB');
    const ml = 300;
    return (
        <HomeCard>
            <CardContent>
                <CardTitle>{date}</CardTitle>
                <MeasurementUnit>{ml}ml</MeasurementUnit>
            </CardContent>
            <Image className="mr-4" src={water} alt={'water'} />
        </HomeCard>
    );
};

export const Food = () => {
    const date = new Date().toLocaleDateString('en-GB');
    const mg = 2.4;
    return (
        <HomeCard>
            <CardContent>
                <CardTitle>{date}</CardTitle>
                <MeasurementUnit>{mg}mg</MeasurementUnit>
            </CardContent>
            <Image className="mr-4" src={food} alt={'food'} />
        </HomeCard>
    );
};

export const Temperature = () => {
    const temperature = 36;

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
                />
            </CardContent>
        </HomeCard>
    );
};

export const Humidity = () => {
    const humidity = 30;

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
                    className="absolute bottom-0 left-[2%] w-[96%]"
                    src={humidityBg}
                    alt="humidity-bg"
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
};
