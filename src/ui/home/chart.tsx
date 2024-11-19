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

// Đăng ký các thành phần cần thiết cho Chart.js
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
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Lượng tiêu thụ nước',
                data: [750, 500, 650, 700, 800, 500, 750],
                backgroundColor: '#3b82f6',
                yAxisID: 'water',
            },
            {
                label: 'Lượng tiêu thụ thức ăn',
                data: [5, 2.4, 4, 3, 6, 2, 5],
                backgroundColor: '#8dbb8d',
                yAxisID: 'food',
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false, // Quan trọng để bỏ qua tỷ lệ khung hình
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
