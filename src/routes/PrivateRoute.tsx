import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn } from '../utils/authState';

const PrivateRoute = () => {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;
