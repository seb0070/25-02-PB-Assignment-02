import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isLoggedIn = localStorage.getItem('auth') === 'true';
    return isLoggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
