import { CameraLive, DataStorageHistory } from '@/ui/pet-monitoring';

export default function PetMonitoring() {
    return (
        <div className="space-y-4">
            <CameraLive />
            {/* <DataStorageHistory /> */}
        </div>
    );
}
