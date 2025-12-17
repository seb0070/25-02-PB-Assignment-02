import { useEffect, useState } from 'react';
import { getPopularMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';

const Popular = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    // view 상태: infinite | table
    const [view, setView] = useState<'infinite' | 'table'>('infinite');

    // 영화 데이터 가져오기
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await getPopularMovies(page);

                if (view === 'infinite') {
                    setMovies((prev) => [...prev, ...res.data.results]);
                } else {
                    setMovies(res.data.results);
                }
            } catch (e) {
                console.error('Popular API error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page, view]);

    // Infinite Scroll (infinite view일 때만)
    useEffect(() => {
        if (view !== 'infinite') return;

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
    }, [loading, view]);

    return (
        <div>
            <h2>대세 콘텐츠</h2>

            {/* View 전환 버튼 */}
            <div style={{ marginBottom: '16px' }}>
                <button
                    onClick={() => {
                        setView('infinite');
                        setMovies([]);
                        setPage(1);
                    }}
                >
                    Infinite View
                </button>

                <button
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                        setView('table');
                        setPage(1);
                    }}
                >
                    Table View
                </button>
            </div>

            {/* Infinite View */}
            {view === 'infinite' ? (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {movies.map((movie) => (
                        <MovieCard key={`${movie.id}-${movie.title}`} movie={movie} />
                    ))}
                </div>
            ) : (
                // Table View
                <>
                    <table border={1} cellPadding={8}>
                        <thead>
                        <tr>
                            <th>제목</th>
                            <th>평점</th>
                            <th>개봉일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.title}</td>
                                <td>{movie.vote_average}</td>
                                <td>{movie.release_date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination (Table View 전용) */}
                    <div style={{ marginTop: '16px' }}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            이전
                        </button>

                        <span style={{ margin: '0 8px' }}>{page}</span>

                        <button onClick={() => setPage((prev) => prev + 1)}>
                            다음
                        </button>
                    </div>
                </>
            )}

            {loading && <p style={{ marginTop: '16px' }}>불러오는 중...</p>}

            {/* TOP 버튼 */}
            <button
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
                TOP
            </button>
        </div>
    );
};

export default Popular;
