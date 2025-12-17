import { useState } from 'react';
import type { Movie } from '../models/movie';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

type WishlistMovie = Pick<Movie, 'id' | 'title' | 'poster_path'>;

export const useWishlist = () => {
    const [wishlist, setWishlist] = useState<WishlistMovie[]>(
        storage.get<WishlistMovie[]>(STORAGE_KEYS.WISHLIST, [])
    );

    const isWished = (id: number) =>
        wishlist.some((movie) => movie.id === id);

    const toggleWishlist = (movie: WishlistMovie) => {
        const updated = isWished(movie.id)
            ? wishlist.filter((item) => item.id !== movie.id)
            : [...wishlist, movie];

        setWishlist(updated);
        storage.set(STORAGE_KEYS.WISHLIST, updated);
    };

    return {
        wishlist,
        isWished,
        toggleWishlist,
    };
};
