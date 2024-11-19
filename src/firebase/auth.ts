import './config';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    deleteUser,
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    setDoc,
    collection,
    addDoc,
} from 'firebase/firestore';

// import { auth, db } from './config';
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
        const [userDocRef, catDocRef] = await Promise.all([
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
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const signInUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        console.log(userCredential.user);
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
