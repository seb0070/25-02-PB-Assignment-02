export const storage = {
    /**
     * localStorage에서 값을 가져온다.
     * - 값이 없거나
     * - JSON 파싱에 실패하면
     * → 반드시 defaultValue를 반환한다
     */
    get<T>(key: string, defaultValue: T): T {
        const value = localStorage.getItem(key);

        if (!value) {
            return defaultValue;
        }

        try {
            return JSON.parse(value) as T;
        } catch {
            return defaultValue;
        }
    },

    set<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },

    remove(key: string): void {
        localStorage.removeItem(key);
    },
};
