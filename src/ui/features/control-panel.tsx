'use client';
import { useState } from 'react';
import { Button } from '@mui/material';
import {
    lightIcon,
    fanIcon,
    doorIcon,
    waterIcon,
    foodIcon,
    gameIcon,
} from '@/public/features/icons';
import TitleSection from '@/ui/common/title-section';
import ControlItem from './control-item';
import { toggleFan } from '@/firebase/features';

export default function ControlPanel() {
    const [lightOn, setLightOn] = useState<boolean>(false);
    const [fanOn, setFanOn] = useState<boolean>(false);
    const [doorOn, setDoorOn] = useState<boolean>(false);
    const [gameOn, setGameOn] = useState<boolean>(false);

    const handleToggleFan = async () => {
        await toggleFan({ deviceId: 'esp32-001', state: !fanOn });
        setFanOn(!fanOn);
    };

    return (
        <div className="h-full space-y-4 p-8">
            <TitleSection>Bảng điều khiển</TitleSection>

            <Button variant="contained">Đặt lịch trước</Button>

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
        </div>
    );
}
