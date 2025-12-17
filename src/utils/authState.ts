import { storage } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface AuthState {
    isLoggedIn: boolean;
    userId: string;
}

export const isLoggedIn = (): boolean => {
    const auth = storage.get<AuthState>(STORAGE_KEYS.AUTH, {
        isLoggedIn: false,
        userId: '',
    });

    return auth.isLoggedIn;
};
