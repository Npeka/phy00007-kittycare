'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { Typography, Button, CircularProgress } from '@mui/material';
import {
    FoodChart,
    DrinkChart,
    TemperatureChart,
    HumidityChart,
} from '@/ui/health-prediction/chart';
import { getHealthLogsSorted, getEnvironmentLogsSorted } from '@/firebase/cat';
import { Card, CardContent } from '@mui/material';

export default function HealthPredictionPage() {
    const [analysis, setAnalysis] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const user = useContext(AuthContext);
    const [dataFD, setDataFD] = useState<number[][]>([[], []]);
    const [dataTH, setDataTH] = useState<number[][]>([[], []]);

    const getAnalysis = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/get-analysis/${user?.uid}`);
            const data = await res.json();
            setAnalysis(data);
        } catch (error) {
            console.error('Failed to get analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        const getData = async () => {
            const data = await Promise.all([
                getHealthLogsSorted(user.uid),
                getEnvironmentLogsSorted(user.uid),
            ]);

            setDataFD(data[0]);
            setDataTH(data[1]);
        };
        getAnalysis();
        getData();
    }, [user]);

    const handleCreateAnalysis = async () => {
        if (!user) return;
        setLoading2(true);
        try {
            const res = await fetch(`/api/create-analysis/${user?.uid}`, {
                method: 'POST',
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (error) {
            console.error('Failed to create analysis:', error);
        } finally {
            setLoading2(false);
        }
    };

    return (
        <div className="space-y-8 select-none">
            <LastWeekDate />
            <Typography
                variant="h5"
                sx={{
                    color: 'white',
                    fontWeight: '600',
                    backgroundColor: '#A6B997',
                    borderRadius: '999px',
                    width: 'fit-content',
                    padding: '0.25rem 1rem',
                    margin: '0 auto',
                }}
            >
                Kết quả dự đoán sức khỏe mèo của bạn trong tuần qua
            </Typography>

            <div className="grid max-w-full grid-cols-2 grid-rows-2 gap-4">
                <Card
                    sx={{ height: '100%', width: '100%', borderRadius: '16px' }}
                >
                    <CardContent sx={{ height: '350px' }}>
                        {<FoodChart data={dataFD[0]} />}
                    </CardContent>
                </Card>

                <Card
                    sx={{ height: '100%', width: '100%', borderRadius: '16px' }}
                >
                    <CardContent sx={{ height: '350px' }}>
                        <DrinkChart data={dataFD[1]} />
                    </CardContent>
                </Card>

                <Card
                    sx={{ height: '100%', width: '100%', borderRadius: '16px' }}
                >
                    <CardContent sx={{ height: '350px' }}>
                        <TemperatureChart data={dataTH[0]} />
                    </CardContent>
                </Card>

                <Card
                    sx={{ height: '100%', width: '100%', borderRadius: '16px' }}
                >
                    <CardContent sx={{ height: '350px' }}>
                        <HumidityChart data={dataTH[1]} />
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center space-x-4">
                <Button
                    variant="outlined"
                    color="success"
                    onClick={handleCreateAnalysis}
                    disabled={loading2}
                >
                    {loading2 ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Tạo phân tích mới'}
                </Button>
            </div>

            <Typography className={analysis === null ? 'text-center' : 'text-justify'} variant="h6" sx={{ fontWeight: '400' }}>
                {analysis !== null ? analysis : 'Chưa có dữ liệu phân tích'}
            </Typography>
        </div>
    );
}

const LastWeekDate = () => {
    const sunday = new Date();
    sunday.setDate(sunday.getDate() - sunday.getDay());
    const monday = new Date(sunday);
    monday.setDate(sunday.getDate() - 6);
    const ddmmyyyy = (date: Date) =>
        date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

    return (
        <>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: '800',
                    fontFamily: '"Montserrat", sans-serif;',
                }}
            >
                {`${ddmmyyyy(monday)} - ${ddmmyyyy(sunday)}`}
            </Typography>
        </>
    );
};
