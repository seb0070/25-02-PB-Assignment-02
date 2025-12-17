import type { Movie } from '../models/movie';
import { useWishlist } from '../hooks/useWishlist';
import './MovieCard.css';

type Props = {
    movie: Movie;
};

const MovieCard = ({ movie }: Props) => {
    const { toggleWishlist, isWished } = useWishlist();

    return (
        <div className={`movie-card ${isWished(movie.id) ? 'wished' : ''}`}>
            <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
            />

            <div className="movie-overlay">
                <h4>{movie.title}</h4>
                <button
                    onClick={() =>
                        toggleWishlist({
                            id: movie.id,
                            title: movie.title,
                            poster_path: movie.poster_path,
                        })
                    }
                >
                    {isWished(movie.id) ? '♥ 찜 해제' : '♡ 찜'}
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
