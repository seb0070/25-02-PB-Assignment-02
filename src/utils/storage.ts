export const storage = {
    get<T>(key: string, defaultValue?: T): T | null {
        const value = localStorage.getItem(key);
        if (!value) {
            return defaultValue ?? null;
        }
        try {
            return JSON.parse(value) as T;
        } catch {
            return defaultValue ?? null;
        }
    },

    set<T>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key: string) {
        localStorage.removeItem(key);
    },
};
