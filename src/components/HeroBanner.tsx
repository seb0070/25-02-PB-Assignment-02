import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../models/movie';
import { getTrendingMoviesDay } from '../api/movies';
import { useWishlist } from '../hooks/useWishlist';
import './HeroBanner.css';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

type Props = {
    /** (선택) 모달 방식일 경우 사용 */
    onInfo?: (movie: Movie) => void;
};

export default function HeroBanner({ onInfo }: Props) {
    const [movie, setMovie] = useState<Movie | null>(null);
    const { toggleWishlist, isWished } = useWishlist();
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getTrendingMoviesDay();
                const list: Movie[] = res.data.results ?? [];
                if (list.length === 0) return;
                const picked = list[Math.floor(Math.random() * list.length)];
                setMovie(picked);
            } catch (e) {
                console.error('HeroBanner TMDB error', e);
            }
        };
        fetch();
    }, []);

    const bgUrl = useMemo(() => {
        if (!movie?.backdrop_path) return '';
        return `${IMAGE_BASE}${movie.backdrop_path}`;
    }, [movie]);

    if (!movie) return null;

    const handleInfo = () => {
        // ✅ 모달 방식이 있으면 우선 사용
        if (onInfo) {
            onInfo(movie);
            return;
        }
        // ✅ 기본 동작: 상세 페이지 이동
        navigate(`/movie/${movie.id}`);
    };

    return (
        <section
            className="hero"
            style={
                bgUrl
                    ? {
                        backgroundImage: `linear-gradient(
                90deg,
                rgba(0,0,0,.85) 0%,
                rgba(0,0,0,.35) 55%,
                rgba(0,0,0,.85) 100%
              ), url(${bgUrl})`,
                    }
                    : undefined
            }
        >
            <div className="hero-inner">
                <p className="hero-badge">
                    <i className="fa-solid fa-fire" /> 오늘의 화제작
                </p>

                {/* ✅ 제목은 반드시 흰색 */}
                <h1 className="hero-title">{movie.title}</h1>

                {/* ✅ Hero에서는 1~2줄 요약 */}
                <p className="hero-overview">
                    {movie.overview?.trim()
                        ? movie.overview.length > 180
                            ? movie.overview.slice(0, 180) + '…'
                            : movie.overview
                        : '설명이 제공되지 않는 콘텐츠입니다.'}
                </p>

                <div className="hero-meta">
                    {!!movie.vote_average && (
                        <span>
              <i className="fa-solid fa-star" /> {movie.vote_average.toFixed(1)}
            </span>
                    )}
                    {movie.release_date && (
                        <span>
              <i className="fa-regular fa-calendar" /> {movie.release_date}
            </span>
                    )}
                </div>

                {/* ✅ Hero는 버튼 UI 유지 */}
                <div className="hero-actions">
                    <button className="btn btn-primary" type="button" onClick={handleInfo}>
                        <i className="fa-solid fa-circle-info" /> 정보보기
                    </button>

                    <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={() => toggleWishlist(movie)}
                    >
                        <i
                            className={
                                isWished(movie.id)
                                    ? 'fa-solid fa-heart'
                                    : 'fa-regular fa-heart'
                            }
                        />{' '}
                        {isWished(movie.id) ? '찜 해제' : '찜하기'}
                    </button>
                </div>
            </div>
        </section>
    );
}
