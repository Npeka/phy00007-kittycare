'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/firebase/auth';
import { MenuList, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import sidebarCat from '@/public/sidebar/cat.svg';
import links from '@/ui/common/sidebar-link';
import { AuthContext } from '@/context/auth-context';

export default function Sidebar() {
    const router = useRouter();
    const user = useContext(AuthContext);
    const handleSignOut = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/send-email/${user.uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject: `Thông báo từ KittyCare - ứng dụng chăm sóc thú cưng`,
                    text: `Hẹn gặp lại bạn!`,
                }),  
            });
    
            if (!response.ok) {
                throw new Error('Failed to send email');
            }
    
            const mobileResponse = await fetch(`http://localhost:3000/api/notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: 'KittyCare Notification',
                    body: `Hẹn gặp lại bạn!`,
                }),
            });
    
            if (!mobileResponse.ok) {
                throw new Error('Failed to send notification');
            }
            console.log('Email sent successfully');
            await signOutUser();
            router.push('/sign-in');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };

    useEffect(() => {
        links.map((link) => router.prefetch(link.href));
    }, [router]);

    return (
        <div className="flex h-full flex-col gap-4 rounded-xl bg-[#DAEBCE]">
            <Image
                className="w-full px-8"
                src={sidebarCat}
                alt="Sidebar Cat"
                width={100}
                height={100}
            />

            <MenuList className="flex grow flex-col gap-4">
                {links.map((link) => (
                    <MenuItem
                        key={link.href}
                        onClick={() => router.push(link.href)}
                    >
                        <ListItemIcon>
                            <link.icon className="text-black" />
                        </ListItemIcon>
                        <ListItemText>{link.label}</ListItemText>
                    </MenuItem>
                ))}

                <MenuItem
                    onClick={handleSignOut}
                    sx={{
                        color: 'error.main',
                        marginTop: 'auto',
                    }}
                >
                    <ListItemIcon>
                        <ExitToApp color="error" />
                    </ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
            </MenuList>
        </div>
    );
}
