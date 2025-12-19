import { Link, useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import SearchBar from './SearchBar';
import './Header.css';

type AuthState = {
    isLoggedIn: boolean;
    userId: string;
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const auth = storage.get<AuthState | null>(STORAGE_KEYS.AUTH, null);

    const handleLogout = () => {
        storage.set(STORAGE_KEYS.AUTH, null);
        navigate('/signin');
    };

    const handleSearchSubmit = (q: string) => {
        if (!q) return;

        const target = `/search?q=${encodeURIComponent(q)}`;

        if (location.pathname.startsWith('/search')) {
            navigate(target, { replace: true });
        } else {
            navigate(target);
        }
    };

    return (
        <header className="header">
            <div className="header__left">
                <div className="logo">
                    <Link to="/">NETFLIX DEMO</Link>
                </div>

                <nav className="nav" aria-label="주요 메뉴">
                    <Link to="/">Home</Link>
                    <Link to="/popular">Popular</Link>
                    <Link to="/wishlist">Wishlist</Link>
                </nav>
            </div>

            <div className="header__right">
                <SearchBar onSubmit={handleSearchSubmit} placeholder="제목, 배우, 장르 검색" />

                <div className="auth">
                    {auth?.isLoggedIn ? (
                        <>
                            <span className="user">{auth.userId}</span>
                            <button className="auth__btn" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link className="auth__link" to="/signin">
                            로그인
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
