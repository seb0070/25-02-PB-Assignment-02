import './MovieCard.css';
import type { Movie } from '../models/movie';

type Props = {
    movie: Movie;
    rank?: number;
};

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export default function MovieCard({ movie, rank }: Props) {
    return (
        <div className="movie-card">
            {rank && <div className="movie-rank">{rank}</div>}

            <img
                src={
                    movie.poster_path
                        ? `${IMAGE_BASE}${movie.poster_path}`
                        : '/no-image.png'
                }
                alt={movie.title}
            />
        </div>
    );
}
