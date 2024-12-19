import './config';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
} from 'firebase/firestore';
import { ref, set } from 'firebase/database';
import { database } from '@/firebase/config';
import { Data } from '@/types/firebase';

import app from './config';
const auth = getAuth(app);
const db = getFirestore(app);

export const signUpUser = async (
    fullname: string,
    email: string,
    password: string,
) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
        );

        const user = userCredential.user;
        await updateProfile(user, { displayName: fullname });

        const userDocRef = doc(db, 'users', user.uid);
        const [_, catDocRef] = await Promise.all([
            setDoc(userDocRef, { email }),
            addDoc(collection(db, 'cats'), {
                owner: userDocRef,
                name: null,
                age: null,
                height: null,
                weight: null,
            }),
        ]);

        await updateDoc(userDocRef, { cat: catDocRef });

        const dataRef = user.uid;
        const nullObj: Data = {
            auto: {
                protect: false,
                door: false,
                fan: false,
                light: false,
            },
            devices: {
                protect: false,
                door: false,
                fan: false,
                laser: false,
                light: false,
                refill_food: false,
                refill_water: false,
            },
            environment: {
                drink: 0,
                food: 0,
                humidity: 0,
                temperature: 0,
            },
        };

        await set(ref(database, dataRef), nullObj);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const signInUser = async (email: string, password: string) => {
    try {
        const isSuccess = await signInWithEmailAndPassword(auth, email, password);
        if (!isSuccess) {
            throw new Error('Failed to sign in');
        }
        const handleNotification = async () => {
            const response = await fetch(
                `http://localhost:3000/api/send-email/${user.uid}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `Thông báo từ KittyCare - ứng dụng chăm sóc thú cưng`,
                        text: `Chào mừng bạn đến KittyCare!`,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error('Failed to send email');
            }

            const mobileResponse = await fetch(
                `http://localhost:3000/api/notification`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: 'KittyCare Notification',
                        body: `Chào mừng bạn đến KittyCare!`,
                    }),
                },
            );

            if (!mobileResponse.ok) {
                throw new Error('Failed to send notification');
            }
            console.log('Email sent successfully');
        };

        handleNotification();
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        throw error;
    }
};
