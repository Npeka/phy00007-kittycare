'use client';

import Image from 'next/image';
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
        <div className="grid h-full grid-cols-8 grid-rows-[max-content_auto_auto] gap-8">
            <div className="col-span-2 row-span-2">
                <Food value={env.food} />
            </div>
            <div className="col-span-2 row-span-2">
                <Drink value={env.drink} />
            </div>   
            <div className="col-span-2 row-span-2">
                <Temperature temperature={env.temperature} />
            </div>

            <div className="col-span-2 row-span-2">
                <Humidity humidity={env.humidity} />
            </div>

            <div className="col-span-3">
                <Image
                    className="h-full w-full rounded-2xl object-cover"
                    src="/home/my-cat.jpg"
                    alt="cat"
                    width={500}
                    height={500}
                />
            </div>

            <div className="col-span-5">
                <Chart />
            </div>
        </div>
    );
}
