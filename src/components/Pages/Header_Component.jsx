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
    const searchRef = useRef(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const { allProduct } = useSelector((state) => state.product);
    const showSuggestionsRef = useRef(null);

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
        setShowSuggestions(false);
        navigate(`/products?${newSearchTerm}`);
    };

    const getSearchSuggestions = () => {
        if (!searchTerm.trim()) return [];

        return allProduct
            .filter(
                (product) =>
                    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .slice(0, 5);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showSuggestionsRef.current && !showSuggestionsRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const shouldHideHeader =
        ['/login', '/register', '/forgot-password', '/verify-email', '/dashboard'].includes(pathname) ||
        pathname.startsWith('/reset-password');

    if (shouldHideHeader) {
        return null;
    }

    return (
        <Navbar
            className={`${
                shouldHideHeader ? 'hidden sm:hidden md:hidden lg:hidden' : 'block'
            } border-b border-gray-200 dark:border-gray-700 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 shadow-sm sticky top-0 z-50`}
        >
            {/* Logo */}
            <Link
                to='/'
                className='self-center tracking-wider outline-none whitespace-nowrap text-xl sm:text-2xl md:text-3xl font-bold hover:scale-105 transition-transform duration-300'
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

            {/* search */}
            <div className='relative'>
                <div className='hidden lg:block w-full max-w-sm' ref={showSuggestionsRef}>
                    <form onSubmit={handleSearch}>
                        <div className='relative w-[25vw]'>
                            <input
                                type='text'
                                placeholder='Tìm kiếm sản phẩm...'
                                className='w-full rounded-full p-5 py-2 border-gray-300 dark:bg-gray-900 dark:border-gray-700
                                 dark:text-white focus:outline-none focus:ring-1 focus:!border-[#0e7490]'
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowSuggestions(true);
                                }}
                            />
                            <AiOutlineSearch className='absolute text-lg right-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
                        </div>
                    </form>
                    {showSuggestions && searchTerm && (
                        <div className='absolute w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50'>
                            <h2 className='text-lg font-medium text-gray-800 dark:text-gray-200 px-5 py-2 border-b border-gray-100 dark:border-gray-700'>
                                Kết quả tìm kiếm
                            </h2>
                            {getSearchSuggestions().length !== 0 ? (
                                getSearchSuggestions().map((product) => (
                                    <div
                                        key={product.id}
                                        className='p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                                        onClick={() => {
                                            navigate(`/product-detail/${product.id}`);
                                            setShowSuggestions(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <div className='flex items-center gap-4 group'>
                                            <div className='w-20 h-20 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
                                                <img
                                                    src={product.img[0]}
                                                    alt={product.productName}
                                                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <p className='text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-2'>
                                                    {product.productName}
                                                </p>
                                                <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                                                    Thương hiệu: {product.brand}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='p-4 text-center text-gray-500 dark:text-gray-400'>
                                    Không tìm thấy sản phẩm phù hợp
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* buttons: theme and user */}
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
                        className='mt-[2px]'
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
                            <Dropdown.Item
                                onClick={() => navigate('/dashboard?tab=profile')}
                                className='flex justify-center `items-center hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-all duration-300'
                            >
                                <div className='font-medium py-1.5 px-3 w-full text-xs text-center text-gray-700 dark:text-gray-300'>
                                    Trang cá nhân
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => navigate('/dashboard?tab=order')}
                                className='flex justify-center items-center hover:bg-amber-50 dark:hover:bg-gray-800 rounded-md transition-all duration-300'
                            >
                                <div className='font-medium py-1.5 px-3 w-full text-xs text-center text-gray-700 dark:text-gray-300'>
                                    Đơn hàng
                                </div>
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

            {/* Navbar */}
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
