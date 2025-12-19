import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './Search.css';

// 🔑 최근 검색어 설정
const RECENT_SEARCH_KEY = 'recent_searches';
const MAX_RECENT = 5;

import { searchMulti, discoverMovies } from '../api/movies';

const Search = () => {
    /* =======================
       상태
    ======================= */
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem(RECENT_SEARCH_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    // 필터 상태 (아직 UI 전용 → 다음 단계에서 API 연결)
    const [filters, setFilters] = useState({
        genre: '',
        language: '',
        releasePeriod: '',
        rating: '',
        sort: 'popularity.desc',
    });

    /* =======================
       최근 검색어 로직
    ======================= */
    const saveRecentSearch = (value: string) => {
        if (!value.trim()) return;

        const updated = [
            value,
            ...recentSearches.filter((item) => item !== value),
        ].slice(0, MAX_RECENT);

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    const removeRecentSearch = (value: string) => {
        const updated = recentSearches.filter((item) => item !== value);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    /* =======================
       검색 분기 핵심 로직
    ======================= */
    //개봉시기 필터
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
            default:
                return undefined;
        }

        return today.toISOString().split('T')[0];
    };

    const executeSearch = async () => {
        const hasQuery = query.trim().length > 0;
        const hasFilter = Object.values(filters).some((v) => v);

        // 검색어만 → 멀티 검색
        if (hasQuery && !hasFilter) {
            saveRecentSearch(query);
            await searchMulti(query);
            return;
        }

        // 필터만 or 검색어 + 필터 → discover
        if (hasFilter) {
            if (hasQuery) {
                saveRecentSearch(query);
            }

            await discoverMovies({
                genre: filters.genre,
                language: filters.language,
                sort: filters.sort,
                voteGte: filters.rating ? Number(filters.rating) : undefined,
                releaseDateGte: getReleaseDate(filters.releasePeriod),
            });
        }
    };

    /* =======================
       JSX
    ======================= */
    return (
        <main className="search-page">
            {/* 🔍 검색 입력 */}
            <section className="search-input-section">
                <div className="search-input-wrapper">
                    <input
                        className="search-input"
                        value={query}
                        placeholder="영화, 배우, 장르를 검색해보세요"
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') executeSearch();
                        }}
                    />

                    {/* ❌ 검색어 초기화 */}
                    {query && (
                        <button
                            className="clear-button"
                            onClick={() => setQuery('')}
                            aria-label="검색어 삭제"
                        >
                            <FiX />
                        </button>
                    )}

                    {/* 🔍 검색 버튼 */}
                    <button
                        className="search-button"
                        onClick={executeSearch}
                        aria-label="검색"
                    >
                        <FiSearch />
                    </button>
                </div>

                {/* 🕘 최근 검색어 */}
                {isFocused && recentSearches.length > 0 && (
                    <div className="recent-searches">
                        {recentSearches.map((item) => (
                            <div key={item} className="recent-chip">
                                <button
                                    className="chip-text"
                                    onMouseDown={() => {
                                        setQuery(item);
                                        executeSearch();
                                    }}
                                >
                                    {item}
                                </button>
                                <button
                                    className="chip-remove"
                                    onMouseDown={(e) => {
                                        e.stopPropagation();
                                        removeRecentSearch(item);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 🎛️ 필터 영역 (UI 기준 확정) */}
            <section className="filter-section">
                <p className="filter-title">선호하는 설정을 선택하세요</p>

                <div className="filters">
                    <select onChange={(e) => setFilters({ ...filters, genre: e.target.value })}>
                        <option value="">장르 (전체)</option>
                        <option value="28">액션</option>
                        <option value="18">드라마</option>
                        <option value="35">코미디</option>
                        <option value="10749">로맨스</option>
                    </select>

                    <select
                        onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    >
                        <option value="">언어 (전체)</option>
                        <option value="ko">한국어</option>
                        <option value="en">영어</option>
                        <option value="ja">일본어</option>
                    </select>

                    <select
                        onChange={(e) =>
                            setFilters({ ...filters, releasePeriod: e.target.value })
                        }
                    >
                        <option value="">개봉 시기</option>
                        <option value="week">최근 1주</option>
                        <option value="month">최근 1개월</option>
                        <option value="year">최근 1년</option>
                    </select>

                    <select
                        onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                    >
                        <option value="">평점 (전체)</option>
                        <option value="7">7점 이상</option>
                        <option value="8">8점 이상</option>
                    </select>
                </div>

                <p className="filter-hint">
                    ※ 검색어 없이 필터만 선택해도 검색 버튼을 누르면 결과를 볼 수 있어요.
                </p>
            </section>

            {/* 🔃 정렬 */}
            <section className="sort-section">
                <span className="sort-label">정렬</span>
                <select
                    className="sort-select"
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                    <option value="popularity.desc">인기순</option>
                    <option value="primary_release_date.desc">최신 개봉 순</option>
                    <option value="vote_average.desc">평점 높은 순</option>
                </select>
            </section>

            {/* 📄 결과 영역 */}
            <section className="search-results">
                {/* 다음 단계: 결과 렌더링 */}
            </section>
        </main>
    );
};

export default Search;
