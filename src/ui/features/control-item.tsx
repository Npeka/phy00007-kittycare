import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { Box, Typography, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '@/context/auth-context';

interface ControlItemProps {
    name: string;
    iconSrc: string;
    isOn: boolean;
    onToggle?: () => void;
    isAuto?: boolean | null;
    onAutoToggle?: (isAuto: boolean) => void;
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
}) => {
    const user = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleAutoToggle = async () => {
        if (!user) return;

        if (onAutoToggle) {
            onAutoToggle(!isAuto); // Toggle the auto state
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/send-email/${user.uid}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `Thông báo từ KittyCare - ứng dụng chăm sóc thú cưng`,
                        text: `${name} đang được ${!isAuto ? 'Bật' : 'Tắt'} trong chế độ Tự động!`,
                    }),  
                });

                if (!response.ok) {
                    throw new Error('Failed to send email');
                }

                console.log('Email sent successfully');
            } catch (error) {
                console.error('Error sending email:', error);
            } finally {
                setIsLoading(false);
            } 
        }
    };

    return (
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
                        onChange={handleAutoToggle}
                        color="success"
                        disabled={isLoading} // Disable the switch while loading
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
};

export default ControlItem;
