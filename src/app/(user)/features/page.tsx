import { Divider } from '@mui/material';
import { ControlPanel, InformationPanel } from '@/ui/features';

export default function FeaturesPage() {
    return (
        <div className="h-maxs flex rounded-2xl bg-white">
            <div className="h-full flex-[1]">
                <InformationPanel />
            </div>

            <Divider orientation="vertical" variant="middle" flexItem />

            <div className="flex-[3]">
                <ControlPanel />
            </div>
        </div>
    );
}
