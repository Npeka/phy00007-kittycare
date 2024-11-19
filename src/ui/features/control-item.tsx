import Image from 'next/image';
import { Box, Typography, Button, Switch } from '@mui/material';

interface ControlItemProps {
    name: string;
    iconSrc: string;
    isOn: boolean;
    onToggle?: () => void;
    actionLabel?: string;
    onAction?: () => void;
}

const ControlItem: React.FC<ControlItemProps> = ({
    name,
    iconSrc,
    isOn,
    onToggle,
    actionLabel,
    onAction,
}) => (
    <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-[#f1f1f1] p-4">
        {onToggle && (
            <Box
                sx={{ width: '100%' }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">{isOn ? 'Mở' : 'Tắt'}</Typography>
                <Switch checked={isOn} onChange={onToggle} color="success" />
            </Box>
        )}

        <div className="m-auto aspect-square w-[72px] rounded-full bg-[#DAEBCE] p-5">
            <Image src={iconSrc} alt={`${name} icon`} width={50} height={50} />
        </div>

        <Typography align="center" variant="h6">
            {name}
        </Typography>

        {actionLabel && onAction && (
            <Button
                sx={{ margin: 'auto', textTransform: 'none' }}
                variant="outlined"
                onClick={onAction}
                color="success"
                size="small"
            >
                {actionLabel}
            </Button>
        )}
    </div>
);

export default ControlItem;
