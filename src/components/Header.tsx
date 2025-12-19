import { NavLink, useNavigate } from 'react-router-dom';
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
                <NavLink to="/" className="logo">
                    NETFLIX DEMO
                </NavLink>

                <nav className="nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/search">Search</NavLink>
                    <NavLink to="/popular">Popular</NavLink>
                    <NavLink to="/wishlist">Wishlist</NavLink>
                </nav>
            </div>

            <div className="header__right">
                {auth?.isLoggedIn ? (
                    <>
                        <span className="user">{auth.userId}</span>
                        <button className="logoutBtn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <NavLink to="/signin" className="loginBtn">
                        로그인
                    </NavLink>
                )}
            </div>
        </header>
    );
};

export default Header;
