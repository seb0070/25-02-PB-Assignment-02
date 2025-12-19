import { useState } from 'react';
import './Search.css';
import { FiSearch, FiX } from 'react-icons/fi';

const RECENT_SEARCH_KEY = 'recent_searches';
const MAX_RECENT = 5;

const Search = () => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const [recentSearches, setRecentSearches] = useState<string[]>(() => {
        const saved = localStorage.getItem(RECENT_SEARCH_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    /* 최근 검색어 저장 */
    const saveRecentSearch = (value: string) => {
        if (!value.trim()) return;

        const updated = [
            value,
            ...recentSearches.filter((item) => item !== value),
        ].slice(0, MAX_RECENT);

        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

    /* 검색 실행 */
    const executeSearch = (value: string) => {
        if (value.trim()) {
            saveRecentSearch(value);
        }
        setIsFocused(false);

        // 🔜 다음 단계에서:
        // - 검색어만 있으면 searchMulti
        // - 필터만 / 검색어+필터면 discover
    };

    /* 최근 검색어 삭제 */
    const removeRecentSearch = (value: string) => {
        const updated = recentSearches.filter((item) => item !== value);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(updated));
    };

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
                            if (e.key === 'Enter') {
                                executeSearch(query);
                            }
                        }}
                    />

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
                        onClick={() => executeSearch(query)}
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
                                        executeSearch(item);
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

            {/* 🎛️ 필터 영역 */}
            <section className="filter-section">
                <p className="filter-title">선호하는 설정을 선택하세요</p>

                <div className="filters">
                    <select>
                        <option>장르 (전체)</option>
                        <option>액션</option>
                        <option>드라마</option>
                        <option>코미디</option>
                        <option>로맨스</option>
                        <option>스릴러</option>
                        <option>SF</option>
                        <option>애니메이션</option>
                        <option>공포</option>
                        <option>다큐멘터리</option>
                    </select>

                    <select>
                        <option>언어 (전체)</option>
                        <option>한국어</option>
                        <option>영어</option>
                        <option>일본어</option>
                        <option>중국어</option>
                        <option>프랑스어</option>
                        <option>기타</option>
                    </select>

                    <select>
                        <option>개봉 시기</option>
                        <option>최근 1주</option>
                        <option>최근 1개월</option>
                        <option>최근 1년</option>
                        <option>5년 이내</option>
                    </select>

                    <select>
                        <option>평점 (전체)</option>
                        <option>7점 이상</option>
                        <option>8점 이상</option>
                    </select>

                    <button className="reset-button">초기화</button>
                </div>

                <p className="filter-hint">
                    ※ 검색어 없이 필터만 선택해도 검색 버튼을 누르면 결과를 볼 수
                    있어요.
                </p>
            </section>

            {/* 🔃 정렬 */}
            <section className="sort-section">
                <span className="sort-label">정렬</span>
                <select className="sort-select">
                    <option>인기순</option>
                    <option>최신 개봉 순</option>
                    <option>평점 높은 순</option>
                </select>
            </section>

            {/* 📄 결과 영역 */}
            <section className="search-results">
                <p className="empty-text">검색 결과가 여기에 표시됩니다.</p>
            </section>
        </main>
    );
};

export default Search;
