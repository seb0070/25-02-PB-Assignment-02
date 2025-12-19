import { Link } from 'react-router-dom';
import type { Movie } from '../models/movie';
import './MovieCard.css';

type Props = {
    movie: Movie;
    rank?: number; // ✅ 추가 (Popular에서만 사용)
};

const MovieCard = ({ movie, rank }: Props) => {
    return (
        <div className="movieCard">
            {/* TOP10 숫자 */}
            {typeof rank === 'number' && (
                <span className="movieRank">{rank}</span>
            )}

            <Link to={`/movie/${movie.id}`}>
                <img
                    src={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/no-image.png'
                    }
                    alt={movie.title}
                />
            </Link>
        </div>
    );
};

export default MovieCard;
