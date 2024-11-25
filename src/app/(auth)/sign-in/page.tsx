'use client';
import Link from 'next/link';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import {
    Typography,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { FormLayout } from '@/ui/layout';
import { Notification } from '@/ui/common';
import { signInUser } from '@/firebase/auth';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [noti, setNoti] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInUser(formValues.email, formValues.password);
            setNoti({
                open: true,
                message: 'Đăng nhập thành công. Đang chuyển hướng...',
                severity: 'success',
            });
            setTimeout(() => {
                redirect('/');
            }, 3000);
        } catch (error) {
            console.error('Đã xảy ra lỗi khi đăng nhập:', error);
            setNoti({
                open: true,
                message: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setNoti((prev) => ({ ...prev, open: false }));
    };

    return (
        <>
            <Notification
                open={noti.open}
                snackbarMessage={noti.message}
                snackbarSeverity={noti.severity}
                onClose={handleSnackbarClose}
            />
            <form onSubmit={handleSubmit}>
                <FormLayout title="Đăng nhập">
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        variant="standard"
                        required
                        value={formValues.email}
                        onChange={handleInputChange}
                    />

                    <TextField
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Mật khẩu"
                        variant="standard"
                        required
                        value={formValues.password}
                        onChange={handleInputChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        className="text-[#7B7B7B]"
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        {showPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Typography
                        className="text-[#7B7B7B]"
                        variant="body1"
                        align="right"
                    >
                        <Link className="inline" href="/forgot-password">
                            Quên mật khẩu?
                        </Link>
                    </Typography>

                    <LoadingButton
                        sx={{
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            borderRadius: '999px',
                            padding: '0.5rem 2.5rem',
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                        type="submit"
                        variant="contained"
                        loading={loading}
                    >
                        Đăng nhập
                    </LoadingButton>

                    <Typography
                        className="text-[#7B7B7B]"
                        variant="body1"
                        align="center"
                    >
                        Bạn chưa có tài khoản?{' '}
                        <Link href="/sign-up" className="font-bold">
                            Đăng ký
                        </Link>
                    </Typography>
                </FormLayout>
            </form>
        </>
    );
}
