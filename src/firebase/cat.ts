import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    doc,
    collection,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import type { Cat } from '@/types/cat';

export const getCatInformation = async (): Promise<Cat | any> => {
    try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error('User not found');
            return null;
        }

        const catsDocs = await getDocs(collection(db, 'cats'));
        const userCats = catsDocs.docs.filter(
            (catDoc) => catDoc.data()?.owner === user.uid,
        );

        if (userCats.length === 0) {
            console.error('No cats found for the user');
            return null;
        }

        return userCats[0].data();
    } catch (error) {
        console.error('Error getting cat information:', error);
        return error;
    }
};

export const updateCatInformation = async ({
    name,
    age,
    height,
    weight,
}: Cat) => {
    try {
        const db = getFirestore();
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.error('User not found');
            return null;
        }

        const catsDocs = await getDocs(collection(db, 'cats'));
        const userCats = catsDocs.docs.filter(
            (catDoc) => catDoc.data()?.owner === user.uid,
        );

        if (userCats.length === 0) {
            console.error('No cats found for the user');
            return null;
        }

        await updateDoc(doc(db, 'cats', userCats[0].id), {
            name,
            age,
            height,
            weight,
        });
    } catch (error) {
        console.error('Error updating cat information:', error);
        return error;
    }
};
