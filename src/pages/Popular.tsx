import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Popular.css';

const Popular = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getPopularMovies(1);
                setMovies(res.data.results);
            } catch (e) {
                console.error('Popular API error', e);
            }
        };

        fetchMovies();
    }, []);

    return (
        <section className="row">
            <h2>이번 주 대세 콘텐츠</h2>

            <div className="row-slider">
                {movies.map((movie, idx) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        rank={idx + 1}
                    />
                ))}
            </div>
        </section>
    );
};

export default Popular;
