import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';

const Popular = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await getPopularMovies(page);
                setMovies((prev) => [...prev, ...res.data.results]);
            } catch (e) {
                console.error('Popular API error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page]);

    useEffect(() => {
        const handleScroll = () => {
            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300;

            if (nearBottom && !loading) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]);

    return (
        <div>
            <h2>대세 콘텐츠</h2>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {movies.map((movie) => (
                    <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
                ))}
            </div>

            {loading && <p style={{ marginTop: '16px' }}>불러오는 중...</p>}
        </div>
    );
};

export default Popular;
