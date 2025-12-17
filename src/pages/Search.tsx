import { useEffect, useState } from 'react';
import { searchMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';

const Search = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const handleSearch = async (reset = true) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await searchMovies(query, page);
            setMovies((prev) =>
                reset ? res.data.results : [...prev, ...res.data.results]
            );
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
                    setPage(1);
                    handleSearch(true);
                }}
            >
                검색
            </button>


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
