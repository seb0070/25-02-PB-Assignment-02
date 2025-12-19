import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMulti, getTrendingMoviesDay } from '../api/movies';
import type { Movie } from '../models/movie';
import MovieCard from '../components/MovieCard';
import './Search.css';

type MultiMovie = {
    id: number;
    media_type: 'movie';
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date: string;
    vote_average: number;
};

type MultiPerson = {
    id: number;
    media_type: 'person';
    name: string;
    profile_path: string | null;
    known_for: Movie[];
};

type MultiResult = MultiMovie | MultiPerson;

export default function Search() {
    const [params, setParams] = useSearchParams();
    const keyword = params.get('q') ?? '';

    const [input, setInput] = useState(keyword);
    const [results, setResults] = useState<MultiResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                if (!keyword) {
                    const res = await getTrendingMoviesDay();
                    setResults(res.data.results);
                } else {
                    const res = await searchMulti(keyword);
                    setResults(res.data.results);
                }
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [keyword]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setParams(input ? { q: input } : {});
    };

    return (
        <main className="search-page">
            {/* 🔍 검색바 */}
            <form className="search-bar" onSubmit={onSubmit}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="영화, 배우, 장르를 검색해보세요"
                />
                <button type="submit">검색</button>
            </form>

            {/* 🔥 타이틀 */}
            <h2 className="search-title">
                {keyword ? `"${keyword}" 검색 결과` : '추천 콘텐츠'}
            </h2>

            {/* 🎬 결과 */}
            <div className="search-grid">
                {results.map((item) => {
                    // 🎬 영화 검색 결과
                    if (
                        item.media_type === 'movie' &&
                        item.poster_path &&
                        'title' in item
                    ) {
                        const movie: Movie = {
                            id: item.id,
                            title: item.title!,
                            poster_path: item.poster_path!,
                            backdrop_path: item.backdrop_path ?? item.poster_path!,
                            overview: item.overview ?? '',
                            release_date: item.release_date ?? '',
                            vote_average: item.vote_average ?? 0,
                        };

                        return (
                            <MovieCard
                                key={`movie-${item.id}`}
                                movie={movie}
                            />
                        );
                    }

                    // 👤 인물 → 대표작
                    if (
                        item.media_type === 'person' &&
                        item.known_for &&
                        item.known_for.length > 0
                    ) {
                        return (
                            <MovieCard
                                key={`person-${item.id}`}
                                movie={item.known_for[0]}
                            />
                        );
                    }

                    return null;
                })}
            </div>

            {loading && <p className="loading">불러오는 중…</p>}
        </main>
    );
}
