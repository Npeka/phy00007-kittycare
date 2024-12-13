'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { updateUserAvatar, updateUserProfile } from '@/firebase/user';
import { TextField, Box, Avatar } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import TitleSection from '@/ui/common/title-section';
import Notification from '@/ui/common/nofitication';
const auth = getAuth();
const user = auth.currentUser;

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
    const [noti, setNoti] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setAvatarPreview(user.photoURL);
            }
        });
    }, []);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoadingAvatar(true);
            setAvatar(file);
            const previewUrl = URL.createObjectURL(file);
            console.log(previewUrl);
            setAvatarPreview(previewUrl);
            setLoadingAvatar(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoadingAvatar(true);
        try {
            await updateUserAvatar(avatarPreview || '');
            setNoti({
                open: true,
                message: 'Cập nhật ảnh đại diện thành công!',
                severity: 'success',
            });
        } catch (error) {
            setNoti({
                open: true,
                message: 'Cập nhật ảnh đại diện thất bại. Vui lòng thử lại',
                severity: 'error',
            });
            console.log(error);
        }
        setLoadingAvatar(false);
    };

    return (
        <>
            <Notification
                open={noti.open}
                snackbarMessage={noti.message}
                snackbarSeverity={noti.severity}
                onClose={() => setNoti((prev) => ({ ...prev, open: false }))}
            />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
            >
                <Avatar
                    src={
                        user?.photoURL || avatarPreview || '/default-avatar.png'
                    }
                    alt="Avatar"
                    sx={{ width: 80, height: 80 }}
                />
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
        </>
    );
};

const UpdateInformation = () => {
    const [loading, setLoading] = useState(false);
    const [noti, setNoti] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const [infomation, setInfomation] = useState({
        fullname: user?.displayName,
        email: user?.email,
        birthdate: user?.metadata.creationTime,
    });

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setInfomation({
                    fullname: user.displayName,
                    email: user.email,
                    birthdate: user.metadata.creationTime,
                });
            }
        });
    }, []);

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
            setNoti({
                open: true,
                message: 'Cập nhật thông tin thành công!',
                severity: 'success',
            });
        } catch (error) {
            setNoti({
                open: true,
                message: 'Cập nhật thông tin thất bại. Vui lòng thử lại',
                severity: 'error',
            });
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <>
            <Notification
                open={noti.open}
                snackbarMessage={noti.message}
                snackbarSeverity={noti.severity}
                onClose={() => setNoti((prev) => ({ ...prev, open: false }))}
            />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
            >
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
            </Box>
        </>
    );
};
