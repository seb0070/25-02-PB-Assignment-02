import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { FaUserCircle } from 'react-icons/fa';
import './Header.css';

type AuthState = {
    isLoggedIn: boolean;
    userId: string;
};

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = storage.get<AuthState | null>(STORAGE_KEYS.AUTH, null);

    // 로그인 페이지에서는 헤더 숨김
    if (location.pathname === '/signin') return null;

    const handleLogout = () => {
        storage.set(STORAGE_KEYS.AUTH, null);
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="header__left">
                <NavLink to="/" className="logo">
                    NETFLIX
                </NavLink>

                <nav className="nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/search">Search</NavLink>
                    <NavLink to="/popular">Popular</NavLink>
                    <NavLink to="/wishlist">Wishlist</NavLink>
                </nav>
            </div>

            <div className="header__right">
                {auth?.isLoggedIn && (
                    <>
                        <FaUserCircle
                            size={22}
                            style={{ opacity: 0.85 }}
                            title="프로필"
                        />

                        <button
                            className="logoutBtn"
                            onClick={handleLogout}
                        >
                            로그아웃
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
