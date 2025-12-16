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

export const loginUser = (
    email: string,
    password: string
): { success: boolean; message: string } => {
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);


    const user = users.find(
        (u) => u.id === email && u.password === password
    );

    if (!user) {
        return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    }

    storage.set(STORAGE_KEYS.AUTH, {
        isLoggedIn: true,
        userId: email,
    });

    return { success: true, message: '로그인 성공' };
};
