'use client';

import { useState } from 'react';
import { updateUserPassword } from '@/firebase/user';
import { TextField, Box } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Notification from '@/ui/common/nofitication';
import TitleSection from '@/ui/common/title-section';

export default function ChangePassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [noti, setNoti] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const { oldPassword, newPassword, confirmPassword } =
            event.target as typeof event.target & {
                oldPassword: { value: string };
                newPassword: { value: string };
                confirmPassword: { value: string };
            };

        if (newPassword.value.length < 6) {
            setError((error) => ({
                ...error,
                newPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
            }));
            return;
        } else {
            setError((error) => ({
                ...error,
                newPassword: '',
            }));
        }

        if (newPassword.value !== confirmPassword.value) {
            setError((error) => ({
                ...error,
                confirmPassword: 'Mật khẩu không khớp',
            }));
            return;
        } else {
            setError((error) => ({
                ...error,
                confirmPassword: '',
            }));
        }

        setLoading(true);
        try {
            await updateUserPassword(oldPassword.value, newPassword.value);
            setNoti({
                open: true,
                message: 'Cập nhật mật khẩu thành công!',
                severity: 'success',
            });
        } catch (error) {
            setNoti({
                open: true,
                message: 'Cập nhật mật khẩu thất bại. Vui lòng thử lại',
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
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TitleSection>Thay đổi mật khẩu</TitleSection>

                <TextField
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    type="password"
                    variant="standard"
                    fullWidth
                />

                <TextField
                    label="Mật khẩu mới"
                    name="newPassword"
                    type="password"
                    variant="standard"
                    error={!!error.newPassword}
                    helperText={error.newPassword}
                    fullWidth
                />

                <TextField
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type="password"
                    variant="standard"
                    error={!!error.confirmPassword}
                    helperText={error.confirmPassword}
                    fullWidth
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
}
