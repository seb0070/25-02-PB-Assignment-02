import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import './SearchBar.css';

type Props = {
    initialValue?: string;
    onSubmit: (query: string) => void;
    placeholder?: string;
};

const SearchBar = ({ initialValue = '', onSubmit, placeholder = '검색' }: Props) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(value.trim());
    };

    return (
        <form className="searchbar" onSubmit={handleSubmit} role="search" aria-label="검색">
            <button
                type="button"
                className="searchbar__iconBtn"
                aria-label="검색창 포커스"
                onClick={() => inputRef.current?.focus()}
            >
                🔍
            </button>

            <input
                ref={inputRef}
                className="searchbar__input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                aria-label="검색어 입력"
            />

            <button type="submit" className="searchbar__submitBtn">
                검색
            </button>
        </form>
    );
};

export default SearchBar;
