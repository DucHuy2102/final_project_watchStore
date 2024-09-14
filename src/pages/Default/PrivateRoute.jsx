import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
    const tokenUser = useSelector((state) => state.user.access_token);

    return tokenUser ? <Outlet /> : <Navigate to='/login' />;
}
