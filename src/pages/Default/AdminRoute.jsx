import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
    const { access_token, user } = useSelector((state) => state.user);
    return access_token && user?.admin ? <Outlet /> : <Navigate to='/admin/login' />;
}
