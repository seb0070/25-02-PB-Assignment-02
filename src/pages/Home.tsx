import { useNavigate } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import {
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
} from '../api/movies';

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* 🔥 HeroBanner 상세정보 버튼 연결 */}
            <HeroBanner
                onInfo={(movie) => navigate(`/movie/${movie.id}`)}
            />

            <MovieRow
                title="인기 영화"
                fetcher={getPopularMovies}
            />
            <MovieRow
                title="평점 높은 영화"
                fetcher={getTopRatedMovies}
            />
            <MovieRow
                title="현재 개봉작"
                fetcher={getNowPlayingMovies}
            />
            <MovieRow
                title="개봉 예정작"
                fetcher={getUpcomingMovies}
            />
        </>
    );
}
