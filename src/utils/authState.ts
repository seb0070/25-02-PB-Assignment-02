import { storage } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

type AuthState = {
    isLoggedIn: boolean;
    userId: string;
};

export const isLoggedIn = (): boolean => {
    const authState = storage.get<AuthState | null>(STORAGE_KEYS.AUTH, null);
    return authState?.isLoggedIn === true;
};
