import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    getTrendingMoviesDay,
    searchMulti,
} from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
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
    const [results, setResults] = useState<MultiResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // 검색어 없으면 → 트렌딩
                if (!query) {
                    const res = await getTrendingMoviesDay();
                    setResults(res.data.results);
                } else {
                    // 검색어 있으면 → 멀티 검색
                    const res = await searchMulti(query);
                    setResults(res.data.results);
                }
            } catch (e) {
                console.error('Search error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setParams({ q: input });
    };

    return (
        <main className="search-page">
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="영화, 배우, 장르 검색"
                />
                <button type="submit">검색</button>
            </form>

            {loading && <p>불러오는 중...</p>}

            <div className="search-grid">
                {results.map((item) => {
                    // 🎬 영화
                    if (item.media_type === 'movie') {
                        return (
                            <MovieCard
                                key={item.id}
                                movie={item as unknown as Movie}
                            />
                        );
                    }

                    // 👤 인물 → 대표작
                    if (item.media_type === 'person' && item.known_for?.[0]) {
                        return (
                            <MovieCard
                                key={item.id}
                                movie={item.known_for[0]}
                            />
                        );
                    }

                    return null;
                })}
            </div>
        </main>
    );
};

export default SearchPage;
