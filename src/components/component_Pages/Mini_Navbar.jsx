import { Button, Dropdown, Navbar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { IoIosCart, IoIosHome, IoIosSearch } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';
import { user_SignOut } from '../../redux/slices/userSlice';

export default function Mini_Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { tokenUser, currentUser } = useSelector((state) => ({
        tokenUser: state.user.access_token,
        currentUser: state.user.user,
    }));
    // const currentUser = useSelector((state) => state.user.user);
    const avatarUser = currentUser?.avatarImg ?? '../assets/default_Avatar.jpg';
    const theme = useSelector((state) => state.theme.theme);

    // state
    const [tab, setTab] = useState('');

    const NavButton = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className='flex items-center justify-center gap-x-1 text-gray-700 hover:text-[#0e7490]
        text-sm lg:text-md font-medium cursor-pointer'
        >
            <Icon size={16} />
            <span>{children}</span>
        </Link>
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
                <NavButton to='/cart' icon={IoIosCart}>
                    Giỏ hàng
                </NavButton>
                <NavButton to='/services' icon={MdHomeRepairService}>
                    Dịch vụ
                </NavButton>
            </div>

            <div className='flex gap-2 md:order-2'>
                <Button onClick={() => dispatch(toggleTheme())} color={theme === 'light' ? 'light' : 'dark'} pill>
                    {theme === 'light' ? (
                        <FaSun size={14} className='text-yellow-400 mt-[2px]' />
                    ) : (
                        <FaMoon size={14} className='text-blue-400 mt-[2px]' />
                    )}
                </Button>
                {tokenUser ? (
                    <Dropdown
                        className='mt-[1px]'
                        inline
                        arrowIcon={false}
                        label={
                            <div className='w-10 h-10'>
                                <img
                                    src={avatarUser}
                                    alt='Avatar_User'
                                    className='object-cover w-full h-full rounded-full'
                                />
                            </div>
                        }
                    >
                        <Dropdown.Header className='cursor-pointer'>
                            <span
                                className={`block text-center text-sm font-medium truncate ${
                                    currentUser.admin ? 'text-orange-500' : 'text-blue-500'
                                }`}
                            >
                                {currentUser?.username}
                            </span>
                        </Dropdown.Header>
                        <Dropdown.Item className='flex justify-center items-center'>
                            <Link to={'/dashboard?tab=dashboard'} className='font-medium'>
                                Trang cá nhân
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Item className='flex justify-center items-center'>
                            <Link to={'/dashboard?tab=orders'} className='font-medium'>
                                Giỏ hàng
                            </Link>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            className='flex justify-center items-center font-semibold text-red-500'
                            onClick={handleSignOutAccount}
                        >
                            Đăng xuất
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/login' className='ml-2'>
                        <Button pill outline>
                            Đăng nhập
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>
        </Navbar>
    );
}
