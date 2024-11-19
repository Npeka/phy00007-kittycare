import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Card } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

export default function Calendar() {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: '16px',
            }}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
            </LocalizationProvider>
        </Card>
    );
}
