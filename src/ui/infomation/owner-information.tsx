'use client';

import { useState, useEffect, useContext } from 'react';
import { updateUserAvatar, updateUserProfile } from '@/firebase/user';
import { TextField, Box, Avatar, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNotification } from '@/context/noti-context';
import { AuthContext } from '@/context/auth-context';
import TitleSection from '@/ui/common/title-section';

export default function OwnerInformation() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TitleSection>Chủ nuôi</TitleSection>
            <UpdateAvatar />
            <UpdateInformation />
        </Box>
    );
}

const UpdateAvatar = () => {
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showNotification] = useNotification();
    const user = useContext(AuthContext);

    useEffect(() => {
        if (user && user.photoURL) {
            setAvatarPreview(user.photoURL);
        }
    }, [user]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoadingAvatar(true);
            setAvatar(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            setLoadingAvatar(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingAvatar(true);
        if (avatarPreview === null) {
            showNotification('Vui lòng chọn ảnh đại diện!', 'error');
            setLoadingAvatar(false);
            return;
        }
        try {
            await updateUserAvatar(avatarPreview);
            setAvatar(null);
            showNotification('Cập nhật ảnh đại diện thành công!', 'success');
        } catch (error) {
            showNotification('Cập nhật ảnh đại diện thất bại!', 'error');
            console.log(error);
        }
        setLoadingAvatar(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
        >
            {user ? (
                <Avatar
                    src={
                        avatarPreview || user.photoURL || '/default-avatar.png'
                    }
                    alt="Avatar"
                    sx={{ width: 80, height: 80 }}
                />
            ) : (
                <Skeleton variant="circular" width={80} height={80} />
            )}

            <LoadingButton
                variant="contained"
                color="primary"
                loading={loadingAvatar}
                component="label"
            >
                Chọn ảnh đại diện
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleAvatarChange}
                />
            </LoadingButton>
            <LoadingButton
                type="submit"
                variant="outlined"
                color="success"
                disabled={loadingAvatar || !avatar}
            >
                Cập nhật
            </LoadingButton>
        </Box>
    );
};

const UpdateInformation = () => {
    const [loading, setLoading] = useState(false);
    const [showNotification] = useNotification();
    const [infomation, setInfomation] = useState({
        fullname: '' as string | null,
        email: '' as string | null,
    });

    const user = useContext(AuthContext);
    useEffect(() => {
        if (user) {
            setInfomation({
                fullname: user.displayName,
                email: user.email,
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInfomation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(
                infomation.fullname || '',
                infomation.email || '',
            );
            showNotification('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            showNotification('Cập nhật thông tin thất bại!', 'error');
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            {user ? (
                <>
                    <TextField
                        label="Họ và tên"
                        name="fullname"
                        variant="standard"
                        value={infomation.fullname}
                        InputLabelProps={{
                            shrink: infomation.fullname ? true : false,
                        }}
                        fullWidth
                        onChange={handleInputChange}
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="standard"
                        value={infomation.email}
                        InputLabelProps={{
                            shrink: infomation.email ? true : false,
                        }}
                        required
                        fullWidth
                        onChange={handleInputChange}
                    />

                    <LoadingButton
                        sx={{ marginLeft: 'auto' }}
                        variant="contained"
                        color="primary"
                        type="submit"
                        loading={loading}
                    >
                        Cập nhật
                    </LoadingButton>
                </>
            ) : (
                <>
                    <Skeleton variant="text" width="100%" height={44} />
                    <Skeleton variant="text" width="100%" height={44} />
                    <Skeleton
                        variant="text"
                        width="30%"
                        height={44}
                        sx={{ marginLeft: 'auto' }}
                    />
                </>
            )}
        </Box>
    );
};
