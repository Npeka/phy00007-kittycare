import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    },
);

export interface NotificationProps {
    open: boolean;
    snackbarMessage: string;
    snackbarSeverity: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
}

export interface NotificationContent {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

export default function Notification({
    open,
    snackbarMessage,
    snackbarSeverity,
    onClose,
}: NotificationProps) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
    );
}
