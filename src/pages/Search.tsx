import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, getTrendingMoviesDay } from '../api/movies';
import MovieCard from '../components/MovieCard';
import type { Movie } from '../models/movie';
import './Search.css';

type MultiResult = {
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    title?: string;
    name?: string;
    poster_path?: string;
    known_for?: Movie[];
};

const SearchPage = () => {
    const [params, setParams] = useSearchParams();
    const query = params.get('q') ?? '';

    const [input, setInput] = useState(query);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setInput(query);
    }, [query]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                // 검색 전: 오늘의 트렌딩
                if (!query.trim()) {
                    const res = await getTrendingMoviesDay();
                    setMovies(res.data.results);
                    return;
                }

                // 🔍 Multi Search
                const res = await searchMulti(query.trim());

                // person → known_for 영화로 변환
                const parsed: Movie[] = res.data.results.flatMap(
                    (item: MultiResult) => {
                        if (item.media_type === 'movie' && item.poster_path) {
                            return item as unknown as Movie;
                        }

                        if (
                            item.media_type === 'person' &&
                            Array.isArray(item.known_for)
                        ) {
                            return item.known_for.filter((m) => m.poster_path);
                        }

                        return [];
                    }
                );

                setMovies(parsed);
            } catch (e) {
                console.error(e);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const q = input.trim();
        if (!q) {
            setParams({});
            return;
        }
        setParams({ q });
    };

    return (
        <main className="searchPage">
            <form className="searchForm" onSubmit={handleSubmit}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="제목, 배우, 장르를 검색해보세요"
                />
                <button type="submit">검색</button>
            </form>

            <section className="searchContent">
                <h2>
                    {query ? `“${query}” 검색 결과` : '오늘의 트렌딩 콘텐츠'}
                </h2>

                {loading ? (
                    <p className="loading">불러오는 중...</p>
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
