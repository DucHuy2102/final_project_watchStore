import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Dashboard_Page,
    ManageOrders_Page,
    ManageProducts_Page,
    ManageUsers_Page,
    ManageVouchers_Page,
    Order_Page,
    Profile_Page,
} from '../exportPage';
import { Mini_Navbar_Component, Sidebar_Component } from '../../components/exportComponent';

export default function Dashboard_DefaultPage() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <div className="md:w-auto h-full">
                <Sidebar_Component />
            </div>

            <div className="flex-1 flex flex-col w-full overflow-hidden">
                <Mini_Navbar_Component />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                    {tab === 'dashboard' && <Dashboard_Page />}
                    {tab === 'profile' && <Profile_Page />}
                    {tab === 'order' && <Order_Page />}
                    {tab === 'products' && <ManageProducts_Page />}
                    {tab === 'users' && <ManageUsers_Page />}
                    {tab === 'orders' && <ManageOrders_Page />}
                    {tab === 'vouchers' && <ManageVouchers_Page />}
                </main>
            </div>
        </div>
    );
}
