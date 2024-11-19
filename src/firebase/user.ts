import {
    getAuth,
    updateProfile,
    updateEmail,
    updatePassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from 'firebase/auth';

export const updateUserAvatar = async (photoURL: string) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User is not logged in');
    }

    if (!photoURL) {
        throw new Error('Photo URL is required');
    }

    try {
        await updateProfile(user, {
            photoURL,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserProfile = async (
    fullname?: string,
    email?: string,
    dob?: string,
) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User is not logged in');
    }

    if (fullname === user.displayName && email === user.email) {
        throw new Error('No changes were made');
    }

    if (!email) {
        throw new Error('Email is required');
    }

    try {
        console.log(dob);
        await Promise.all([
            fullname && updateProfile(user, { displayName: fullname }),
            email && updateEmail(user, email),
        ]);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateUserPassword = async (
    oldPassword: string,
    newPassword: string,
) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User is not logged in');
    }

    try {
        const credential = EmailAuthProvider.credential(
            user.email!,
            oldPassword,
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const sendUserEmailVerification = async (): Promise<void> => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error('User is not logged in');
    }

    try {
        await sendEmailVerification(user);
        console.log('Email verification sent!');
    } catch (error) {
        console.error(
            'An error occurred while sending email verification:',
            error,
        );
    }
};

export const sendUserPasswordResetEmail = async (
    email: string,
): Promise<void> => {
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent!');
    } catch (error) {
        console.error(
            'An error occurred while sending password reset email:',
            error,
        );
    }
};
