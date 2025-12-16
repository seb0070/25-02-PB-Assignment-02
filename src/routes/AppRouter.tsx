import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import Home from '../pages/Home';
import Popular from '../pages/Popular';
import Search from '../pages/Search';
import Wishlist from '../pages/Wishlist';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/signin" element={<SignIn />} />

            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/popular" element={<Popular />} />
                <Route path="/search" element={<Search />} />
                <Route path="/wishlist" element={<Wishlist />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;
