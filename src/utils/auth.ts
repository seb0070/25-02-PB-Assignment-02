import { storage } from './storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

interface User {
    id: string;
    password: string; // TMDB API Key
}

export const registerUser = (
    email: string,
    password: string
): { success: boolean; message: string } => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);

    const exists = users.some((user) => user.id === email);
    if (exists) {
        return { success: false, message: '이미 존재하는 이메일입니다.' };
    }

    users.push({ id: email, password });
    storage.set(STORAGE_KEYS.USERS, users);

    return { success: true, message: '회원가입 성공' };
};
