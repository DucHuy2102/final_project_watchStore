import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Dashboard_Page, Order_Page, Profile_Page } from '../exportPage';
import { Mini_Navbar_Component, Sidebar_Component } from '../../components/exportComponent';
import ReviewModal_OrderCompleted from '../User/components/ReviewModal_OrderCompleted';

export default function Dashboard_DefaultPage() {
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <div className='md:w-auto sticky top-0 h-screen'>
                <Sidebar_Component />
            </div>

            <div className='flex-1 flex flex-col w-full'>
                <div className='sticky top-0 z-50'>
                    <Mini_Navbar_Component />
                </div>
                <main className='flex-1 p-4'>
                    {tab === 'dashboard' && <Dashboard_Page />}
                    {tab === 'profile' && <Profile_Page />}
                    {tab === 'order' && <Order_Page />}
                    {tab === 'review' && <ReviewModal_OrderCompleted />}
                </main>
            </div>
        </div>
    );
}
