import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import { user_SignOut } from '../../services/redux/slices/userSlice';
import { Button, Modal } from 'flowbite-react';
import { HiChartPie, HiOutlineExclamationCircle, HiUser } from 'react-icons/hi';
import { FaShippingFast } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';
import { resetCheckout } from '../../services/redux/slices/checkoutSlice';
import { clearLikedProducts } from '../../services/redux/slices/productSlice';

const SidebarItem = ({ to, icon: Icon, active, showSidebar, children }) => {
    return (
        <div className='w-full px-2'>
            <Tooltip title={children} placement='right' className='w-full'>
                <Link
                    to={to}
                    className={`flex items-center justify-start w-full rounded-lg py-3 transition-all duration-300 
                     ${
                         active
                             ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-700 hover:from-indigo-700 hover:via-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg'
                             : 'hover:bg-gray-50/90 dark:hover:bg-gray-800/90 text-gray-700 dark:text-gray-300'
                     } 
                     ${showSidebar ? 'px-4' : 'px-2.5 justify-center'}`}
                >
                    <div className={`${active ? 'animate-pulse' : ''}`}>
                        {showSidebar ? <Icon size={20} /> : <Icon size={24} />}
                    </div>
                    {showSidebar && <span className='ml-3 font-medium tracking-wide text-[14px]'>{children}</span>}
                </Link>
            </Tooltip>
        </div>
    );
};

export default function Sidebar_Component() {
    // state
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const { user: currentUser } = useSelector((state) => state.user);
    const [showSidebar, setShowSidebar] = useState(true);

    // get tab from url
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    // sign out function
    const handleSignOutAccount = useCallback(async () => {
        dispatch(user_SignOut());
        dispatch(resetCheckout());
        dispatch(clearLikedProducts());
    }, [dispatch]);

    const toggleSidebar = useCallback(() => {
        setShowSidebar((prev) => !prev);
    }, []);

    return (
        <div
            className={`relative transition-all duration-300 ease-in-out min-h-screen 
            border-r border-gray-100 dark:border-gray-600 
            shadow-xl bg-white dark:bg-[#1f2937]
            ${showSidebar ? 'w-64' : 'w-20'}`}
        >
            <div
                className={`flex flex-col items-center justify-between min-h-screen ${
                    showSidebar ? 'p-4' : 'px-2 py-4'
                }`}
            >
                <div className='w-full flex flex-col items-center justify-between gap-y-6'>
                    <div className='flex items-center justify-center w-full mb-2'>
                        {showSidebar && (
                            <Link to='/' className='tracking-widest outline-none whitespace-nowrap text-2xl font-bold'>
                                <span className='bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 dark:from-gray-100 dark:via-white dark:to-gray-100'>
                                    Watc<span className='font-extrabold text-blue-600 dark:text-blue-500'>H</span>es
                                </span>
                            </Link>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className={`z-10 transition-all absolute duration-300 ease-in-out p-2 rounded-full 
                            bg-white/80 text-gray-700 hover:bg-blue-600 hover:text-white
                            dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-blue-600
                            backdrop-blur-lg shadow-lg border border-gray-100 dark:border-gray-700
                            ${showSidebar ? '-right-4 top-[50%]' : 'top-3'}`}
                        >
                            {showSidebar ? <SlArrowLeft size={18} /> : <SlArrowRight size={18} />}
                        </button>
                    </div>

                    <div className={`flex flex-col items-center justify-center ${!showSidebar && 'mt-4'}`}>
                        <div className='relative group'>
                            <div className='absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
                            <img
                                src={currentUser?.avatarImg ?? '/assets/default_Avatar.jpg'}
                                className={`relative rounded-full object-cover border-3 border-white dark:border-gray-800 shadow-2xl ${
                                    showSidebar ? 'w-28 h-28' : 'w-14 h-14'
                                }`}
                                alt='Avatar User'
                            />
                            <div
                                className={`absolute bottom-1 right-1 bg-emerald-500 rounded-full 
                                border-3 border-white dark:border-gray-800 shadow-md
                                ${showSidebar ? 'w-5 h-5' : 'w-3.5 h-3.5'}`}
                            />
                        </div>

                        {showSidebar && (
                            <div className='flex flex-col items-center space-y-2 mt-4'>
                                <h2 className='text-lg font-bold tracking-wide text-gray-800 dark:text-gray-100'>
                                    {currentUser.username}
                                </h2>
                                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                    {currentUser.email}
                                </p>
                            </div>
                        )}

                        <nav className='space-y-2 w-full mt-6'>
                            <SidebarItem
                                to='/dashboard?tab=dashboard'
                                icon={HiChartPie}
                                active={tab === 'dashboard'}
                                showSidebar={showSidebar}
                            >
                                Trang chủ
                            </SidebarItem>
                            <SidebarItem
                                to='/dashboard?tab=profile'
                                icon={HiUser}
                                active={tab === 'profile'}
                                showSidebar={showSidebar}
                            >
                                Trang cá nhân
                            </SidebarItem>

                            <SidebarItem
                                to='/dashboard?tab=order'
                                icon={FaShippingFast}
                                active={tab === 'order'}
                                showSidebar={showSidebar}
                            >
                                Đơn hàng của tôi
                            </SidebarItem>
                        </nav>
                    </div>
                </div>
                <div className='w-full px-2'>
                    <Tooltip title='Đăng xuất' placement='right' className='w-full'>
                        <button
                            onClick={() => setShowModal(true)}
                            className='w-full bg-gradient-to-r from-red-600 via-red-600 to-red-700 
                            hover:from-red-700 hover:via-red-700 hover:to-red-800 
                            rounded-lg py-3 text-white shadow-lg transition-all duration-300
                            border border-red-500/20'
                        >
                            <div
                                className={`flex items-center justify-center ${showSidebar ? 'px-4 gap-x-3' : 'px-2'}`}
                            >
                                <TbLogout2 size={showSidebar ? 20 : 24} />
                                {showSidebar && <span className='font-medium tracking-wide text-sm'>Đăng xuất</span>}
                            </div>
                        </button>
                    </Tooltip>
                </div>
            </div>

            <Modal className='backdrop-blur-md' show={showModal} onClose={() => setShowModal(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='text-yellow-400 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>Bạn có chắc chắn muốn đăng xuất?</span>
                        <div className='flex justify-between items-center mt-5'>
                            <Button className='focus:!ring-0' color='gray' onClick={() => setShowModal(false)}>
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='warning' onClick={handleSignOutAccount}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
