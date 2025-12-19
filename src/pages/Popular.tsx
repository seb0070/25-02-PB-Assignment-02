import { useEffect, useMemo, useRef, useState } from 'react';
import { getTrendingMoviesDay, getTrendingMoviesWeek } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import { BsGrid3X3Gap, BsList } from 'react-icons/bs';
import './Popular.css';

type SortOption = 'popular' | 'rating';
type ViewOption = 'grid' | 'table';

const PAGE_SIZE = 20;
const MAX_PAGE_BUTTONS = 5;

export default function Popular() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [period, setPeriod] = useState<'day' | 'week'>('day');
    const [sort, setSort] = useState<SortOption>('popular');
    const [view, setView] = useState<ViewOption>('grid');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    /* ===============================
       데이터 로딩
    =============================== */
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res =
                    period === 'day'
                        ? await getTrendingMoviesDay(page)
                        : await getTrendingMoviesWeek(page);

                const results: Movie[] = res.data.results;
                setTotalPages(res.data.total_pages);

                if (view === 'grid') {
                    setMovies((prev) => [...prev, ...results]);
                } else {
                    setMovies(results);
                }

                setHasMore(page < res.data.total_pages);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        void fetchMovies();
    }, [period, page, view]);

    /* 기준 / 뷰 변경 시 초기화 */
    useEffect(() => {
        setPage(1);
        setMovies([]);
        setHasMore(true);
    }, [period, view]);

    /* Infinite Scroll */
    useEffect(() => {
        if (view !== 'grid' || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 1 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [view, hasMore, loading]);

    /* 정렬 */
    const sortedMovies = useMemo(() => {
        if (sort === 'rating') {
            return [...movies].sort((a, b) => b.vote_average - a.vote_average);
        }
        return movies;
    }, [movies, sort]);

    /* Table pagination 번호 */
    const getPageNumbers = () => {
        let start = Math.max(1, page - Math.floor(MAX_PAGE_BUTTONS / 2));
        let end = start + MAX_PAGE_BUTTONS - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);
        }

        const pages: number[] = [];
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <section className="popular-page">
            <div className="popular-container">
                {/* Header */}
                <header className="popular-header">
                    <h2 className="popular-title">
                        🔥 {period === 'day' ? '오늘' : '이번 주'} 대세 콘텐츠
                    </h2>

                    <div className="popular-controls">
                        <div className="controls-left">
                            <button
                                className={`chip ${period === 'day' ? 'active' : ''}`}
                                onClick={() => setPeriod('day')}
                            >
                                오늘
                            </button>
                            <button
                                className={`chip ${period === 'week' ? 'active' : ''}`}
                                onClick={() => setPeriod('week')}
                            >
                                이번주
                            </button>

                            <select
                                className="select"
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortOption)}
                            >
                                <option value="popular">인기순</option>
                                <option value="rating">평점순</option>
                            </select>
                        </div>

                        <div className="controls-right">
                            <button
                                className={`icon-btn ${view === 'grid' ? 'active' : ''}`}
                                onClick={() => setView('grid')}
                                title="그리드 보기"
                            >
                                <BsGrid3X3Gap />
                            </button>
                            <button
                                className={`icon-btn ${view === 'table' ? 'active' : ''}`}
                                onClick={() => setView('table')}
                                title="목록 보기"
                            >
                                <BsList />
                            </button>
                        </div>
                    </div>

                    <p className="popular-subtitle">
                        TMDB 트렌딩 데이터를 기반으로 최근 사용자 관심이 급상승한 콘텐츠를 보여줍니다.
                    </p>
                </header>

                {/* Grid View */}
                {view === 'grid' && (
                    <>
                        <div className="popular-grid">
                            {sortedMovies.map((movie, idx) => (
                                <div key={movie.id} className="popular-grid-item">
                                    <span className="popular-rank">{idx + 1}</span>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {loading && <p className="popular-loading">로딩 중...</p>}
                        {hasMore && <div ref={loaderRef} style={{ height: 1 }} />}
                    </>
                )}

                {/* Table View */}
                {view === 'table' && (
                    <>
                        <table className="popular-table">
                            <thead>
                            <tr>
                                <th>랭킹</th>
                                <th>제목</th>
                                <th>평점</th>
                                <th>개봉일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortedMovies.map((movie, idx) => (
                                <tr key={movie.id}>
                                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                                    <td>{movie.title}</td>
                                    <td>{movie.vote_average}</td>
                                    <td>{movie.release_date}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(1)}>
                                «
                            </button>
                            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
                                ‹
                            </button>

                            {getPageNumbers().map((p) => (
                                <button
                                    key={p}
                                    className={p === page ? 'active' : ''}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                ›
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(totalPages)}
                            >
                                »
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* 🔝 Bottom Center Floating Top Button */}
            <button
                className="top-floating"
                onClick={() =>
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                    })
                }
                aria-label="맨 위로"
            >
                ^
            </button>
        </section>
    );
}
