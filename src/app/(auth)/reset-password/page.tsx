'use client';
import { useState } from 'react';
import {
    InputAdornment,
    IconButton,
    TextField,
    Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormLayout from '@/ui/layout/form-layout';
import { redirect } from 'next/navigation';

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setConfirmPassword(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {
            password:
                password.length >= 6
                    ? ''
                    : 'Password must be at least 6 characters',
            confirmPassword:
                password === confirmPassword ? '' : 'Passwords do not match',
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Mật khẩu đã được đặt lại thành công');
            redirect('/sign-in');
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormLayout title="Đặt lại mật khẩu">
                <Typography variant="body1" align="center">
                    Nhập mật khẩu mới của bạn
                </Typography>

                <TextField
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Mật khẩu mới"
                    variant="standard"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
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

                <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    label="Xác nhận mật khẩu"
                    variant="standard"
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
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

                <LoadingButton
                    className="m-auto rounded-full px-10 py-2 font-bold text-black"
                    type="submit"
                    size="large"
                    variant="contained"
                    loading={loading}
                >
                    Xác nhận
                </LoadingButton>
            </FormLayout>
        </form>
    );
}
