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

    /* =======================
       상태
    ======================= */
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

    /* =======================
       최근 검색어
    ======================= */
    const saveRecentSearch = (value: string) => {
        const v = value.trim();
        if (!v) return;

        const updated = [v, ...recentSearches.filter((item) => item !== v)].slice(
            0,
            MAX_RECENT
        );

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    const removeRecentSearch = (value: string) => {
        const updated = recentSearches.filter((item) => item !== value);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    /* =======================
       개봉 시기 변환
    ======================= */
    const getReleaseDate = (period: string) => {
        if (!period) return undefined;

        const today = new Date();
        switch (period) {
            case 'week':
                today.setDate(today.getDate() - 7);
                break;
            case 'month':
                today.setMonth(today.getMonth() - 1);
                break;
            case 'year':
                today.setFullYear(today.getFullYear() - 1);
                break;
            case 'fiveYears':
                today.setFullYear(today.getFullYear() - 5);
                break;
            default:
                return undefined;
        }
        return today.toISOString().split('T')[0];
    };

    const hasAnyFilter = () =>
        Boolean(
            filters.genre ||
            filters.language ||
            filters.releasePeriod ||
            filters.rating
        );

    /* =======================
       검색 실행
    ======================= */
    const executeSearch = async () => {
        const hasQuery = query.trim().length > 0;
        const hasFilter = hasAnyFilter();

        setIsLoading(true);
        setResults([]);

        try {
            // ✅ 검색어만 → searchMulti
            if (hasQuery && !hasFilter) {
                saveRecentSearch(query);
                const res = await searchMulti(query);
                setResults((res.data?.results ?? []) as ResultItem[]);
                return;
            }

            // ✅ 필터만 / 검색어 + 필터 → discover
            if (hasFilter) {
                if (hasQuery) saveRecentSearch(query);

                const res = await discoverMovies({
                    genre: filters.genre || undefined,
                    language: filters.language || undefined,
                    sort: filters.sort, // 정렬만 여기서 사용
                    voteGte: filters.rating ? Number(filters.rating) : undefined,
                    releaseDateGte: getReleaseDate(filters.releasePeriod),
                    page: 1,
                });

                setResults((res.data?.results ?? []) as ResultItem[]);
                return;
            }

            // ❗ 아무것도 없으면 결과 비움
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const executeSearchWithQuery = async (searchQuery: string) => {
        const hasFilter = hasAnyFilter();

        setIsLoading(true);
        setResults([]);

        try {
            // 🔍 검색어만
            if (searchQuery && !hasFilter) {
                saveRecentSearch(searchQuery);
                const res = await searchMulti(searchQuery);
                setResults((res.data?.results ?? []) as ResultItem[]);
                return;
            }

            // 🎛️ 필터만 / 검색어 + 필터
            if (hasFilter) {
                saveRecentSearch(searchQuery);

                const res = await discoverMovies({
                    genre: filters.genre || undefined,
                    language: filters.language || undefined,
                    sort: filters.sort,
                    voteGte: filters.rating ? Number(filters.rating) : undefined,
                    releaseDateGte: getReleaseDate(filters.releasePeriod),
                    page: 1,
                });

                setResults((res.data?.results ?? []) as ResultItem[]);
            }
        } finally {
            setIsLoading(false);
        }
    };


    const getPosterUrl = (path: string | null, size: 'w185' | 'w342') =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : '';

    /* =======================
       JSX
    ======================= */
    return (
        <main className="search-page">
            {/* 🔍 검색바 */}
            <section className="search-input-section">
                <div className="search-input-wrapper">
                    <input
                        className="search-input"
                        value={query}
                        placeholder="영화, 배우, 장르를 검색해보세요"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') void executeSearch();
                        }}
                    />

                    {query && (
                        <button
                            className="clear-button"
                            type="button"
                            onClick={() => setQuery('')}
                        >
                            <FiX />
                        </button>
                    )}

                    <button
                        className="search-button"
                        type="button"
                        onClick={() => void executeSearch()}
                    >
                        <FiSearch />
                    </button>
                </div>

                {/* 🕘 최근 검색어 (항상 노출) */}
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
                                    type="button"
                                    onClick={() => removeRecentSearch(item)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 🎛️ 필터 */}
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
                        <option value="28">액션</option>
                        <option value="18">드라마</option>
                        <option value="35">코미디</option>
                        <option value="10749">로맨스</option>
                        <option value="53">스릴러</option>
                        <option value="878">SF</option>
                        <option value="16">애니메이션</option>
                        <option value="27">공포</option>
                        <option value="99">다큐멘터리</option>
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
                        <option value="ja">일본어</option>
                        <option value="zh">중국어</option>
                        <option value="fr">프랑스어</option>
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
                        type="button"
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
                    ※ 검색어 없이 필터만 선택해도 검색 버튼을 누르면 결과를 볼 수
                    있어요.
                </p>
            </section>

            {/* 🔃 정렬 */}
            <section className="sort-section">
                <span className="sort-label">정렬</span>
                <select
                    className="sort-select"
                    value={filters.sort}
                    onChange={(e) =>
                        setFilters({ ...filters, sort: e.target.value })
                    }
                >
                    <option value="popularity.desc">인기순</option>
                    <option value="primary_release_date.desc">최신 개봉 순</option>
                    <option value="vote_average.desc">평점 높은 순</option>
                </select>
            </section>

            {/* 📄 검색 결과 */}
            <section className="search-results">
                {isLoading && <p className="empty-text">검색 중...</p>}

                {!isLoading && results.length === 0 && (
                    <p className="empty-text">검색 결과가 없습니다.</p>
                )}

                <div className="result-grid">
                    {results.map((item) => {
                        if (isPerson(item)) {
                            const knownFor =
                                item.known_for
                                    ?.map((k) => getTitle(k))
                                    .filter(Boolean)
                                    .slice(0, 2) ?? [];

                            return (
                                <div key={`person-${item.id}`} className="person-card">
                                    {item.profile_path ? (
                                        <img
                                            src={getPosterUrl(item.profile_path, 'w185')}
                                            alt={item.name}
                                        />
                                    ) : (
                                        <div className="img-placeholder">No Image</div>
                                    )}
                                    <p className="card-title">{item.name}</p>
                                    {knownFor.length > 0 && (
                                        <p className="known-for">
                                            대표작: {knownFor.join(', ')}
                                        </p>
                                    )}
                                </div>
                            );
                        }

                        const title = getTitle(item);
                        return (
                            <div
                                key={`media-${item.id}`}
                                className="movie-card"
                                onClick={() => navigate(`/movie/${item.id}`)}
                            >
                                {item.poster_path ? (
                                    <img
                                        src={getPosterUrl(item.poster_path, 'w342')}
                                        alt={title}
                                    />
                                ) : (
                                    <div className="img-placeholder">No Image</div>
                                )}
                                <p className="card-title">{title}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
};

export default Search;
