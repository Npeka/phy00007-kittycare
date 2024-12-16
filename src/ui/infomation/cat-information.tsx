'use client';
import { useState, useEffect, useContext } from 'react';
import { TextField, Box, Skeleton } from '@mui/material';
import { TitleSection } from '@/ui/common';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNotification } from '@/context/noti-context';
import { AuthContext } from '@/context/auth-context';
import { getCatInformation, updateCatInformation } from '@/firebase/cat';

export default function CatInformation() {
    const user = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [showNotification] = useNotification();
    const [formValues, setFormValues] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        age: '',
        weight: '',
        height: '',
    });

    useEffect(() => {
        const fetchCatInformation = async () => {
            if (!user) return;
            setLoading(true);
            const catInfo = await getCatInformation();
            if (catInfo) {
                setFormValues({
                    name: catInfo.name,
                    age: String(catInfo.age),
                    weight: String(catInfo.weight),
                    height: String(catInfo.height),
                });
            }
            setLoading(false);
        };

        fetchCatInformation();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const newErrors = {
            name:
                formValues.name.length >= 6
                    ? ''
                    : 'Tên mèo phải có ít nhất 6 ký tự',
            age: formValues.age ? '' : 'Tuổi không được để trống',
            weight: formValues.weight ? '' : 'Cân nặng không được để trống',
            height: formValues.height ? '' : 'Chiều cao không được để trống',
        };
        setErrors(newErrors);

        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await updateCatInformation({
                name: formValues.name,
                age: Number(formValues.age),
                weight: Number(formValues.weight),
                height: Number(formValues.height),
            });
            showNotification(
                'Cập nhật thông tin của mèo thành công!',
                'success',
            );
        } catch (error) {
            showNotification('Cập nhật thông tin của mèo thất bại!', 'error');
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <TitleSection>Mèo của bạn</TitleSection>
            {user ? (
                <>
                    <TextField
                        label="Tên"
                        name="name"
                        variant="standard"
                        fullWidth
                        value={formValues.name}
                        onChange={handleInputChange}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Tuổi"
                        name="age"
                        type="number"
                        variant="standard"
                        fullWidth
                        value={formValues.age}
                        onChange={handleInputChange}
                        error={Boolean(errors.age)}
                        helperText={errors.age}
                    />
                    <TextField
                        label="Cân nặng (kg)"
                        name="weight"
                        type="number"
                        variant="standard"
                        fullWidth
                        value={formValues.weight}
                        onChange={handleInputChange}
                        error={Boolean(errors.weight)}
                        helperText={errors.weight}
                    />
                    <TextField
                        label="Chiều cao (cm)"
                        name="height"
                        type="number"
                        variant="standard"
                        fullWidth
                        value={formValues.height}
                        onChange={handleInputChange}
                        error={Boolean(errors.height)}
                        helperText={errors.height}
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
}
