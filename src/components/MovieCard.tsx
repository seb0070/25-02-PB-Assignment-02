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
        <div className="movie-card" onClick={handleInfo}>
            <img
                src={
                    movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : '/no-poster.png'
                }
                alt={movie.title}
            />

            {/* ✅ 우측 하단 액션 아이콘 */}
            <div className="card-actions">
                <button onClick={handleInfo} aria-label="상세 정보">
                    ℹ
                </button>
                <button onClick={handleWishlist} aria-label="찜하기">
                    {wished ? '❤️' : '🤍'}
                </button>
            </div>

            {/* ✅ 찜 상태 고정 표시 (크기 변화 없음) */}
            {wished && <div className="wish-indicator">❤️</div>}
        </div>
    );
};

export default MovieCard;
