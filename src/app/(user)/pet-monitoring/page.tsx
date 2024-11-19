import CameraLive from '@/ui/pet-monitoring/camera-live';
import DataStorageHistory from '@/ui/pet-monitoring/data-storage-history';

export default function PetMonitoring() {
    return (
        <div className="space-y-4">
            <CameraLive />
            <DataStorageHistory />
        </div>
    );
}
