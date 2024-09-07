import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
            {/*
            {tab === 'dashboard' && <Dashboard_Component />}
            {tab === 'profile' && <Profile_Component />}
            {tab === 'posts' && <DashPosts_Component />}
            {tab === 'users' && <DashUsers_Component />}
            {tab === 'comments' && <DashComment_Component />}
            */}
        </div>
    );
}
