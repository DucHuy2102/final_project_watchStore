import { Button, Dropdown } from 'flowbite-react';
import { useCallback } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleTheme } from '../../services/redux/slices/themeSlice';
import { IoIosCart, IoIosHome } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';
import { user_SignOut } from '../../services/redux/slices/userSlice';
import { Badge } from 'antd';

export default function Mini_Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const { access_token: tokenUser, user: currentUser } = useSelector((state) => state.user);
    const { cartTotalQuantity } = useSelector((state) => state.cart);
    const avatarUser = currentUser?.avatarImg ?? '../assets/default_Avatar.jpg';
    const { theme } = useSelector((state) => state.theme);

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

    return (
        <div className='flex justify-center items-center py-5 backdrop-blur-md'>
            <div className='flex items-center justify-center gap-x-12'>
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

            <div className='flex gap-2 absolute right-10'>
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    color={theme === 'light' ? 'light' : 'dark'}
                    pill
                    className='focus:!ring-0 hover:scale-110 active:scale-95 transition-all duration-300 
                    backdrop-blur-lg bg-white/90 dark:bg-gray-800/90
                    hover:shadow-lg dark:hover:shadow-blue-500/20 hover:shadow-amber-500/20'
                >
                    {theme === 'light' ? (
                        <FaSun size={16} className='text-amber-500 animate-spin-slow hover:text-amber-600' />
                    ) : (
                        <FaMoon size={16} className='text-blue-500 animate-bounce-slow hover:text-blue-400' />
                    )}
                </Button>

                {tokenUser ? (
                    <Dropdown
                        className='mt-[1px] relative z-[9999]'
                        inline
                        arrowIcon={false}
                        label={
                            <div
                                className='w-10 h-10 ring-1 ring-gray-200/50 dark:ring-gray-700/50 rounded-full 
                                hover:ring-amber-500 dark:hover:ring-blue-500 transition-all duration-300 
                                hover:scale-105 backdrop-blur-lg'
                            >
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
                                onClick={() => dispatch(user_SignOut())}
                            >
                                <span className='font-medium py-1.5 px-3 w-full text-xs text-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-300'>
                                    Đăng xuất
                                </span>
                            </Dropdown.Item>
                        </div>
                    </Dropdown>
                ) : (
                    <Link to='/login'>
                        <Button
                            pill
                            outline
                            className='focus:!ring-0 backdrop-blur-lg 
                            bg-white/90 dark:bg-gray-800/90 hover:bg-gray-50 dark:hover:bg-gray-700'
                        >
                            Đăng nhập
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
