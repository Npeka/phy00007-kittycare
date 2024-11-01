'use client';

import { useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import FormLayout from '@/ui/layout/form-layout';
import { redirect } from 'next/navigation';
import { signIn } from '@/firebase/auth';
import Link from 'next/link';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = { email: '', password: '' };
        if (!formValues.email) {
            newErrors.email = 'Email is required';
        }
        if (formValues.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const response = await signIn(
                formValues.email,
                formValues.password,
            );
            console.log(response);
        } catch (error) {
            console.error('An error occurred while signing in:', error);
        }
        setLoading(false);
        redirect('/');
    };

    return (
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
                    error={Boolean(errors.email)}
                    helperText={errors.email}
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
                    error={Boolean(errors.password)}
                    helperText={errors.password}
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
                        margin: 'auto',
                        borderRadius: '999px',
                        padding: '0.5rem 2.5rem',
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                    type="submit"
                    size="large"
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
                    Bạn chưa tài khoản?{' '}
                    <Link href="/sign-up" className="font-bold">
                        Đăng ký
                    </Link>
                </Typography>
            </FormLayout>
        </form>
    );
}
