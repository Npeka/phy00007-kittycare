'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, createContext } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

export const AuthContext = createContext<User | null>(null);

export default function ProtectedRoutes({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push('/sign-in');
            } else {
                setUser(user);
            }
        });

        return () => unsubscribe();
    }, [user, auth, router]);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}
