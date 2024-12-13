'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification, NotificationContent } from '@/ui/common';

interface NotiContextType {
    showNotification: (
        message: string,
        severity?: 'success' | 'error' | 'info' | 'warning',
    ) => void;
    closeNotification: () => void;
}

const NotificationContext = createContext<NotiContextType>({
    showNotification: () => {},
    closeNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [noti, setNoti] = useState<NotificationContent>({
        open: false,
        message: '',
        severity: 'success',
    });

    const showNotification = (
        message: string,
        severity: 'success' | 'error' | 'info' | 'warning' = 'info',
    ) => {
        setNoti({
            open: true,
            message,
            severity,
        });
    };

    const closeNotification = () => {
        setNoti((prev) => ({ ...prev, open: false }));
    };

    return (
        <NotificationContext.Provider
            value={{ showNotification, closeNotification }}
        >
            <Notification
                open={noti.open}
                snackbarMessage={noti.message}
                snackbarSeverity={noti.severity}
                onClose={closeNotification}
            />
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const { showNotification, closeNotification } =
        useContext(NotificationContext);
    return [showNotification, closeNotification];
};
