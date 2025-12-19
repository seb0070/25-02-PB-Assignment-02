import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchMulti, discoverMovies } from '../api/movies';
import './Search.css';

const RECENT_SEARCH_KEY = 'recent_searches';
const MAX_RECENT = 5;

type MediaType = 'movie' | 'person' | 'tv';

type MovieLike = {
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    media_type?: MediaType;
};

type PersonLike = {
    id: number;
    name: string;
    profile_path: string | null;
    media_type: 'person';
    known_for?: MovieLike[];
};

type ResultItem = MovieLike | PersonLike;

const isPerson = (item: ResultItem): item is PersonLike =>
    (item as PersonLike).media_type === 'person';

const getTitle = (item: MovieLike) => item.title ?? item.name ?? '';

const Search = () => {
    const navigate = useNavigate();

    /* =====================
       상태
    ===================== */
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem(RECENT_SEARCH_KEY);
        return saved ? (JSON.parse(saved) as string[]) : [];
    });

    const [filters, setFilters] = useState({
        genre: '',
        language: '',
        releasePeriod: '',
        rating: '',
        sort: 'popularity.desc',
    });

    const [results, setResults] = useState<ResultItem[]>([]);

    /* =====================
       유틸
    ===================== */
    const saveRecentSearch = (value: string) => {
        const v = value.trim();
        if (!v) return;

        const updated = [v, ...recentSearches.filter((i) => i !== v)].slice(
            0,
            MAX_RECENT
        );

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    const removeRecentSearch = (value: string) => {
        const updated = recentSearches.filter((i) => i !== value);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    const hasAnyFilter = () =>
        Boolean(
            filters.genre ||
            filters.language ||
            filters.releasePeriod ||
            filters.rating
        );

    const getReleaseDate = (period: string) => {
        if (!period) return undefined;
        const d = new Date();
        switch (period) {
            case 'week':
                d.setDate(d.getDate() - 7);
                break;
            case 'month':
                d.setMonth(d.getMonth() - 1);
                break;
            case 'year':
                d.setFullYear(d.getFullYear() - 1);
                break;
            case 'fiveYears':
                d.setFullYear(d.getFullYear() - 5);
                break;
            default:
                return undefined;
        }
        return d.toISOString().split('T')[0];
    };

    const filterByQuery = (items: ResultItem[], q: string) => {
        const keyword = q.trim().toLowerCase();
        if (!keyword) return items;

        return items.filter((item) => {
            if ('title' in item && item.title)
                return item.title.toLowerCase().includes(keyword);
            if ('name' in item && item.name)
                return item.name.toLowerCase().includes(keyword);
            return false;
        });
    };

    /* =====================
       검색 실행 (핵심)
    ===================== */
    const executeSearchWithQuery = async (searchQuery: string) => {
        const hasFilter = hasAnyFilter();

        setIsLoading(true);
        setResults([]);

        try {
            // 1️⃣ 검색어만
            if (searchQuery && !hasFilter) {
                saveRecentSearch(searchQuery);
                const res = await searchMulti(searchQuery);
                setResults((res.data?.results ?? []) as ResultItem[]);
                return;
            }

            // 2️⃣ 필터만 / 필터 + 검색어
            if (hasFilter) {
                if (searchQuery) saveRecentSearch(searchQuery);

                const res = await discoverMovies({
                    genre: filters.genre || undefined,
                    language: filters.language || undefined,
                    sort: filters.sort,
                    voteGte: filters.rating ? Number(filters.rating) : undefined,
                    releaseDateGte: getReleaseDate(filters.releasePeriod),
                    page: 1,
                });

                const discovered = (res.data?.results ?? []) as ResultItem[];
                const finalResults = searchQuery
                    ? filterByQuery(discovered, searchQuery)
                    : discovered;

                setResults(finalResults);
                return;
            }

            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const executeSearch = () => {
        void executeSearchWithQuery(query);
    };

    const getPosterUrl = (path: string | null, size: 'w185' | 'w342') =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

    /* =====================
       JSX
    ===================== */
    return (
        <main className="search-page">
            {/* 검색바 */}
            <section className="search-input-section">
                <div className="search-input-wrapper">
                    <input
                        className="search-input"
                        value={query}
                        placeholder="영화, 배우, 장르를 검색해보세요"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                    />

                    {query && (
                        <button className="clear-button" onClick={() => setQuery('')}>
                            <FiX />
                        </button>
                    )}

                    <button className="search-button" onClick={executeSearch}>
                        <FiSearch />
                    </button>
                </div>

                {/* 최근 검색어 */}
                {recentSearches.length > 0 && (
                    <div className="recent-searches">
                        {recentSearches.map((item) => (
                            <div key={item} className="recent-chip">
                                <button
                                    className="chip-text"
                                    onClick={() => {
                                        setQuery(item);
                                        void executeSearchWithQuery(item);
                                    }}
                                >
                                    {item}
                                </button>
                                <button
                                    className="chip-remove"
                                    onClick={() => removeRecentSearch(item)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 필터 */}
            <section className="filter-section">
                <p className="filter-title">선호하는 설정을 선택하세요</p>

                <div className="filters">
                    <select
                        value={filters.genre}
                        onChange={(e) =>
                            setFilters({ ...filters, genre: e.target.value })
                        }
                    >
                        <option value="">장르 (전체)</option>
                        <option value="35">코미디</option>
                        <option value="18">드라마</option>
                        <option value="28">액션</option>
                        <option value="10749">로맨스</option>
                    </select>

                    <select
                        value={filters.language}
                        onChange={(e) =>
                            setFilters({ ...filters, language: e.target.value })
                        }
                    >
                        <option value="">언어 (전체)</option>
                        <option value="ko">한국어</option>
                        <option value="en">영어</option>
                    </select>

                    <select
                        value={filters.releasePeriod}
                        onChange={(e) =>
                            setFilters({ ...filters, releasePeriod: e.target.value })
                        }
                    >
                        <option value="">개봉 시기</option>
                        <option value="week">최근 1주</option>
                        <option value="month">최근 1개월</option>
                        <option value="year">최근 1년</option>
                        <option value="fiveYears">5년 이내</option>
                    </select>

                    <select
                        value={filters.rating}
                        onChange={(e) =>
                            setFilters({ ...filters, rating: e.target.value })
                        }
                    >
                        <option value="">평점 (전체)</option>
                        <option value="7">7점 이상</option>
                        <option value="8">8점 이상</option>
                    </select>

                    <button
                        className="reset-button"
                        onClick={() =>
                            setFilters({
                                genre: '',
                                language: '',
                                releasePeriod: '',
                                rating: '',
                                sort: 'popularity.desc',
                            })
                        }
                    >
                        초기화
                    </button>
                </div>

                <p className="filter-hint">
                    ※ 필터로 1차로 고른 뒤 검색어로 2차 검색이 적용됩니다.
                </p>
            </section>

            {/* 정렬 */}
            <section className="sort-section">
                <span className="sort-label">정렬</span>
                <select
                    value={filters.sort}
                    onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                    }
                >
                    <option value="popularity.desc">인기순</option>
                    <option value="primary_release_date.desc">최신 개봉 순</option>
                </select>
            </section>

            {/* 결과 */}
            <section className="search-results">
                {isLoading && <p className="empty-text">검색 중...</p>}
                {!isLoading && results.length === 0 && (
                    <p className="empty-text">검색 결과가 없습니다.</p>
                )}

                <div className="result-grid">
                    {results.map((item) =>
                        isPerson(item) ? (
                            <div key={item.id} className="person-card">
                                {item.profile_path ? (
                                    <img
                                        src={getPosterUrl(item.profile_path, 'w185')}
                                        alt={item.name}
                                    />
                                ) : (
                                    <div className="img-placeholder">No Image</div>
                                )}
                                <p className="card-title">{item.name}</p>
                            </div>
                        ) : (
                            <div
                                key={item.id}
                                className="movie-card"
                                onClick={() => navigate(`/movie/${item.id}`)}
                            >
                                {item.poster_path ? (
                                    <img
                                        src={getPosterUrl(item.poster_path, 'w342')}
                                        alt={getTitle(item)}
                                    />
                                ) : (
                                    <div className="img-placeholder">No Image</div>
                                )}
                                <p className="card-title">{getTitle(item)}</p>
                            </div>
                        )
                    )}
                </div>
            </section>
        </main>
    );
};

export default Search;
