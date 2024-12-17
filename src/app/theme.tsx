'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { NotificationProvider } from '@/context/noti-context';

const theme = createTheme({
    palette: {
        primary: {
            main: '#DAEBCE',
        },
        background: {
            default: '#DAEBCE',
        },
    },
    typography: {
        fontFamily: ['Roboto Flex', 'sans-serif'].join(','),
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    color: 'black',
                    fontWeight: 'bold',
                    borderWidth: '2px',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    '&:hover': {
                        backgroundColor: '#DAEBCE',
                    },
                    '& strong': {
                        fontWeight: 'bold',
                        color: '#000000',
                    },
                },
            },
        },
    },
});

export const KittyCareTheme = ({ children }: { children: React.ReactNode }) => {
    return (
        <AppRouterCacheProvider options={{ key: 'css' }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <NotificationProvider>{children}</NotificationProvider>
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
};
