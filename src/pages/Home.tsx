import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import { Movie } from '../models/movie';

const Home = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        getPopularMovies().then((res) => {
            setMovies(res.data.results);
        });
    }, []);

    return (
        <div>
            <h1>Popular Movies</h1>
            {movies.map((movie) => (
                <p key={movie.id}>{movie.title}</p>
            ))}
        </div>
    );
};

export default Home;
