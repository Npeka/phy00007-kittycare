'use client';
import { useState } from 'react';
import Link from 'next/link';
import { TextField, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FormLayout from '@/ui/layout/form-layout';
import { redirect } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

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
        setTimeout(() => {
            setLoading(false);
            alert('Mã xác nhận đã được gửi đến email của bạn');
            redirect('/reset-password');
        }, 3000);
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
                    className="m-auto mt-4 rounded-full px-10 py-2 font-bold text-black"
                    type="submit"
                    size="large"
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
