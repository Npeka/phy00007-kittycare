import { Skeleton } from '@mui/material';

export default function Loading() {
    return (
        <div className="flex h-[450px] w-full flex-col items-center justify-center gap-8 rounded-2xl">
            <Skeleton variant="rounded" width={'40%'} height={'15%'} />
            <Skeleton variant="rounded" width={'75%'} height={'10%'} />
            <Skeleton variant="rounded" width={'75%'} height={'15%'} />
            <Skeleton variant="rounded" width={'70%'} height={'5%'} />
            <Skeleton variant="rounded" width={'25%'} height={'10%'} />
        </div>
    );
}
