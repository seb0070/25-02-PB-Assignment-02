import { useEffect, useState } from 'react';
import type { Movie } from '../models/movie';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

type WishlistMovie = Pick<Movie, 'id' | 'title' | 'poster_path'>;

const WISHLIST_EVENT = 'wishlist:update';

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistMovie[]>(
        storage.get<WishlistMovie[]>(STORAGE_KEYS.WISHLIST, [])
    );

    // ✅ 다른 컴포넌트 / 다른 탭에서 변경 시 동기화
    useEffect(() => {
        const syncWishlist = () => {
            const latest = storage.get<WishlistMovie[]>(STORAGE_KEYS.WISHLIST, []);
            setWishlist(latest);
        };

        // 같은 탭에서 발생한 커스텀 이벤트
        const onCustomEvent = () => syncWishlist();

        // 다른 탭/창에서 발생한 storage 이벤트
        const onStorageEvent = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.WISHLIST) {
                syncWishlist();
            }
        };

        window.addEventListener(WISHLIST_EVENT, onCustomEvent);
        window.addEventListener('storage', onStorageEvent);

        return () => {
            window.removeEventListener(WISHLIST_EVENT, onCustomEvent);
            window.removeEventListener('storage', onStorageEvent);
        };
    }, []);

    const isWished = (id: number) =>
        wishlist.some((movie) => movie.id === id);

    const toggleWishlist = (movie: WishlistMovie) => {
        const updated = isWished(movie.id)
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];

        setWishlist(updated);
        storage.set(STORAGE_KEYS.WISHLIST, updated);

        // ✅ 같은 탭의 다른 useWishlist 인스턴스에 알림
        window.dispatchEvent(new Event(WISHLIST_EVENT));
    };

    return {
        wishlist,
        isWished,
        toggleWishlist,
    };
};
