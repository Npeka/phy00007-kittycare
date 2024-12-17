'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
    ScaleOptionsByType,
} from 'chart.js';
import { getHealthLogsSorted } from '@/firebase/cat';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

export default function Chart() {
    const [dataFood, setDataFood] = useState<number[]>([]);
    const [dataDrink, setDataDrink] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [foodData, drinkData] = await getHealthLogsSorted();
            setDataFood(foodData);
            setDataDrink(drinkData);
        };
        fetchData();
    }, []);

    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Lượng tiêu thụ nước',
                data: dataDrink,
                backgroundColor: '#3b82f6',
                yAxisID: 'water',
            },
            {
                label: 'Lượng tiêu thụ thức ăn',
                data: dataFood,
                backgroundColor: '#8dbb8d',
                yAxisID: 'food',
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            water: {
                type: 'linear' as const,
                position: 'left',
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            } as ScaleOptionsByType<'linear'>,
            food: {
                type: 'linear' as const,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                beginAtZero: true,
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            } as ScaleOptionsByType<'linear'>,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    font: {
                        size: 16,
                    },
                },
            },
            title: {
                display: true,
                position: 'bottom',
                text: 'Biểu đồ lượng tiêu thụ nước và thức ăn',
                font: {
                    size: 18,
                },
            },
        },
    };

    return (
        <Card sx={{ height: '100%', width: '100%', borderRadius: '16px' }}>
            <CardContent sx={{ height: '400px' }}>
                <Bar
                    data={data}
                    options={options}
                    width={undefined}
                    height={undefined}
                />
            </CardContent>
        </Card>
    );
}
