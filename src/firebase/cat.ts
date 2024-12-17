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

        const userCats = catsDocs.docs.filter((catDoc) => {
            const ownerId = catDoc.data().owner.id;
            return ownerId === user.uid;
        });

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
        const userCats = catsDocs.docs.filter((catDoc) => {
            const ownerId = catDoc.data().owner.id;
            return ownerId === user.uid;
        });

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

export const getHealthLogsSorted = async (): Promise<number[][]> => {
    try {
        const response = await fetch('api/get-health-logs');
        const data = await response.json();

        const sortedData = data
            .sort((a: any, b: any) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            })
            .slice(-7);

        let foodData = [0, 0, 0, 0, 0, 0, 0];
        let drinkData = [0, 0, 0, 0, 0, 0, 0];

        sortedData.forEach((item: any) => {
            const date = new Date(item.time);
            const day = date.getDay() != 0 ? date.getDay() - 1 : 6;
            foodData[day] += item.food;
            drinkData[day] += item.drink;
        });

        return [foodData, drinkData];
    } catch (error) {
        console.error('Error getting health logs:', error);
        return [[], []];
    }
};

export const getEnvironmentLogsSorted = async (): Promise<number[][]> => {
    try {
        const response = await fetch('api/get-env-logs');
        const data = await response.json();

        const sortedData = data
            .sort((a: any, b: any) => {
                return new Date(a.time).getTime() - new Date(b.time).getTime();
            })
            .slice(-7);

        let tempData = [0, 0, 0, 0, 0, 0, 0];
        let humidData = [0, 0, 0, 0, 0, 0, 0];

        sortedData.forEach((item: any) => {
            const date = new Date(item.time);
            const day = date.getDay() != 0 ? date.getDay() - 1 : 6;
            tempData[day] += item.temp;
            humidData[day] += item.humid;
        });

        return [tempData, humidData];
    } catch (error) {
        console.error('Error getting environment logs:', error);
        return [[], []];
    }
};
