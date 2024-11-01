'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    InputAdornment,
    Checkbox,
    IconButton,
    TextField,
    Typography,
    FormControlLabel,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import FormLayout from '@/ui/layout/form-layout';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { redirect } from 'next/navigation';
import { signUp } from '@/firebase/auth';

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {
            firstname: formValues.firstname ? '' : 'First name is required',
            lastname: formValues.lastname ? '' : 'Last name is required',
            email: formValues.email ? '' : 'Email is required',
            password:
                formValues.password.length >= 6
                    ? ''
                    : 'Password must be at least 6 characters',
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await signUp(
                formValues.firstname,
                formValues.lastname,
                formValues.email,
                formValues.password,
            );
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        redirect('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormLayout title="Đăng ký">
                <TextField
                    id="firstname"
                    name="firstname"
                    type="text"
                    label="Tên"
                    variant="standard"
                    required
                    value={formValues.firstname}
                    onChange={handleInputChange}
                    error={Boolean(errors.firstname)}
                    helperText={errors.firstname}
                />

                <TextField
                    id="lastname"
                    name="lastname"
                    type="text"
                    label="Họ"
                    variant="standard"
                    required
                    value={formValues.lastname}
                    onChange={handleInputChange}
                    error={Boolean(errors.lastname)}
                    helperText={errors.lastname}
                />

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

                <FormControlLabel
                    control={<Checkbox required />}
                    label="Tôi đã đọc và đồng ý với điều khoản và ứng dụng"
                />

                <LoadingButton
                    sx={{
                        margin: 'auto',
                        borderRadius: '9999px',
                        padding: '0.5rem 2.5rem',
                        fontWeight: 'bold',
                    }}
                    type="submit"
                    size="large"
                    variant="contained"
                    loading={loading}
                >
                    Đăng ký
                </LoadingButton>

                <Typography
                    className="text-[#7B7B7B]"
                    variant="body1"
                    align="center"
                >
                    Bạn đã có tài khoản?{' '}
                    <Link className="inline font-bold" href="/sign-in">
                        Đăng nhập
                    </Link>
                </Typography>
            </FormLayout>
        </form>
    );
}
