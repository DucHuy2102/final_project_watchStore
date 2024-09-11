import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dashboard_Page, Order_Page, Profile_Page } from '../exportPage';
import { Sidebar_Component } from '../../components/exportComponent';

export default function DashboardUser() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            {/* sidebar */}
            <div className='md:w-56'>
                <Sidebar_Component />
            </div>

            {tab === 'dashboard' && <Dashboard_Page />}
            {tab === 'profile' && <Order_Page />}
            {tab === 'order' && <Profile_Page />}
        </div>
    );
}
