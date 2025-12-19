import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPopularMovies, searchMovies } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Search.css';

const SearchPage = () => {
    const [params, setParams] = useSearchParams();
    const query = params.get('q') ?? '';

    const [input, setInput] = useState<string>(query);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // URL query가 바뀌면 input도 동기화 (단, ESLint set-state-in-effect 피하려고 한 틱 미룸)
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            setInput(query);
        });
        return () => cancelAnimationFrame(id);
    }, [query]);

    // 검색 전: 인기 영화 추천 / 검색 후: 검색 결과
    useEffect(() => {
        const id = requestAnimationFrame(() => {
            const fetch = async () => {
                setLoading(true);
                try {
                    if (!query.trim()) {
                        const res = await getPopularMovies(1);
                        setMovies(res.data.results);
                    } else {
                        const res = await searchMovies(query.trim(), 1);
                        setMovies(res.data.results);
                    }
                } catch (e) {
                    console.error('TMDB API error', e);
                    setMovies([]);
                } finally {
                    setLoading(false);
                }
            };

            fetch();
        });

        return () => cancelAnimationFrame(id);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = input.trim();
        if (!q) {
            // 빈 검색이면 q 파라미터 제거(= 추천 콘텐츠 상태)
            setParams({});
            return;
        }
        setParams({ q });
    };

    const title = query.trim() ? `“${query}” 검색 결과` : '추천 콘텐츠';

    return (
        <main className="searchPage">
            <form className="searchForm" onSubmit={handleSubmit}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="제목, 배우, 장르를 검색해보세요"
                    aria-label="검색어 입력"
                />
                <button type="submit">검색</button>
            </form>

            <section className="searchContent">
                <h2>{title}</h2>

                {loading ? (
                    <p className="loading">불러오는 중...</p>
                ) : movies.length === 0 ? (
                    <p className="empty">
                        {query.trim() ? '검색 결과가 없어요.' : '추천 콘텐츠를 불러오지 못했어요.'}
                    </p>
                ) : (
                    <div className="movieGrid">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default SearchPage;
