import { useState } from 'react';
import './Search.css';

const Search = () => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <main className="search-page">
            {/* 🔍 검색 입력 영역 */}
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
                    {/* 장르 */}
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

                    {/* 국가 / 언어 */}
                    <select>
                        <option>언어 (전체)</option>
                        <option>한국어</option>
                        <option>영어</option>
                        <option>일본어</option>
                        <option>중국어</option>
                        <option>프랑스어</option>
                        <option>기타</option>
                    </select>

                    {/* 개봉 시기 */}
                    <select>
                        <option>개봉 시기</option>
                        <option>최근 1주</option>
                        <option>최근 1개월</option>
                        <option>최근 1년</option>
                        <option>5년 이내</option>
                    </select>

                    {/* 평점 */}
                    <select>
                        <option>평점 (전체)</option>
                        <option>7점 이상</option>
                        <option>8점 이상</option>
                    </select>

                    <button className="reset-button">초기화</button>
                </div>
            </section>

            {/* 🔃 정렬 영역 */}
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
