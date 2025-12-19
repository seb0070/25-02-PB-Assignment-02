import { useEffect, useState } from 'react';
import { getTrendingMoviesWeek } from '../api/movies';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../models/movie';

const PopularPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getTrendingMoviesWeek(page).then((res) => {
            setMovies((prev) => [...prev, ...res.data.results]);
        });
    }, [page]);

    return (
        <main style={{ padding: '24px' }}>
            <h1>이번 주 대세 콘텐츠</h1>

            <div className="movieGrid">
                {movies.map((movie, idx) => (
                    <MovieCard
                        key={`${movie.id}-${idx}`}
                        movie={movie}
                        rank={idx + 1} // TOP10용
                    />
                ))}
            </div>

            <button onClick={() => setPage((p) => p + 1)}>
                더 보기
            </button>
        </main>
    );
};

export default PopularPage;
