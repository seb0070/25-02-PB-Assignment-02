import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../models/movie';
import { getTrendingMoviesDay } from '../api/movies';
import { useWishlist } from '../hooks/useWishlist';
import './HeroBanner.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export default function HeroBanner() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const navigate = useNavigate();
    const { toggleWishlist, isWished } = useWishlist();

    useEffect(() => {
        const fetch = async () => {
            const res = await getTrendingMoviesDay();
            const list: Movie[] = res.data.results ?? [];
            if (list.length === 0) return;
            setMovie(list[Math.floor(Math.random() * list.length)]);
        };
        fetch();
    }, []);

    const bgUrl = useMemo(() => {
        if (!movie?.backdrop_path) return '';
        return `${IMAGE_BASE}${movie.backdrop_path}`;
    }, [movie]);

    if (!movie) return null;

    return (
        <section
            className="hero"
            style={{
                backgroundImage: `
          linear-gradient(
            90deg,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.4) 55%,
            rgba(0,0,0,0.85) 100%
          ),
          url(${bgUrl})
        `,
            }}
        >
            <div className="hero-inner">
                <p className="hero-badge">🔥 오늘의 화제작</p>

                <h1 className="hero-title">{movie.title}</h1>

                <p className="hero-overview">
                    {movie.overview
                        ? movie.overview.length > 180
                            ? movie.overview.slice(0, 180) + '…'
                            : movie.overview
                        : '설명이 제공되지 않는 콘텐츠입니다.'}
                </p>

                <div className="hero-meta">
                    <span>⭐ {movie.vote_average.toFixed(1)}</span>
                    <span>📅 {movie.release_date}</span>
                </div>

                <div className="hero-actions">
                    <button
                        className="btn btn-info"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                        상세정보
                    </button>

                    <button
                        className={`btn btn-wish ${isWished(movie.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(movie)}
                    >
                        <span>{isWished(movie.id) ? '❤️' : '🤍'}</span>
                        <span>{isWished(movie.id) ? '찜됨' : '찜하기'}</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
