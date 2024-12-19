'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { Drink, Food, Temperature, Humidity } from '@/ui/home/pet-environment';
import { Chart } from '@/ui/home';
import { AuthContext } from '@/context/auth-context';
import { ref, onValue } from 'firebase/database';
import { database } from '@/firebase/config';

interface Environment {
    drink: number;
    food: number;
    temperature: number;
    humidity: number;
}

export default function HomePage() {
    const user = useContext(AuthContext);
    const [env, setEnv] = useState<Environment>({
        drink: 0,
        food: 0,
        temperature: 0,
        humidity: 0,
    });

    useEffect(() => {
        if (!user) return;

        const handleNotification = async () => {
            const response = await fetch(
                `http://localhost:3000/api/send-email/${user.uid}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `Thông báo từ KittyCare - ứng dụng chăm sóc thú cưng`,
                        text: `Chào mừng bạn đến KittyCare!`,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            const mobileResponse = await fetch(
                `http://localhost:3000/api/notification`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'KittyCare Notification',
                        body: `Chào mừng bạn đến KittyCare!`,
                    }),
                },
            );

            if (!mobileResponse.ok) {
                throw new Error('Failed to send notification');
            }
            console.log('Email sent successfully');
        };

        handleNotification();
        const envRef = ref(database, `${user.uid}/environment`);
        onValue(envRef, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                return;
            }
            setEnv(data);
        });
    }, [user]);

    return (
        <div className="grid h-full grid-cols-8 grid-rows-[auto_auto] gap-8">
            <div className="col-span-2 row-span-1">
                <Food value={env.food} />
            </div>
            <div className="col-span-2 row-span-1">
                <Drink value={env.drink} />
            </div>
            <div className="col-span-2 row-span-1">
                <Temperature temperature={env.temperature} />
            </div>

            <div className="col-span-2 row-span-1">
                <Humidity humidity={env.humidity} />
            </div>

            <Link
                className="relative col-span-3 content-center"
                href="/pet-monitoring"
            >
                <p className="absolute left-0 right-0 top-1/2 z-50 -translate-y-1/2 text-center text-xl font-medium">
                    Nhấn vào để xem trực tiếp
                </p>
                <Image
                    className="h-full w-full rounded-2xl object-cover blur-sm brightness-90"
                    src="/home/my-cat.jpg"
                    alt="cat"
                    width={500}
                    height={500}
                />
            </Link>

            <div className="col-span-5">
                <Chart />
            </div>
        </div>
    );
}
