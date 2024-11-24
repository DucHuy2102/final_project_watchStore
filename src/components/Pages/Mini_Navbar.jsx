import { Button, Dropdown, Navbar } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../services/redux/slices/themeSlice';
import { IoIosCart, IoIosHome, IoIosSearch } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';
import { user_SignOut } from '../../services/redux/slices/userSlice';
import { Badge } from 'antd';

export default function Mini_Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { access_token: tokenUser, user: currentUser } = useSelector((state) => state.user);
    const { cartTotalQuantity } = useSelector((state) => state.cart);
    const avatarUser = currentUser?.avatarImg ?? '../assets/default_Avatar.jpg';
    const { theme } = useSelector((state) => state.theme);
    const [tab, setTab] = useState('');

    const NavButton = useCallback(
        ({ to, icon: Icon, children, showBadge, badgeCount }) => (
            <Link
                to={to}
                className='flex items-center justify-center gap-x-1 text-gray-700 hover:text-[#0e7490]
                dark:text-gray-300 dark:hover:text-blue-500
            text-sm lg:text-md font-medium cursor-pointer group'
            >
                {showBadge ? (
                    <Badge count={badgeCount} size='small'>
                        <Icon
                            size={18}
                            className='group-hover:text-[#0e7490] dark:text-gray-300 dark:group-hover:text-blue-500'
                        />
                    </Badge>
                ) : (
                    <Icon
                        size={16}
                        className='group-hover:text-[#0e7490] dark:text-gray-300 dark:group-hover:text-blue-500'
                    />
                )}
                <span>{children}</span>
            </Link>
        ),
        [],
    );

    // get tab from url
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    // handle search
    const handleSearch = (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value;
        if (searchTerm.trim() === '') {
            return;
        }
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('q', searchTerm);
        const newSearchTerm = urlParams.toString();
        navigate(`/products?${newSearchTerm}`);
    };

    const handleSignOutAccount = () => {
        dispatch(user_SignOut());
    };

    return (
        <Navbar
            className='flex flex-wrap items-center justify-between gap-4 py-2
        border-b border-gray-200 dark:border-gray-500'
        >
            <form onSubmit={handleSearch} className='flex-grow max-w-md'>
                <div className='relative'>
                    <input
                        type='search'
                        className='w-full pl-10 pr-4 py-2 rounded-full text-sm border-none
                    bg-gray-100 text-gray-900 focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600'
                        placeholder='Tìm kiếm nhanh...'
                    />
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <IoIosSearch className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'} size={18} />
                    </div>
                </div>
            </form>

            <div className='flex items-center gap-x-10'>
                <NavButton to='/' icon={IoIosHome}>
                    Trang chủ
                </NavButton>
                <NavButton to='/products' icon={MdWatch}>
                    Sản phẩm
                </NavButton>
                <NavButton to='/cart' icon={IoIosCart} showBadge={true} badgeCount={cartTotalQuantity}>
                    Giỏ hàng
                </NavButton>
                <NavButton to='/services' icon={MdHomeRepairService}>
                    Dịch vụ
                </NavButton>
            </div>

            <div className='flex gap-2 md:order-2'>
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    color={theme === 'light' ? 'light' : 'dark'}
                    pill
                    className='focus:!ring-0 hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden 
    hover:shadow-md dark:hover:shadow-blue-500/30 hover:shadow-amber-500/30 
    group bg-gradient-to-br from-amber-100 to-amber-50 dark:from-blue-900 dark:to-blue-950'
                >
                    <div
                        className='absolute inset-0 bg-gradient-to-br from-amber-200 to-amber-100 dark:from-blue-800 dark:to-blue-900 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                    />
                    {theme === 'light' ? (
                        <FaSun
                            size={16}
                            className='text-amber-500 mt-[3px] relative z-10 animate-spin-slow 
            group-hover:animate-pulse group-hover:text-amber-600 transition-colors duration-300'
                        />
                    ) : (
                        <FaMoon
                            size={16}
                            className='text-blue-500 mt-[3px] relative z-10 animate-bounce-slow 
            group-hover:animate-pulse group-hover:text-blue-400 transition-colors duration-300'
                        />
                    )}
                </Button>
                {tokenUser ? (
                    <Dropdown
                        className='mt-[1px] relative z-[9999]'
                        inline
                        arrowIcon={false}
                        label={
                            <div className='w-10 h-10 ring-1 ring-gray-200 dark:ring-gray-700 rounded-full hover:ring-amber-500 dark:hover:ring-blue-500 transition-all duration-300 hover:scale-105'>
                                <img
                                    src={avatarUser}
                                    alt='Avatar_User'
                                    className='object-cover w-full h-full rounded-full shadow-sm'
                                />
                            </div>
                        }
                    >
                        <Dropdown.Header className='cursor-pointer bg-gradient-to-r from-amber-50 to-amber-100 dark:from-gray-800 dark:to-gray-900 p-2'>
                            <Link
                                to={'/dashboard?tab=dashboard'}
                                className='block text-center text-xs font-semibold tracking-wide text-amber-800 dark:text-blue-400 hover:text-amber-600 dark:hover:text-blue-300 transition-colors duration-300'
                            >
                                {currentUser?.username}
                            </Link>
                        </Dropdown.Header>
                        <div className='p-1 bg-white dark:bg-gray-900'>
                            <Dropdown.Item className='flex justify-center `items-center hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-all duration-300'>
                                <Link
                                    to={'/dashboard?tab=profile'}
                                    className='font-medium py-1.5 px-3 w-full text-xs text-center text-gray-700 dark:text-gray-300'
                                >
                                    Trang cá nhân
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item className='flex justify-center items-center hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-all duration-300'>
                                <Link
                                    to={'/dashboard?tab=order'}
                                    className='font-medium py-1.5 px-3 w-full text-xs text-center text-gray-700 dark:text-gray-300'
                                >
                                    Đơn hàng của tôi
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Divider className='my-1 border-amber-200/50 dark:border-gray-700' />
                            <Dropdown.Item
                                className='flex justify-center items-center hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-300'
                                onClick={handleSignOutAccount}
                            >
                                <span className='font-medium py-1.5 px-3 w-full text-xs text-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300'>
                                    Đăng xuất
                                </span>
                            </Dropdown.Item>
                        </div>
                    </Dropdown>
                ) : (
                    <Link to='/login' className='ml-2'>
                        <Button pill outline className='focus:!ring-0'>
                            Đăng nhập
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
        </Navbar>
    );
}
