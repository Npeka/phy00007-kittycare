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
        const [_, catDocRef] = await Promise.all([
            setDoc(doc(db, 'users', user.uid), { email }),
            addDoc(collection(db, 'cats'), {
                owner: user.uid,
                name: null,
                age: null,
                height: null,
                weight: null,
            }),
        ]);
        await setDoc(
            doc(db, 'users', user.uid),
            { cat: `/cats/${catDocRef.id}` },
            { merge: true },
        );

        const dataRef = user.uid;
        const nullObj: Data = {
            auto: {
                door: false,
                fan: false,
                light: false,
            },
            devices: {
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
        await signInWithEmailAndPassword(auth, email, password);
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
