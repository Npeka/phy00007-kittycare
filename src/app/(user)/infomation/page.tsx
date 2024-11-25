import { Divider } from '@mui/material';
import {
    OwnerInformation,
    ChangePassword,
    CatInformation,
} from '@/ui/infomation';

export default function Page() {
    return (
        <div className="flex gap-8">
            <div className="flex-[1]">
                <OwnerInformation />
                <ChangePassword />
            </div>
            <Divider orientation="vertical" flexItem sx={{ my: 4 }} />
            <div className="flex-[1]">
                <CatInformation />
            </div>
        </div>
    );
}
