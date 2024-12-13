'use client';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { cat, temperatureIcon, humidityIcon } from '@/public/home';
import { MeasurementUnit, TitleSection } from '@/ui/common';
import { AuthContext } from '@/context/auth-context';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase/config';
import { Environment } from '@/types/firebase';

export default function InformationPanel() {
    const user = useContext(AuthContext);
    const [env, setEnv] = useState<Environment>({
        food: 0,
        drink: 0,
        temperature: 0,
        humidity: 0,
    });

    useEffect(() => {
        if (!user) return;
        const envRef = ref(database, `${user.uid}/environment`);
        onValue(envRef, (snapshot) => {
            const data = snapshot.val();
            setEnv(data);
        });
    }, [user]);

    const date = new Date().toLocaleDateString('vi-VN');
    const time = new Date().toLocaleTimeString('vi-VN');

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
                    {env.temperature}
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
                    {env.humidity}
                    <MeasurementUnit> %</MeasurementUnit>
                </Typography>
            </div>

            <Image className="h-full grow rounded-2xl" src={cat} alt="my-cat" />
        </div>
    );
}
