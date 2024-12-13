'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useContext } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Badge,
    Avatar,
    Button,
    Breadcrumbs,
} from '@mui/material';
import { Notifications } from '@mui/icons-material';
import Cat from '@/public/sidebar/cat.svg';
import links from './sidebar-link';
import { AuthContext } from '@/context/auth-context';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const breadcrumbs = links.find((link) => link.href === pathname);
    const user = useContext(AuthContext);

    return (
        <AppBar
            sx={{ background: 'transparent', boxShadow: 'none', padding: 0 }}
            position="static"
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 0,
                    margin: 0,
                    '&.MuiToolbar-root': {
                        padding: '0 !important',
                    },
                }}
            >
                <div className="flex items-center gap-20">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Typography
                            sx={{
                                borderRadius: '9999px',
                                backgroundColor: '#DAEBCE',
                                paddingX: '16px',
                                paddingY: '8px',
                                fontWeight: 'bold',
                                color: 'black',
                            }}
                            variant="h6"
                        >
                            {breadcrumbs?.label || 'Trang chủ'}
                        </Typography>
                    </Breadcrumbs>
                </div>
                {user ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}
                    >
                        <IconButton color="inherit">
                            <Badge color="error" badgeContent={100}>
                                <Notifications fontSize="large" />
                            </Badge>
                        </IconButton>
                        <Typography variant="body1">
                            Xin chào,{' '}
                            {user.displayName?.split(' ').slice(-1)[0]}
                        </Typography>
                        <Avatar
                            src={user.photoURL || Cat}
                            alt="User's avatar"
                            sx={{ width: 40, height: 40 }}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: '16px',
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => router.push('/sign-up')}
                        >
                            Đăng ký
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                outline: 'success',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    opacity: 0.5,
                                },
                            }}
                            onClick={() => router.push('/sign-in')}
                        >
                            Đăng nhập
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
