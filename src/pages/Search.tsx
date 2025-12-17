import { useState } from 'react';
import { searchMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';

const Search = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const res = await searchMovies(query, 1);
            setMovies(res.data.results);
        } catch (e) {
            console.error('Search API error', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>영화 검색</h2>

            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="영화 제목 검색"
            />
            <button onClick={handleSearch}>검색</button>

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
