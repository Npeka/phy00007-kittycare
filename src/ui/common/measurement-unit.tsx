import { Typography } from '@mui/material';

const MeasurementUnit = ({ children }: { children: React.ReactNode }) => {
    return (
        <Typography variant="body1" className="inline text-[#818181]">
            {children}
        </Typography>
    );
};

export default MeasurementUnit;
