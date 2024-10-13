import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { IoIosCart, IoIosHome } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';
import { Badge } from 'antd';
import { user_SignOut } from '../../redux/slices/userSlice';
import { useEffect, useRef, useState } from 'react';
import { resetCart } from '../../redux/slices/cartSlice';

export default function Header_Component() {
    // states
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const pathURL = location.pathname;
    const theme = useSelector((state) => state.theme.theme);
    const tokenUser = useSelector(
        (state) => state.user.access_token || state.user.user?.access_token
    );
    const currentUser = useSelector((state) => state.user.user);
    const avatarUser = currentUser?.avatarImg || '../assets/default_Avatar.jpg';
    const cartInRedux = useSelector((state) => state.cart.cartItem);
    const cartTotalQuantity = cartInRedux.length;
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const searchRef = useRef(null);

    // handle sign out account
    const handleSignOutAccount = () => {
        dispatch(user_SignOut());
        dispatch(resetCart());
    };

    // ========================================= Search =========================================
    // get search term from url params
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchURL = urlParams.get('q');
        setSearchTerm(searchURL ?? '');
    }, [location.search]);

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
                pathname === '/dashboard'
                    ? 'hidden sm:hidden md:hidden lg:hidden'
                    : 'block'
            } border-b border-gray-200 dark:border-gray-700`}
        >
            <Link
                to='/'
                className='self-center tracking-widest outline-none whitespace-nowrap text-2xl sm:text-2xl font-semibold md:font-bold'
            >
                <span
                    className='bg-clip-text text-transparent bg-gradient-to-r
                from-gray-600 via-gray-800 to-gray-500 dark:from-gray-200 dark:to-gray-400'
                >
                    Watc<span className='font-extrabold text-yellow-400 dark:text-blue-400'>H</span>
                    es
                </span>
            </Link>

            <form onSubmit={handleSearch}>
                <TextInput
                    type='text'
                    placeholder='Tìm kiếm...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline-block lg:w-96 rounded-lg'
                    value={searchTerm ?? ''}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <div className='md:hidden ml-14'>
                <Button
                    className='rounded-full w-10'
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
                <div className='flex gap-2 md:order-2'>
                    <Button
                        onClick={() => dispatch(toggleTheme())}
                        className='w-12 h-10 hidden sm:inline'
                        color='gray'
                        pill
                    >
                        {theme === 'light' ? (
                            <FaSun className='text-yellow-400' />
                        ) : (
                            <FaMoon className='text-blue-400' />
                        )}
                    </Button>
                    {tokenUser ? (
                        <Dropdown
                            className='mt-[2px]'
                            inline
                            arrowIcon={false}
                            label={<Avatar alt='Avatar_User' img={avatarUser} rounded />}
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
            )}

            <Navbar.Collapse className='md:inline-block '>
                <Navbar.Link active={pathURL === '/'} as={'div'}>
                    <Link to='/' className='flex justify-start items-center gap-x-2 md:gap-x-1'>
                        <IoIosHome size={'20px'} />
                        Trang chủ
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/products'} as={'div'}>
                    <Link
                        to='/products'
                        className='flex justify-start items-center gap-x-2 md:gap-x-1'
                    >
                        <MdWatch size={'20px'} />
                        Sản phẩm
                    </Link>
                </Navbar.Link>
                <Navbar.Link className='group' active={pathURL === '/cart'} as={'div'}>
                    <Link to='/cart' className='flex justify-start items-center gap-x-2 md:gap-x-1'>
                        <Badge count={tokenUser ? cartTotalQuantity : 0}>
                            <IoIosCart
                                className={`dark:text-gray-400 dark:group-hover:!text-gray-200 group-hover:!text-[#0E7490] ${
                                    pathURL === '/cart' ? 'text-[#0E7490]' : 'text-gray-700'
                                }`}
                                size={'20px'}
                            />
                        </Badge>
                        Giỏ hàng
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/services'} as={'div'}>
                    <Link
                        to='/services'
                        className='flex justify-start items-center gap-x-2 md:gap-x-1'
                    >
                        <MdHomeRepairService size={'20px'} />
                        Dịch vụ
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
