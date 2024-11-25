'use client';
import { useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
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
import { toggleFan } from '@/firebase/features';

export default function ControlPanel() {
    const [lightOn, setLightOn] = useState<boolean>(false);
    const [fanOn, setFanOn] = useState<boolean>(false);
    const [doorOn, setDoorOn] = useState<boolean>(false);
    const [gameOn, setGameOn] = useState<boolean>(false);
    const [openClosure, setOpenClosure] = useState<boolean>(false);

    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [schedule, setSchedule] = useState({
        light: '',
        fan: '',
        door: '',
        game: '',
        water: '',
        food: '',
    });

    const handleToggleFan = async () => {
        await toggleFan({ deviceId: 'esp32-001', state: !fanOn });
        setFanOn(!fanOn);
    };

    const handleOpenScheduleModal = () => {
        setScheduleModalOpen(true);
    };

    const handleCloseScheduleModal = () => {
        setScheduleModalOpen(false);
    };

    const handleScheduleChange = (field: string, value: string) => {
        setSchedule((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveSchedule = () => {
        console.log('Saved schedule:', schedule);
        handleCloseScheduleModal();
    };

    return (
        <div className="h-full space-y-4 p-8">
            <TitleSection>Bảng điều khiển</TitleSection>

            <Button variant="contained" onClick={handleOpenScheduleModal}>
                Đặt lịch trước
            </Button>

            <div className="grid grid-cols-4 gap-4">
                <ControlItem
                    name="Đèn"
                    iconSrc={lightIcon}
                    isOn={lightOn}
                    onToggle={() => setLightOn(!lightOn)}
                />
                <ControlItem
                    name="Quạt"
                    iconSrc={fanIcon}
                    isOn={fanOn}
                    onToggle={handleToggleFan}
                />
                <ControlItem
                    name="Cửa chuồng"
                    iconSrc={doorIcon}
                    isOn={doorOn}
                    onToggle={() => setDoorOn(!doorOn)}
                />
                <ControlItem
                    name="Trò chơi"
                    iconSrc={gameIcon}
                    isOn={gameOn}
                    onToggle={() => setGameOn(!gameOn)}
                />
                <ControlItem
                    name="Thả chuồng"
                    iconSrc={gameIcon}
                    isOn={openClosure}
                    onToggle={() => setOpenClosure(!openClosure)}
                />
                <ControlItem
                    name="Nước"
                    iconSrc={waterIcon}
                    isOn={false}
                    actionLabel="Thêm nước"
                    onAction={() => alert('Đã thêm nước')}
                />
                <ControlItem
                    name="Thức ăn"
                    iconSrc={foodIcon}
                    isOn={false}
                    actionLabel="Thêm thức ăn"
                    onAction={() => alert('Đã thêm thức ăn')}
                />
            </div>

            <Dialog
                open={scheduleModalOpen}
                onClose={handleCloseScheduleModal}
                sx={{ padding: '16px', borderRadius: '24px' }}
            >
                <DialogTitle>Đặt lịch kích hoạt</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Đèn"
                                type="time"
                                value={schedule.light}
                                onChange={(e) =>
                                    handleScheduleChange(
                                        'light',
                                        e.target.value,
                                    )
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ marginTop: '8px' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Quạt"
                                type="time"
                                value={schedule.fan}
                                onChange={(e) =>
                                    handleScheduleChange('fan', e.target.value)
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cửa chuồng"
                                type="time"
                                value={schedule.door}
                                onChange={(e) =>
                                    handleScheduleChange('door', e.target.value)
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Trò chơi"
                                type="time"
                                value={schedule.game}
                                onChange={(e) =>
                                    handleScheduleChange('game', e.target.value)
                                }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScheduleModal}>Hủy</Button>
                    <Button onClick={handleSaveSchedule} variant="contained">
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
