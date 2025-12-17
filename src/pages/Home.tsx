import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';

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

    return (
        <div>
            <h1>Popular Movies</h1>

            {loading && <p>Loading...</p>}

            {movies.map((movie) => (
                <p key={movie.id}>{movie.title}</p>
            ))}
        </div>
    );
};

export default Home;
