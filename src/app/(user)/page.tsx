'use client';

import Image from 'next/image';
import cat from '@/public/home/my-cat.jpg';
import { Water, Food, Temperature, Humidity } from '@/ui/home/pet-environment';
import Calender from '@/ui/home/calender';
import Chart from '@/ui/home/chart';

export default function HomePage() {
    return (
        <div className="grid h-full grid-cols-8 grid-rows-[max-content_auto_auto] gap-8">
            <div className="col-span-2 row-span-2 grid grid-rows-2 gap-8">
                <Water />
                <Food />
            </div>

            <div className="col-span-2 row-span-2">
                <Temperature />
            </div>

            <div className="col-span-2 row-span-2">
                <Humidity />
            </div>

            <div className="col-span-2 row-span-2">
                <Calender />
            </div>

            <div className="col-span-3">
                <Image
                    className="h-full w-full rounded-2xl object-cover"
                    src={cat}
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
