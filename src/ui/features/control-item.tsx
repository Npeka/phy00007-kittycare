import Image from 'next/image';
import { Box, Typography, Switch } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';

interface ControlItemProps {
    name: string;
    iconSrc: string;
    isOn: boolean;
    onToggle?: () => void;
    isAuto?: boolean | null;
    onAutoToggle?: () => void;
    actionLabel?: string;
    onAction?: () => void;
}

const ControlItem: React.FC<ControlItemProps> = ({
    name,
    iconSrc,
    isOn,
    onToggle,
    isAuto,
    onAutoToggle,
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
                <Switch
                    checked={isOn}
                    onChange={onToggle}
                    color="success"
                    disabled={isAuto ?? false}
                />
            </Box>
        )}

        {isAuto !== null && (
            <Box
                sx={{ width: '100%' }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">Tự động</Typography>
                <Switch
                    checked={isAuto}
                    onChange={onAutoToggle}
                    color="success"
                />
            </Box>
        )}

        <div className="m-auto aspect-square w-[72px] rounded-full bg-[#DAEBCE] p-5">
            <Image src={iconSrc} alt={`${name} icon`} width={50} height={50} />
        </div>

        <Typography align="center" variant="h6">
            {name}
        </Typography>

        {actionLabel && onAction && (
            <LoadingButton
                sx={{
                    margin: 'auto',
                    textTransform: 'none',
                }}
                size="small"
                variant="outlined"
                color="success"
                onClick={onAction}
                loading={isOn}
                loadingPosition="end"
                endIcon={<SendIcon />}
            >
                {actionLabel}
            </LoadingButton>
        )}
    </div>
);

export default ControlItem;

// cooldown 30s
