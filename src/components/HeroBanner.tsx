import { useEffect, useMemo, useState } from 'react';
import type { Movie } from '../models/movie';
import { getTrendingMoviesDay } from '../api/movies';
import { useWishlist } from '../hooks/useWishlist';
import './HeroBanner.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

export default function HeroBanner() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const { toggleWishlist, isWished } = useWishlist();

    useEffect(() => {
        const fetch = async () => {
            const res = await getTrendingMoviesDay();
            const list: Movie[] = res.data.results ?? [];
            if (list.length) {
                setMovie(list[Math.floor(Math.random() * list.length)]);
            }
        };
        fetch();
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
                {/* TOP */}
                <div className="hero-top">
                    <span className="hero-badge">🔥 오늘의 화제작</span>
                </div>

                {/* MIDDLE */}
                <div className="hero-middle">
                    <h1 className="hero-title">{movie.title}</h1>
                    <p className="hero-overview">{movie.overview || '설명이 없습니다.'}</p>
                </div>

                {/* BOTTOM */}
                <div className="hero-bottom">
                    <div className="hero-meta">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        <span>📅 {movie.release_date}</span>
                    </div>

                    <div className="hero-actions">
                        <button className="btn light">상세정보</button>
                        <button
                            className={`btn wish ${isWished(movie.id) ? 'active' : ''}`}
                            onClick={() => toggleWishlist(movie)}
                        >
                            ❤️ 찜하기
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
