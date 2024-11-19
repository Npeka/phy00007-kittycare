import { Skeleton } from '@mui/material';

const Loading = () => {
    return (
        <div className="grid h-full w-full grid-cols-2 gap-8 rounded-2xl bg-white p-8">
            <div className="flex w-full flex-wrap gap-8">
                <Skeleton variant="rounded" width={'40%'} height={'10%'} />
                <Skeleton variant="rounded" width={'40%'} height={'10%'} />
                <Skeleton variant="rounded" width={'30%'} height={'15%'} />
                <Skeleton variant="rounded" width={'30%'} height={'15%'} />
                <Skeleton variant="rounded" width={'30%'} height={'15%'} />
                <Skeleton variant="rounded" width={'100%'} height={'20%'} />
                <Skeleton variant="rounded" width={'100%'} height={'40%'} />
            </div>
            <div className="flex w-full flex-col gap-8">
                <Skeleton variant="rounded" width={'100%'} height={'5%'} />
                <Skeleton variant="rounded" width={'100%'} height={'5%'} />
                <Skeleton variant="rounded" width={'100%'} height={'5%'} />
                <div className="grid-col-3 grid h-full w-full grid-cols-2 gap-8">
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                    <Skeleton
                        variant="rounded"
                        width={'100%'}
                        height={'100%'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Loading;
