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

    const handleCardClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation(); // 카드 클릭 방지
        toggleWishlist(movie);
    };

    return (
        <div className="movie-card" onClick={handleCardClick}>
            <img
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-poster.png'
                }
                alt={movie.title}
            />

            {/* ❤️ 찜 토글 (hover 시 노출) */}
            <button
                className={`wishlist-btn ${wished ? 'active' : ''}`}
                onClick={handleWishlist}
                aria-label="찜하기"
            >
                {wished ? '❤️' : '🤍'}
            </button>
        </div>
    );
};

export default MovieCard;
