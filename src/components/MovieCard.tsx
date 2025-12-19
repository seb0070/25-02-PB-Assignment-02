import type { Movie } from '../models/movie';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
    onInfo?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onInfo }: MovieCardProps) => {
    const navigate = useNavigate();
    const { isWished, toggleWishlist } = useWishlist();

    const wished = isWished(movie.id);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(movie);
    };

    const handleInfo = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (onInfo) {
            onInfo(movie);
        } else {
            navigate(`/movie/${movie.id}`);
        }
    };

    return (
        <div className="movie-card" onClick={handleInfo}>
            <img
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-poster.png'
                }
                alt={movie.title}
            />

            <div className="card-actions">
                <button onClick={handleInfo}>ℹ</button>
                <button onClick={handleWishlist}>
                    {wished ? '❤️' : '🤍'}
                </button>
            </div>

            {wished && <div className="wish-indicator">❤️</div>}
        </div>
    );
};

export default MovieCard;
