import { useState } from 'react';
import './Search.css';

const Search = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <main className="search-page">
            {/* 🔍 검색 영역 */}
            <section className="search-input-section">
                <input
                    className="search-input"
                    placeholder="영화, 배우, 장르를 검색해보세요"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {/* 🕘 최근 검색어 (UI only) */}
                {isFocused && (
                    <div className="recent-searches">
                        <button className="recent-chip">
                            아바타 <span className="remove">×</span>
                        </button>
                        <button className="recent-chip">
                            마블 <span className="remove">×</span>
                        </button>
                        <button className="recent-chip">
                            액션 <span className="remove">×</span>
                        </button>
                    </div>
                )}
            </section>

            {/* 🎛️ 필터 영역 */}
            <section className="filter-section">
                <p className="filter-title">선호하는 설정을 선택하세요</p>

                <div className="filters">
                    <select>
                        <option>장르 (전체)</option>
                    </select>

                    <select>
                        <option>평점 (전체)</option>
                    </select>

                    <select>
                        <option>언어 (전체)</option>
                    </select>

                    <button className="reset-button">초기화</button>
                </div>
            </section>

            {/* 📄 결과 영역 (아직 비어 있음) */}
            <section className="search-results">
                <p className="empty-text">검색 결과가 여기에 표시됩니다.</p>
            </section>
        </main>
    );
};

export default Search;
