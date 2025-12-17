import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';

const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await getPopularMovies();
                setMovies(res.data.results);
            } catch (e) {
                console.error('TMDB API error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
        <div>
            <h2>인기 영화</h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Home;
