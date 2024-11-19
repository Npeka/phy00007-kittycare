'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
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

export default function Header() {
    const router = usePathname();
    const breadcrumbs = links.find((link) => link.href === router);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            }
        });
    }, []);

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
                            className="rounded-full bg-[#DAEBCE] px-4 py-2 !font-semibold text-black"
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
                            alt={"User's avatar"}
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
                        <Button variant="outlined" color="success">
                            <Link href="/sign-up">Đăng ký</Link>
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                outline: 'success',
                                background: 'white',
                                '&:hover': {
                                    background: 'white',
                                    backgroundOpacity: 0.5,
                                },
                            }}
                        >
                            <Link href="/sign-in">Đăng nhập</Link>
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}
