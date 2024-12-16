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
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [showNotification] = useNotification();
    const user = useContext(AuthContext);

    useEffect(() => {
        if (user?.photoURL) {
            setAvatarPreview(user.photoURL);
        }
    }, [user, user?.photoURL]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLoading(true);
            setAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        if (!avatarPreview) {
            showNotification('Vui lòng chọn ảnh đại diện!', 'error');
            setLoading(false);
            return;
        }
        try {
            await updateUserAvatar(avatarPreview);
            setAvatar(null);
            showNotification('Cập nhật ảnh đại diện thành công!', 'success');
        } catch (error) {
            showNotification('Cập nhật ảnh đại diện thất bại!', 'error');
            console.error(error);
        }
        setLoading(false);
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
                loading={loading}
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
                disabled={loading || !avatar}
            >
                Cập nhật
            </LoadingButton>
        </Box>
    );
};

const UpdateInformation = () => {
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showNotification] = useNotification();
    const [information, setInformation] = useState({
        fullname: '' as string | null,
        email: '' as string | null,
    });

    useEffect(() => {
        if (user) {
            setInformation({
                fullname: user.displayName,
                email: user.email,
            });
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInformation((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(
                information.fullname || '',
                information.email || '',
            );
            showNotification('Cập nhật thông tin thành công!', 'success');
        } catch (error) {
            showNotification('Cập nhật thông tin thất bại!', 'error');
            console.error(error);
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
                        value={information.fullname}
                        InputLabelProps={{ shrink: !!information.fullname }}
                        fullWidth
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        variant="standard"
                        value={information.email}
                        InputLabelProps={{ shrink: !!information.email }}
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
