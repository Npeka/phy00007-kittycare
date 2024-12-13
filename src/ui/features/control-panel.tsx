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
} from '@/public/features';
import ControlItem from './control-item';
import { TitleSection } from '@/ui/common';
import { AuthContext } from '@/context/auth-context';
import { ref, onValue, update } from 'firebase/database';
import { database } from '@/firebase/config';
import { Devices } from '@/types/firebase';

export default function ControlPanel() {
    const user = useContext(AuthContext);
    const [devices, setDevices] = useState<Devices>({
        light: false,
        fan: false,
        door: false,
        laser: false,
        refill_food: false,
        refill_water: false,
    });

    const [schedule, setSchedule] = useState<
        Partial<Record<keyof Devices, { time: string; status?: boolean }>>
    >({});
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [intervals, setIntervals] = useState<Record<string, NodeJS.Timeout>>(
        {},
    );

    useEffect(() => {
        if (!user) return;
        const envRef = ref(database, `${user.uid}/devices`);
        onValue(envRef, (snapshot) => {
            const data = snapshot.val();
            setDevices(data);
        });
    }, [user]);

    function updateDeviceStatus(device: keyof Devices, status: boolean) {
        if (!user) return;
        const deviceRef = ref(database, `${user.uid}/devices/`);
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
            target.setDate(target.getDate() + 1); // Nếu thời gian đã qua, đặt lịch cho ngày mai
        }

        const delay = target.getTime() - now.getTime();

        // Đặt lịch
        const intervalId = setTimeout(() => {
            if (device === 'refill_food' || device === 'refill_water') {
                updateDeviceStatus(device, true); // Luôn đặt là true
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
    }

    return (
        <div className="h-full space-y-4 p-8">
            <TitleSection>Bảng điều khiển</TitleSection>

            <Button
                variant="contained"
                onClick={() => setScheduleModalOpen(true)}
            >
                Đặt lịch trước
            </Button>

            <div className="grid grid-cols-4 gap-4">
                <ControlItem
                    name="Đèn"
                    iconSrc={lightIcon}
                    isOn={devices.light}
                    onToggle={() => updateDeviceStatus('light', !devices.light)}
                />
                <ControlItem
                    name="Quạt"
                    iconSrc={fanIcon}
                    isOn={devices.fan}
                    onToggle={() => updateDeviceStatus('fan', !devices.fan)}
                />
                <ControlItem
                    name="Cửa chuồng"
                    iconSrc={doorIcon}
                    isOn={devices.door}
                    onToggle={() => updateDeviceStatus('door', !devices.door)}
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
                />
                <ControlItem
                    name="Thức ăn"
                    iconSrc={foodIcon}
                    isOn={devices.refill_food}
                />
            </div>

            <Dialog
                open={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
            >
                <DialogTitle>Đặt lịch kích hoạt</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {Object.keys(devices).map((device) => (
                            <Grid item xs={6} key={device}>
                                <TextField
                                    fullWidth
                                    label={device}
                                    type="time"
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
                                {device !== 'refill_food' &&
                                    device !== 'refill_water' && (
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
                                    )}
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScheduleModalOpen(false)}>
                        Hủy
                    </Button>
                    <Button onClick={handleSaveSchedule} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
