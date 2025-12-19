import type { Movie } from '../models/movie';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const navigate = useNavigate();
    const { isWished, toggleWishlist } = useWishlist();

    const wished = isWished(movie.id);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleWishlist(movie);
    };

    const handleInfo = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/movie/${movie.id}`);
    };

    return (
        <div
            className={`movie-card ${wished ? 'wished' : ''}`}
            onClick={handleInfo}
        >
            <img
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-poster.png'
                }
                alt={movie.title}
            />

            <div className="overlay">
                <div className="actions">
                    <button onClick={handleWishlist}>
                        {wished ? '❤️' : '🤍'}
                    </button>
                    <button onClick={handleInfo}>ℹ</button>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
