import { Link, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import './Header.css';

type AuthState = {
    isLoggedIn: boolean;
    userId: string;
};

const Header = () => {
    const navigate = useNavigate();
    const auth = storage.get<AuthState | null>(STORAGE_KEYS.AUTH, null);

    const handleLogout = () => {
        storage.set(STORAGE_KEYS.AUTH, null);
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="header__left">
                <Link to="/" className="logo">
                    NETFLIX DEMO
                </Link>

                <nav className="nav">
                    <Link to="/">Home</Link>
                    <Link to="/popular">Popular</Link>
                    <Link to="/wishlist">Wishlist</Link>
                </nav>
            </div>

            <div className="header__right">
                {/* 🔍 검색 아이콘만 */}
                <button
                    className="searchIcon"
                    aria-label="검색"
                    onClick={() => navigate('/search')}
                >
                    🔍
                </button>

                {auth?.isLoggedIn ? (
                    <>
                        <span className="user">{auth.userId}</span>
                        <button className="logoutBtn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link to="/signin" className="loginBtn">
                        로그인
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
