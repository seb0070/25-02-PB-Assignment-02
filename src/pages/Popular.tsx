import { useEffect, useState } from 'react';
import { getTrendingMoviesWeek } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Popular.css';

export default function Popular() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        getTrendingMoviesWeek().then((res) => {
            setMovies(res.data.results);
        });
    }, []);

    return (
        <section className="row">
            <h2>이번 주 대세 콘텐츠</h2>

            <div className="row-slider">
                {movies.map((movie, idx) => (
                    <div key={movie.id} className="popular-item">
                        <span className="popular-rank">{idx + 1}</span>
                        <MovieCard movie={movie} />
                    </div>
                ))}

            </div>
        </section>
    );
}
