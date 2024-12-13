'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormLayout } from '@/ui/layout';
import { useNotification } from '@/context/noti-context';
import { sendUserPasswordResetEmail } from '@/firebase/user';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [showNotification] = useNotification();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const validateEmail = () => {
        if (!email) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email');
            return false;
        }
        setError('');
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateEmail()) return;
        setLoading(true);
        try {
            await sendUserPasswordResetEmail(email);
            showNotification(
                'Một email đã được gửi đến bạn để khôi phục mật khẩu',
                'success',
            );
            router.push('/sign-in');
        } catch (error) {
            console.error(error);
            showNotification('Có lỗi xảy ra. Vui lòng thử lại sau', 'error');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormLayout title="Quên mật khẩu">
                <Typography
                    variant="body1"
                    align="center"
                    className="text-[#7B7B7B]"
                >
                    Nhập email của bạn để khôi phục mật khẩu
                </Typography>

                <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="standard"
                    required
                    value={email}
                    onChange={handleInputChange}
                    error={Boolean(error)}
                    helperText={error}
                />

                <LoadingButton
                    sx={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        padding: '0.5rem 2.5rem',
                        fontWeight: 'bold',
                    }}
                    type="submit"
                    variant="contained"
                    loading={loading}
                >
                    Gửi mã xác nhận
                </LoadingButton>

                <Typography
                    className="mt-4 text-[#7B7B7B]"
                    variant="body1"
                    align="center"
                >
                    Nhớ mật khẩu?{' '}
                    <Link href="/sign-in" className="font-bold">
                        Đăng nhập
                    </Link>
                </Typography>
            </FormLayout>
        </form>
    );
}
