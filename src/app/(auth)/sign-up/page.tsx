'use client';
import Link from 'next/link';
import { useState } from 'react';
import { redirect } from 'next/navigation';
import {
    InputAdornment,
    Checkbox,
    IconButton,
    TextField,
    Typography,
    FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { FormLayout } from '@/ui/layout';
import { signUpUser } from '@/firebase/auth';

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        fullname: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        fullname: '',
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
            fullname:
                formValues.fullname.length >= 6
                    ? ''
                    : 'Họ và tên phải có ít nhất 6 ký tự',
            email: formValues.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
                ? ''
                : 'Email không hợp lệ',
            password:
                formValues.password.length >= 6
                    ? ''
                    : 'Mật khẩu phải có ít nhất 6 ký tự',
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await signUpUser(
                formValues.fullname,
                formValues.email,
                formValues.password,
            );
            redirect('/');
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormLayout title="Đăng ký">
                <TextField
                    id="fullname"
                    name="fullname"
                    type="text"
                    label="Họ và tên"
                    variant="standard"
                    size="small"
                    required
                    value={formValues.fullname}
                    onChange={handleInputChange}
                    error={Boolean(errors.fullname)}
                    helperText={
                        errors.fullname || 'Họ và tên phải có ít nhất 6 ký tự'
                    }
                />

                <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="standard"
                    size="small"
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
                    size="small"
                    required
                    value={formValues.password}
                    onChange={handleInputChange}
                    error={Boolean(errors.password)}
                    helperText={
                        errors.password || 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
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
                    control={<Checkbox required color="default" />}
                    label="Tôi đã đọc và đồng ý với điều khoản sử dụng"
                />

                <LoadingButton
                    sx={{
                        margin: 'auto',
                        padding: '0.5rem 2.5rem',
                        fontWeight: 'bold',
                    }}
                    type="submit"
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
