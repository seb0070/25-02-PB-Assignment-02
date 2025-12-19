import { useEffect, useState } from 'react';
import { getTrendingMoviesDay, getTrendingMoviesWeek } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Popular.css';

export default function Popular() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [period, setPeriod] = useState<'day' | 'week'>('week');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res =
                    period === 'day'
                        ? await getTrendingMoviesDay()
                        : await getTrendingMoviesWeek();

                setMovies(res.data.results);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        void fetchMovies();
    }, [period]);

    return (
        <section className="row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ margin: 0 }}>
                    🔥 {period === 'day' ? '오늘' : '이번 주'} 대세 콘텐츠
                </h2>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setPeriod('day')}
                        aria-pressed={period === 'day'}
                    >
                        오늘
                    </button>
                    <button
                        onClick={() => setPeriod('week')}
                        aria-pressed={period === 'week'}
                    >
                        이번주
                    </button>
                </div>
            </div>

            {loading && <p style={{ marginTop: 12 }}>Loading...</p>}

            {!loading && (
                <div className="row-slider">
                    {movies.map((movie, idx) => (
                        <div key={movie.id} className="popular-item">
                            <span className="popular-rank">{idx + 1}</span>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
