'use client';

import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#DAEBCE',
        },
        background: {
            default: '#DAEBCE',
        },
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

export default theme;
