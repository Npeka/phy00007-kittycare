'use client';
import { useState, useEffect, useContext } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    lightIcon,
    fanIcon,
    doorIcon,
    waterIcon,
    foodIcon,
    gameIcon,
    protectIcon,
} from '@/public/features';
import ControlItem from './control-item';
import { TitleSection } from '@/ui/common';
import { AuthContext } from '@/context/auth-context';
import { ref, onValue, update } from 'firebase/database';
import { database } from '@/firebase/config';
import { Devices, Auto } from '@/types/firebase';
import { useNotification } from '@/context/noti-context';

export default function ControlPanel() {
    const user = useContext(AuthContext);
    const [devices, setDevices] = useState<Devices>({
        protect: false,
        light: false,
        fan: false,
        door: false,
        laser: false,
        refill_food: false,
        refill_water: false,
    });
    const [auto, setAuto] = useState<Auto>({
        protect: false,
        light: false,
        fan: false,
        door: false,
    });

    useEffect(() => {
        if (!user) return;
        const envRef = ref(database, `${user.uid}/devices`);
        onValue(envRef, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                return;
            }
            setDevices(data);
        });
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const autoRef = ref(database, `${user.uid}/auto`);
        onValue(autoRef, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                return;
            }
            setAuto(data);
        });
    }, [user]);

    async function updateDeviceStatus(device: keyof Devices, status: boolean) {
        if (!user) return;
        const deviceRef = ref(database, `${user.uid}/devices/`);
        /*
        const response = await fetch(`http://localhost:3000/api/send-email/${user.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                subject: `Thông báo từ KittyCare - ứng dụng chăm sóc thú cưng`,
                text: `${device} đang được ${status ? 'Bật' : 'Tắt'}!`,
            }),  
        });
        if (!response.ok) {
            throw new Error('Failed to send email');
        }
        */
        update(deviceRef, { [device]: status });
        setDevices((prev) => ({ ...prev, [device]: status }));
    }

    function updateAutoStatus(device: keyof Auto, status: boolean) {
        if (!user) return;
        const autoRef = ref(database, `${user.uid}/auto/`);
        update(autoRef, { [device]: status });
        setAuto((prev) => ({ ...prev, [device]: status }));
    }

    if (!user) {
        return null;
    }

    return (
        <div className="h-full space-y-4 p-8">
            <TitleSection>Bảng điều khiển</TitleSection>
            <Schedule userId={user?.uid} />

            <div className="grid grid-cols-4 gap-4">
                <ControlItem
                    name="Đèn"
                    iconSrc={lightIcon}
                    isOn={devices.light}
                    onToggle={() => updateDeviceStatus('light', !devices.light)}
                    isAuto={auto.light}
                    onAutoToggle={() => updateAutoStatus('light', !auto.light)}
                />
                <ControlItem
                    name="Quạt"
                    iconSrc={fanIcon}
                    isOn={devices.fan}
                    onToggle={() => updateDeviceStatus('fan', !devices.fan)}
                    isAuto={auto.fan}
                    onAutoToggle={() => updateAutoStatus('fan', !auto.fan)}
                />
                <ControlItem
                    name="Cửa chuồng"
                    iconSrc={doorIcon}
                    isOn={devices.door}
                    onToggle={() => updateDeviceStatus('door', !devices.door)}
                    isAuto={auto.door}
                    onAutoToggle={() => updateAutoStatus('door', !auto.door)}
                />
                <ControlItem
                    name="Thả chuồng"
                    iconSrc={protectIcon}
                    isOn={!auto.protect}
                    onToggle={() => updateAutoStatus('protect', !auto.protect)}
                />
                <ControlItem
                    name="Trò chơi"
                    iconSrc={gameIcon}
                    isOn={devices.laser}
                    onToggle={() => updateDeviceStatus('laser', !devices.laser)}
                />
                <ControlItem
                    name="Nước"
                    iconSrc={waterIcon}
                    isOn={devices.refill_water}
                    actionLabel="Refill nước"
                    onAction={() => updateDeviceStatus('refill_water', true)}
                />
                <ControlItem
                    name="Thức ăn"
                    iconSrc={foodIcon}
                    isOn={devices.refill_food}
                    actionLabel="Refill thức ăn"
                    onAction={() => updateDeviceStatus('refill_food', true)}
                />
            </div>
        </div>
    );
}

const Schedule = ({ userId }: { userId: string }) => {
    const [showNotification] = useNotification();
    const [schedule, setSchedule] = useState<
        Partial<Record<keyof Devices, { time: string; status?: boolean }>>
    >(() => {
        const savedSchedule = localStorage.getItem('deviceSchedule');
        return savedSchedule ? JSON.parse(savedSchedule) : {};
    });

    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [intervals, setIntervals] = useState<Record<string, NodeJS.Timeout>>(
        {},
    );

    const [devices, setDevices] = useState<Devices>({
        protect: false,
        light: false,
        fan: false,
        door: false,
        laser: false,
        refill_food: false,
        refill_water: false,
    });

    useEffect(() => {
        // Lưu vào localStorage mỗi khi `schedule` thay đổi
        localStorage.setItem('deviceSchedule', JSON.stringify(schedule));
    }, [schedule]);

    function updateDeviceStatus(device: keyof Devices, status: boolean) {
        const deviceRef = ref(database, `${userId}/devices/`);
        update(deviceRef, { [device]: status });
        setDevices((prev) => ({ ...prev, [device]: status }));
    }

    function scheduleDevice(
        device: keyof Devices,
        time: string,
        status?: boolean,
    ) {
        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const target = new Date();
        target.setHours(hours, minutes, 0, 0);

        if (target < now) {
            target.setDate(target.getDate() + 1);
        }

        const delay = target.getTime() - now.getTime();

        const intervalId = setTimeout(() => {
            if (device === 'refill_food' || device === 'refill_water') {
                updateDeviceStatus(device, true);
            } else {
                updateDeviceStatus(device, status || false);
            }
        }, delay);

        setIntervals((prev) => ({ ...prev, [device]: intervalId }));
    }

    function clearDeviceSchedule(device: keyof Devices) {
        if (intervals[device]) {
            clearTimeout(intervals[device]);
            setIntervals((prev) => {
                const updated = { ...prev };
                delete updated[device];
                return updated;
            });
        }
        setSchedule((prev) => {
            const updated = { ...prev };
            delete updated[device];
            return updated;
        });
    }

    function handleScheduleChange(
        device: keyof Devices,
        field: 'time' | 'status',
        value: string | boolean,
    ) {
        setSchedule((prev) => ({
            ...prev,
            [device]: {
                ...prev[device],
                [field]: value,
            },
        }));
    }

    const devicesLabel: Record<keyof Devices, string> = {
        light: 'Đèn',
        fan: 'Quạt',
        door: 'Cửa chuồng',
        laser: 'Trò chơi',
        protect: 'Thả chuồng',
        refill_food: 'Refill thức ăn',
        refill_water: 'Refill nước',
    };

    function handleSaveSchedule() {
        Object.entries(schedule).forEach(([device, { time, status }]) => {
            if (time) {
                scheduleDevice(
                    device as keyof Devices,
                    time,
                    device === 'refill_food' || device === 'refill_water'
                        ? true
                        : status,
                );
            } else {
                clearDeviceSchedule(device as keyof Devices);
            }
        });
        setScheduleModalOpen(false);
        showNotification('Đặt lịch thành công', 'success');
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setScheduleModalOpen(true)}
            >
                Đặt lịch trước
            </Button>

            <Dialog
                open={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
            >
                <DialogTitle>Đặt lịch kích hoạt</DialogTitle>

                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.keys(devices).map((device) => (
                            <Grid
                                item
                                xs={6}
                                key={device}
                                sx={{ marginTop: 1 }}
                            >
                                <TextField
                                    fullWidth
                                    label={
                                        devicesLabel[device as keyof Devices]
                                    }
                                    type="time"
                                    color="success"
                                    value={
                                        schedule[device as keyof Devices]
                                            ?.time || ''
                                    }
                                    onChange={(e) =>
                                        handleScheduleChange(
                                            device as keyof Devices,
                                            'time',
                                            e.target.value,
                                        )
                                    }
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                <div className="flex items-center justify-between">
                                    {device !== 'refill_food' &&
                                    device !== 'refill_water' ? (
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={
                                                        schedule[
                                                            device as keyof Devices
                                                        ]?.status || false
                                                    }
                                                    onChange={(e) =>
                                                        handleScheduleChange(
                                                            device as keyof Devices,
                                                            'status',
                                                            e.target.checked,
                                                        )
                                                    }
                                                />
                                            }
                                            label="Bật/Tắt"
                                        />
                                    ) : (
                                        <div></div>
                                    )}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="error"
                                        onClick={() =>
                                            clearDeviceSchedule(
                                                device as keyof Devices,
                                            )
                                        }
                                        sx={{
                                            color: 'white',
                                            marginTop: 1,
                                            fontBold: '400',
                                            '&:hover': {
                                                backgroundColor: 'red',
                                            },
                                        }}
                                    >
                                        Xóa lịch
                                    </Button>
                                </div>
                            </Grid>
                        ))}
                    </Grid>

                    <DialogActions sx={{ marginTop: 2 }}>
                        <Button
                            variant="outlined"
                            color="success"
                            onClick={() => setScheduleModalOpen(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleSaveSchedule}
                            variant="contained"
                        >
                            Lưu
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};
