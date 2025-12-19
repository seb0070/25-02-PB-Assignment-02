import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import SignIn from '../pages/SignIn';
import Home from '../pages/Home';
import Popular from '../pages/Popular';
import Search from '../pages/Search';
import Wishlist from '../pages/Wishlist';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => (
    // ✅ Vite base(/25-02-PB-Assignment-02/)와 맞추기 위해 basename도 끝에 '/' 포함
    <BrowserRouter basename="/25-02-PB-Assignment-02/">
        <Header />
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
