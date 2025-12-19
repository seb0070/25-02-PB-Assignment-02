import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetail } from '../api/movies';
import type { MovieDetail } from '../models/movie';
import './MovieDetail.css';

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchMovie = async () => {
            try {
                const response = await getMovieDetail(Number(id));
                setMovie(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchMovie();
    }, [id]);

    if (loading) {
        return <div style={{ color: 'white' }}>로딩 중...</div>;
    }

    if (!movie) {
        return <div style={{ color: 'white' }}>영화를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="movie-detail">
            {/* 상단 Hero 영역 */}
            <div
                className="movie-detail-hero"
                style={{
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : 'none',
                }}
            >
                <div className="overlay">
                    <h1>{movie.title}</h1>
                    <p className="overview">{movie.overview}</p>
                </div>
            </div>

            {/* 하단 정보 영역 */}
            <div className="movie-detail-info">
                <p>⭐ 평점: {movie.vote_average}</p>
                <p>📅 개봉일: {movie.release_date}</p>
                <p>
                    🎭 장르: {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
            </div>
        </div>
    );
};

export default MovieDetailPage;
