import { Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../services/redux/slices/themeSlice';
import { IoIosCart, IoIosHome } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';
import { Badge } from 'antd';
import { user_SignOut } from '../../services/redux/slices/userSlice';
import { useEffect, useRef, useState } from 'react';
import { resetCart } from '../../services/redux/slices/cartSlice';
import { resetCheckout } from '../../services/redux/slices/checkoutSlice';

export default function Header_Component() {
    const { theme } = useSelector((state) => state.theme);
    const { access_token: tokenUser, user: currentUser } = useSelector((state) => state.user);
    const avatarUser = currentUser?.avatarImg ?? '../assets/default_Avatar.jpg';
    const { cartItem: cartInRedux } = useSelector((state) => state.cart);
    const cartTotalQuantity = cartInRedux.length;
    const { pathname, search } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);

    // handle sign out account
    const handleSignOutAccount = () => {
        dispatch(user_SignOut());
        dispatch(resetCart());
        dispatch(resetCheckout());
    };

    // ========================================= Search =========================================
    // get search term from url params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchURL = urlParams.get('q');
        setSearchTerm(searchURL ?? '');
    }, [search]);

    // handle submit search form
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') {
            return;
        }
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('q', searchTerm);
        const newSearchTerm = urlParams.toString();
        navigate(`/products?${newSearchTerm}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowMobileSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Navbar
            className={`${
                pathname === '/login' ||
                pathname === '/register' ||
                pathname === '/forgot-password' ||
                pathname === '/verify-email' ||
                pathname === '/dashboard' ||
                pathname.startsWith('/admin')
                    ? 'hidden sm:hidden md:hidden lg:hidden'
                    : 'block'
            } border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-sm relative z-[9999]`}
        >
            <Link
                to='/'
                className='self-center tracking-wider outline-none whitespace-nowrap text-2xl sm:text-3xl font-bold hover:scale-105 transition-transform duration-300'
            >
                <span
                    className='bg-clip-text text-transparent bg-gradient-to-r animate-gradient-x
                from-amber-600 via-amber-800 to-amber-600 dark:from-blue-400 dark:via-blue-600 dark:to-blue-400
                hover:from-amber-500 hover:via-amber-700 hover:to-amber-500
                dark:hover:from-blue-300 dark:hover:via-blue-500 dark:hover:to-blue-300
                drop-shadow-lg relative'
                >
                    <span className='font-playfair'>Watc</span>
                    <span className='font-extrabold text-amber-500 dark:text-blue-500 animate-bounce-slow relative inline-block'>
                        H
                    </span>
                    <span className='font-playfair'>es</span>
                    <span className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine'></span>
                </span>
            </Link>

            <form onSubmit={handleSearch}>
                <TextInput
                    type='text'
                    placeholder='Tìm kiếm...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline-block lg:w-96 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300'
                    value={searchTerm ?? ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <div className='md:hidden ml-14'>
                <Button
                    className='rounded-full w-10 focus:!ring-0'
                    onClick={() => {
                        setShowMobileSearch(!showMobileSearch);
                    }}
                >
                    <AiOutlineSearch size={20} />
                </Button>
            </div>
            {showMobileSearch && (
                <form ref={searchRef} onSubmit={handleSearch} className='w-full mt-2'>
                    <TextInput
                        type='text'
                        placeholder='Tìm kiếm...'
                        rightIcon={AiOutlineSearch}
                        className='w-full'
                        value={searchTerm ?? ''}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </form>
            )}

            {!showMobileSearch && (
                <div className='flex gap-x-4 md:order-2'>
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
                            className='mt-[2px] relative z-[9999]'
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
                                        Đơn hàng
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
            )}

            <Navbar.Collapse className='md:inline-block'>
                <Navbar.Link
                    active={pathname === '/'}
                    to={'/'}
                    as={Link}
                    className='hover:!text-amber-500 dark:hover:!text-blue-500 transition-colors duration-300 cursor-pointer flex justify-start items-center gap-x-2 md:gap-x-1'
                >
                    <IoIosHome size={'20px'} />
                    Trang chủ
                </Navbar.Link>
                <Navbar.Link
                    active={pathname === '/products'}
                    to={'/products'}
                    as={Link}
                    className='hover:!text-amber-500 dark:hover:!text-blue-500 transition-colors duration-300 cursor-pointer flex justify-start items-center gap-x-2 md:gap-x-1'
                >
                    <MdWatch size={'20px'} />
                    Sản phẩm
                </Navbar.Link>
                <Navbar.Link
                    active={pathname === '/cart'}
                    to={'/cart'}
                    as={Link}
                    className={`group cursor-pointer flex justify-start items-center gap-x-2 md:gap-x-1 hover:!text-amber-500 dark:hover:!text-blue-500 transition-colors duration-300 ${
                        pathname === '/cart' ? '!text-[#0e7490] dark:!text-white' : ''
                    }`}
                >
                    <Badge count={tokenUser ? cartTotalQuantity : 0}>
                        <IoIosCart
                            className={`group-hover:text-amber-500 dark:group-hover:text-blue-500 transition-colors duration-300 ${
                                pathname === '/cart'
                                    ? 'text-[#0e7490] dark:text-white'
                                    : 'text-gray-700 dark:text-gray-400'
                            }`}
                            size={'20px'}
                        />
                    </Badge>
                    Giỏ hàng
                </Navbar.Link>
                <Navbar.Link
                    active={pathname === '/services'}
                    to={'/services'}
                    as={Link}
                    className='hover:!text-amber-500 dark:hover:!text-blue-500 transition-colors duration-300 cursor-pointer flex justify-start items-center gap-x-2 md:gap-x-1'
                >
                    <MdHomeRepairService size={'20px'} />
                    Dịch vụ
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
