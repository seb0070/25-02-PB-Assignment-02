import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { MovieDetail } from '../models/movie';
import { getMovieDetail, getMovieVideos } from '../api/movies';
import './MovieDetail.css';


const IMAGE_BASE = 'https://image.tmdb.org/t/p/original';

type Video = {
    key: string;
    site: string;
    type: string;
};

export default function MovieDetail() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetch = async () => {
            try {
                const [movieRes, videoRes] = await Promise.all([
                    getMovieDetail(Number(id)),
                    getMovieVideos(Number(id)),
                ]);

                setMovie(movieRes.data);

                const trailer = (videoRes.data.results as Video[]).find(
                    (v) => v.site === 'YouTube' && v.type === 'Trailer'
                );

                if (trailer) {
                    setTrailerKey(trailer.key);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [id]);

    if (loading) return <div style={{ color: 'white' }}>로딩 중...</div>;
    if (!movie) return <div style={{ color: 'white' }}>영화를 찾을 수 없습니다.</div>;

    return (
        <div className="movie-detail">
            {/* 🎬 상단: 예고편 or 배너 */}
            <div className="movie-detail-hero">
                {trailerKey ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                        title="Movie Trailer"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                ) : (
                    <div
                        className="fallback-banner"
                        style={{
                            backgroundImage: movie.backdrop_path
                                ? `url(${IMAGE_BASE}${movie.backdrop_path})`
                                : 'none',
                        }}
                    />
                )}
            </div>

            {/* 🎞 정보 영역 */}
            <div className="movie-detail-info">
                <h1>{movie.title}</h1>

                <div className="movie-detail-genres">
                    {movie.genres.map((genre, index) => (
                        <span key={genre.id} className="genre-text">
                            {genre.name}
                            {index < movie.genres.length - 1 && (
                                <span className="genre-separator"> · </span>
                            )}
                        </span>
                    ))}
                </div>

                <p className="overview">{movie.overview}</p>

                <div className="meta">
                    <span>⭐ {movie.vote_average}</span>
                    <span>📅 {movie.release_date}</span>
                </div>
            </div>
        </div>
    );
}
