import Image from 'next/image';
import { Typography } from '@mui/material';
import TitleSection from '@/ui/common/title-section';
import MeasurementUnit from '@/ui/common/measurement-unit';
import temperatureIcon from '@/public/home/temperature-icon.svg';
import humidityIcon from '@/public/home/humidity-icon.svg';
import myCat from '@/public/home/my-cat.jpg';

export default function InformationPanel() {
    const date = '30/10/2024';
    const time = '17:00';
    const temperature = 36;
    const humidity = 18;

    return (
        <div className="flex h-full flex-col gap-4 p-8">
            <TitleSection>Bảng thông tin</TitleSection>

            <div className="w-full">
                <Typography variant="h6">Cập nhật:</Typography>
                <ul className="list-inside list-disc">
                    <li>
                        <i>Ngày {date}</i>
                    </li>
                    <li>
                        <i>Lúc {time}</i>
                    </li>
                </ul>
            </div>

            <div className="flex items-center justify-center gap-4 rounded-2xl bg-[#DAEBCE] p-4">
                <Image
                    className="min-h-16 min-w-16"
                    src={temperatureIcon}
                    alt="temperature-icon"
                />
                <Typography variant="h5">
                    {temperature}
                    <MeasurementUnit> °C</MeasurementUnit>
                </Typography>
            </div>

            <div className="flex items-center justify-center gap-4 rounded-2xl bg-[#DAEBCE] p-4">
                <Image
                    className="min-h-16 min-w-16"
                    src={humidityIcon}
                    alt="humidity-icon"
                />
                <Typography variant="h5">
                    {humidity}
                    <MeasurementUnit> %</MeasurementUnit>
                </Typography>
            </div>

            <Image
                className="h-full grow rounded-2xl"
                src={myCat}
                alt="my-cat"
            />
        </div>
    );
}
