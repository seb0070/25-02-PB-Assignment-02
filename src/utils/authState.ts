import { storage } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export const isLoggedIn = (): boolean => {
    const auth = storage.get<{ isLoggedIn: boolean }>(
        STORAGE_KEYS.AUTH,
        { isLoggedIn: false }
    );
    return auth.isLoggedIn;
};
