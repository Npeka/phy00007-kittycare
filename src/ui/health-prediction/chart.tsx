import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJSFD,
    Chart as ChartJSTH,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ChartOptions,
} from 'chart.js';

ChartJSFD.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

ChartJSTH.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const labels = ['Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'CN'];

interface ChartDataFD {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        fill: boolean;
    }[];
}

interface ChartDataTH {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        barThickness?: number;
    }[];
}

const optionsFD: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 16,
                },
            },
        },
    },
    scales: {
        x: {
            ticks: {
                font: {
                    size: 16,
                },
            },
        },
        y: {
            ticks: {
                font: {
                    size: 16,
                },
            },
        },
    },
};

const optionsTH: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: {
                font: {
                    size: 16,
                },
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                font: {
                    size: 16,
                },
            },
        },
        x: {
            ticks: {
                maxRotation: 0,
                minRotation: 0,
                font: {
                    size: 16,
                },
            },
            grid: {
                offset: true,
            },
        },
    },
};

export const FoodChart = ({ data }: { data: number[] }) => {
    const chartData: ChartDataFD = {
        labels: labels,
        datasets: [
            {
                label: 'Lượng tiêu thụ thức ăn (g)',
                data: data,
                borderColor: '#E6436A',
                fill: true,
                backgroundColor: 'rgba(230, 67, 106, 0.2)',
            },
        ],
    };

    return <Line data={chartData} options={optionsFD} />;
};

export const DrinkChart = ({ data }: { data: number[] }) => {
    const chartData: ChartDataFD = {
        labels: labels,
        datasets: [
            {
                label: 'Lượng tiêu thụ nước (ml)',
                data: data,
                borderColor: '#3b82f6',
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
            },
        ],
    };

    return <Line data={chartData} options={optionsFD} />;
};

export const TemperatureChart = ({ data }: { data: number[] }) => {
    const chartData: ChartDataTH = {
        labels: labels,
        datasets: [
            {
                label: 'Nhiệt độ (°C)',
                data: data,
                backgroundColor: '#EAF0BA',
                barThickness: 35,
            },
        ],
    };

    return <Bar data={chartData} options={optionsTH} />;
};

export const HumidityChart = ({ data }: { data: number[] }) => {
    const chartData: ChartDataTH = {
        labels: labels,
        datasets: [
            {
                label: 'Độ ẩm (%)',
                data: data,
                backgroundColor: '#C0EDED',
                barThickness: 35,
            },
        ],
    };

    return <Bar data={chartData} options={optionsTH} />;
};
