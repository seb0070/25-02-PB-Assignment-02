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

    // ✅ defaultValue 꼭 넣기
    const auth = storage.get<AuthState | null>(STORAGE_KEYS.AUTH, null);

    const handleLogout = () => {
        // ✅ remove가 없을 수 있으니 안전하게 처리
        storage.set(STORAGE_KEYS.AUTH, null);
        navigate('/signin');
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">NETFLIX DEMO</Link>
            </div>

            <nav className="nav">
                <Link to="/">Home</Link>
                <Link to="/popular">Popular</Link>
                <Link to="/search">Search</Link>
                <Link to="/wishlist">Wishlist</Link>
            </nav>

            <div className="auth">
                {auth?.isLoggedIn ? (
                    <>
                        <span className="user">{auth.userId}</span>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <Link to="/signin">로그인</Link>
                )}
            </div>
        </header>
    );
};

export default Header;

