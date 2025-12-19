import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './SearchBar.css';

type Props = {
    initialValue?: string;
    placeholder?: string;
    onSubmit: (query: string) => void;
};

const SearchBar = ({ initialValue = '', placeholder = '검색', onSubmit }: Props) => {
    const [value, setValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (initialValue !== value) {
            setValue(initialValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValue]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const q = value.trim();
        if (!q) return;
        onSubmit(q);
        // 모바일에서는 검색 후 자동으로 접기
        setOpen(false);
    };

    const toggleOpen = () => {
        setOpen((v) => !v);
        // 다음 tick에 포커스
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    return (
        <div className={`sb ${open ? 'sb--open' : ''}`}>
            {/* 모바일용: 아이콘 버튼 */}
            <button type="button" className="sb__iconBtn" aria-label="검색" onClick={toggleOpen}>
                🔍
            </button>

            {/* 데스크탑/열림 상태: 폼 */}
            <form className="sb__form" onSubmit={handleSubmit} role="search" aria-label="검색">
                <input
                    ref={inputRef}
                    className="sb__input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    aria-label="검색어 입력"
                />
                <button type="submit" className="sb__submitBtn">
                    검색
                </button>
            </form>

            {/* 열려있을 때 바깥 클릭/닫기 버튼 */}
            {open && (
                <button
                    type="button"
                    className="sb__backdrop"
                    aria-label="검색 닫기"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
};

export default SearchBar;
