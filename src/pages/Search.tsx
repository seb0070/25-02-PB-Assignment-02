import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { searchMulti, discoverMovies } from '../api/movies';
import './Search.css';

const RECENT_SEARCH_KEY = 'recent_searches';
const MAX_RECENT = 5;

/* =====================
   옵션
===================== */
const GENRE_OPTIONS = [
    { value: '', label: '장르 (전체)' },
    { value: '28', label: '액션' },
    { value: '12', label: '어드벤처' },
    { value: '16', label: '애니메이션' },
    { value: '35', label: '코미디' },
    { value: '80', label: '범죄' },
    { value: '99', label: '다큐멘터리' },
    { value: '18', label: '드라마' },
    { value: '10751', label: '가족' },
    { value: '14', label: '판타지' },
    { value: '27', label: '공포' },
    { value: '9648', label: '미스터리' },
    { value: '10749', label: '로맨스' },
    { value: '878', label: 'SF' },
    { value: '53', label: '스릴러' },
];

const LANGUAGE_OPTIONS = [
    { value: '', label: '언어 (전체)' },
    { value: 'ko', label: '한국어' },
    { value: 'en', label: '영어' },
    { value: 'ja', label: '일본어' },
    { value: 'zh', label: '중국어' },
    { value: 'fr', label: '프랑스어' },
];

const RELEASE_OPTIONS = [
    { value: '', label: '개봉 시기 (전체)' },
    { value: 'week', label: '최근 1주' },
    { value: 'month', label: '최근 1개월' },
    { value: 'year', label: '최근 1년' },
    { value: 'fiveYears', label: '5년 이내' },
];

const RATING_OPTIONS = [
    { value: '', label: '평점 (전체)' },
    { value: '6', label: '6점 이상' },
    { value: '7', label: '7점 이상' },
    { value: '8', label: '8점 이상' },
    { value: '9', label: '9점 이상' },
];

/* =====================
   타입
===================== */
type MovieItem = {
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    media_type?: 'movie';
};

type PersonItem = {
    id: number;
    media_type: 'person';
    known_for?: MovieItem[];
};

type SearchResult = MovieItem | PersonItem;

/* =====================
   유틸
===================== */

// search/multi 결과 → 영화만 추출
const extractMovies = (results: SearchResult[]): MovieItem[] => {
    const movies: MovieItem[] = [];

    results.forEach((item) => {
        if (item.media_type === 'movie') {
            movies.push(item);
        }

        if (item.media_type === 'person' && item.known_for) {
            item.known_for.forEach((known) => {
                if (known.media_type === 'movie') {
                    movies.push(known);
                }
            });
        }
    });

    // 중복 제거
    return Array.from(new Map(movies.map((m) => [m.id, m])).values());
};

const getTitle = (item: MovieItem) => item.title ?? item.name ?? '';

/* =====================
   컴포넌트
===================== */
const Search = () => {
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem(RECENT_SEARCH_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const [filters, setFilters] = useState({
        genre: '',
        language: '',
        releasePeriod: '',
        rating: '',
        sort: 'popularity.desc',
    });

    const [results, setResults] = useState<MovieItem[]>([]);

    /* =====================
       최근 검색어
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

    /* =====================
       날짜 필터
    ===================== */
    const getReleaseDate = (period: string) => {
        if (!period) return undefined;
        const d = new Date();

        if (period === 'week') d.setDate(d.getDate() - 7);
        if (period === 'month') d.setMonth(d.getMonth() - 1);
        if (period === 'year') d.setFullYear(d.getFullYear() - 1);
        if (period === 'fiveYears') d.setFullYear(d.getFullYear() - 5);

        return d.toISOString().split('T')[0];
    };

    /* =====================
       🔥 검색 로직 (최종 안정)
    ===================== */
    const executeSearch = async (searchQuery = query) => {
        const hasQuery = !!searchQuery.trim();
        const hasRealFilter =
            !!filters.genre ||
            !!filters.language ||
            !!filters.releasePeriod ||
            !!filters.rating;

        setIsLoading(true);
        setResults([]);

        try {
            // 1️⃣ 검색어만
            if (hasQuery && !hasRealFilter) {
                saveRecentSearch(searchQuery);
                const res = await searchMulti(searchQuery);
                const movies = extractMovies(res.data?.results ?? []);
                setResults(movies);
                return;
            }

            // 2️⃣ 필터 있음 (검색어 있든 없든)
            if (hasRealFilter) {
                const res = await discoverMovies({
                    genre: filters.genre || undefined,
                    language: filters.language || undefined,
                    sort: filters.sort,
                    voteGte: filters.rating ? Number(filters.rating) : undefined,
                    releaseDateGte: getReleaseDate(filters.releasePeriod),
                    page: 1,
                });

                const discovered = res.data?.results ?? [];
                const finalResults = hasQuery
                    ? discovered.filter((m: MovieItem) =>
                        getTitle(m).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    : discovered;

                if (hasQuery) saveRecentSearch(searchQuery);
                setResults(finalResults);
                return;
            }

            // 3️⃣ 전체 + 인기순 (기본 상태)
            const res = await discoverMovies({
                sort: filters.sort,
                page: 1,
            });

            setResults(res.data?.results ?? []);
        } finally {
            setIsLoading(false);
        }
    };

    const getPosterUrl = (path?: string | null) =>
        path ? `https://image.tmdb.org/t/p/w342${path}` : '';

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
                        placeholder="영화, 감독, 배우를 검색해보세요"
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                    />

                    {query && (
                        <button className="clear-button" onClick={() => setQuery('')}>
                            <FiX />
                        </button>
                    )}

                    <button className="search-button" onClick={() => executeSearch()}>
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
                                        executeSearch(item);
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
                        {GENRE_OPTIONS.map((g) => (
                            <option key={g.value} value={g.value}>
                                {g.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.language}
                        onChange={(e) =>
                            setFilters({ ...filters, language: e.target.value })
                        }
                    >
                        {LANGUAGE_OPTIONS.map((l) => (
                            <option key={l.value} value={l.value}>
                                {l.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.releasePeriod}
                        onChange={(e) =>
                            setFilters({ ...filters, releasePeriod: e.target.value })
                        }
                    >
                        {RELEASE_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.rating}
                        onChange={(e) =>
                            setFilters({ ...filters, rating: e.target.value })
                        }
                    >
                        {RATING_OPTIONS.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
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
            </section>

            {/* 정렬 */}
            <section className="sort-section">
                <span>정렬</span>
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
                    {results.map((movie) => (
                        <div
                            key={movie.id}
                            className="movie-card"
                            onClick={() => navigate(`/movie/${movie.id}`)}
                        >
                            {movie.poster_path ? (
                                <img
                                    src={getPosterUrl(movie.poster_path)}
                                    alt={getTitle(movie)}
                                />
                            ) : (
                                <div className="img-placeholder">No Image</div>
                            )}
                            <p className="card-title">{getTitle(movie)}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Search;
