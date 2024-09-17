import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export default function AdminRoute() {
    const currentUser = useSelector((state) => state.user.user);

    return currentUser?.admin ? <Outlet /> : <Navigate to='/sign-in' />;
}
