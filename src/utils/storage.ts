// 공통 LocalStorage 유틸

export const storage = {
    get<T>(key: string, defaultValue: T): T {
        const value = localStorage.getItem(key);
        if (!value) return defaultValue;

        try {
            return JSON.parse(value) as T;
        } catch {
            return defaultValue;
        }
    },

    set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key: string) {
        localStorage.removeItem(key);
    },
};
