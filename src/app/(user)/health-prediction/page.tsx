'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import { Typography } from '@mui/material';
import {
    FoodChart,
    DrinkChart,
    TemperatureChart,
    HumidityChart,
} from '@/ui/health-prediction/chart';
import { getHealthLogsSorted, getEnvironmentLogsSorted } from '@/firebase/cat';
import { Card, CardContent } from '@mui/material';

export default function HealthPredictionPage() {
    const user = useContext(AuthContext);
    const [analysis, setAnalysis] = useState(null);

    const [dataFD, setDataFD] = useState<number[][]>([[], []]);
    const [dataTH, setDataTH] = useState<number[][]>([[], []]);

    useEffect(() => {
        const getData = async () => {
            const data = await Promise.all([
                getHealthLogsSorted(),
                getEnvironmentLogsSorted(),
            ]);

            setDataFD(data[0]);
            setDataTH(data[1]);
        };

        const getAnalysis = async () => {
            if (!user) return;
            const res = await fetch(`/api/get-analysis/${user?.uid}`);
            const data = await res.json();
            setAnalysis(data.data);
        };

        getData();
        // getAnalysis();
    }, [user]);

    return (
        <div className="space-y-8">
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

            <Typography variant="h6" sx={{ fontWeight: '400' }}>
                Dựa trên thông tin sức khỏe và sinh hoạt của Bé mèo nhỏ mít
                trong 7 ngày qua, có thể thấy một số điều cần lưu ý. Nhiệt độ
                môi trường dao động từ 27°C đến 33°C, trong khi độ ẩm cũng thay
                đổi từ 56% đến 78%. Nhiệt độ có xu hướng tăng cao vào những ngày
                cuối, có thể gây ra cảm giác khó chịu cho thú cưng. Về chế độ
                dinh dưỡng, lượng thức ăn và nước uống có sự biến động. Trong
                ngày 13-12, Bé mèo nhỏ mít đã tiêu thụ một lượng thức ăn khá lớn
                là 200 g, nhưng vào ngày 15-12, lượng thức ăn chỉ còn 45 g, đây
                là mức khá thấp. Lượng nước uống cũng giảm đáng kể trong những
                ngày gần đây, đặc biệt là vào ngày 15-12. Lời khuyên cho chủ
                nuôi là cần theo dõi sát sao lượng thức ăn và nước uống của Bé
                mèo nhỏ mít để đảm bảo thú cưng luôn được cung cấp đủ dinh dưỡng
                và nước. Nếu thấy thú cưng có dấu hiệu chán ăn hoặc không uống
                đủ nước, nên đưa đi khám bác sĩ thú y. Ngoài ra, trong những
                ngày có nhiệt độ cao, cần tạo môi trường thoáng mát và cung cấp
                đủ nước để Bé mèo nhỏ mít không bị mất nước.
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
