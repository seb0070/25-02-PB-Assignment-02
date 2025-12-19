import { useEffect, useMemo, useState } from 'react';
import type { Movie } from '../models/movie';
import { getTrendingMoviesDay } from '../api/movies';
import { useWishlist } from '../hooks/useWishlist';
import './HeroBanner.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

type Props = {
    onInfo: (movie: Movie) => void;
};

export default function HeroBanner({ onInfo }: Props) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const { toggleWishlist, isWished } = useWishlist();

    useEffect(() => {
        const fetchMovie = async () => {
            const res = await getTrendingMoviesDay();
            const list: Movie[] = res.data.results ?? [];
            if (list.length > 0) {
                setMovie(list[Math.floor(Math.random() * list.length)]);
            }
        };
        fetchMovie();
    }, []);

    const bgUrl = useMemo(() => {
        return movie?.backdrop_path
            ? `${IMAGE_BASE}${movie.backdrop_path}`
            : '';
    }, [movie]);

    if (!movie) return null;

    return (
        <section
            className="hero"
            style={{
                backgroundImage: `
          linear-gradient(
            to top,
            rgba(0,0,0,0.9) 0%,
            rgba(0,0,0,0.6) 40%,
            rgba(0,0,0,0.3) 70%,
            rgba(0,0,0,0.8) 100%
          ),
          url(${bgUrl})
        `,
            }}
        >
            <div className="hero-inner">
                {/* 🔥 오늘의 화제작 */}
                <div className="hero-top">🔥 오늘의 화제작</div>

                {/* 🔥 제목 + 설명 */}
                <div className="hero-text">
                    <h1 className="hero-title">{movie.title}</h1>
                    <p className="hero-overview">
                        {movie.overview || '설명이 제공되지 않는 콘텐츠입니다.'}
                    </p>
                </div>

                {/* 🔥 별점 / 날짜 */}
                <div className="hero-meta">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>📅 {movie.release_date}</span>
                </div>

                {/* 🔥 버튼 */}
                <div className="hero-actions">
                    <button
                        className="btn light"
                        onClick={() => onInfo(movie)}
                    >
                        상세정보
                    </button>

                    <button
                        className={`btn wish ${isWished(movie.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(movie)}
                    >
                        {isWished(movie.id) ? '❤️ 찜됨' : '🤍 찜하기'}
                    </button>
                </div>
            </div>
        </section>
    );
}
