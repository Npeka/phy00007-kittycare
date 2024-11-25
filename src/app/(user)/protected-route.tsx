import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/sign-in');
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    return <>{children}</>;
}
