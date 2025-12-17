import { useEffect, useState } from 'react';
import { searchMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

const Search = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [recentSearches, setRecentSearches] = useState<string[]>(
        storage.get<string[]>(STORAGE_KEYS.RECENT_SEARCHES, []) ?? []
    );

    const handleSearch = async (reset = true) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await searchMovies(query, page);
            setMovies((prev) =>
                reset ? res.data.results : [...prev, ...res.data.results]
            );

            if (reset) {
                const updated = [
                    query,
                    ...recentSearches.filter((q) => q !== query),
                ].slice(0, 5);

                setRecentSearches(updated);
                storage.set(STORAGE_KEYS.RECENT_SEARCHES, updated);
            }

        } catch (e) {
            console.error('Search API error', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300;

            if (nearBottom && !loading && query) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, query]);

    useEffect(() => {
        if (page > 1) {
            handleSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div>
            <h2>영화 검색</h2>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="영화 제목 검색"
            />
            <button
                onClick={() => {
                    setMovies([]);
                    setPage(1);
                    handleSearch(true);
                }}
            >
                검색
            </button>


            {recentSearches.length > 0 && (
                <div>
                    <strong>최근 검색어:</strong>
                    {recentSearches.map((word) => (
                        <button
                            key={word}
                            onClick={() => {
                                setQuery(word);
                                setPage(1);
                                handleSearch(true);
                            }}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            )}

            {loading && <p>로딩 중...</p>}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Search;
