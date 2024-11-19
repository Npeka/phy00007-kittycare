import {
    Home,
    Pets,
    Window,
    HealthAndSafety,
    FoodBank,
    Settings,
} from '@mui/icons-material';

const links = [
    {
        href: '/',
        label: 'Trang chủ',
        icon: Home,
    },
    {
        href: '/pet-monitoring',
        label: 'Quan sát thú cưng',
        icon: Pets,
    },
    {
        href: '/features',
        label: 'Chức năng',
        icon: Window,
    },
    {
        href: '/health-prediction',
        label: 'Dự đoán sức khỏe',
        icon: HealthAndSafety,
    },
    {
        href: '/nutrition-log',
        label: 'Nhật ký dinh dưỡng',
        icon: FoodBank,
    },
    {
        href: '/infomation',
        label: 'Thông tin',
        icon: Settings,
    },
];

export default links;
