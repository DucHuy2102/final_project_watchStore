import { useEffect, useState } from 'react';
import { Alert, Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/theme.slice';
import { user_SignOut } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';

export default function Header_Component() {
    // states
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathURL = useLocation().pathname;
    const theme = useSelector((state) => state.theme.theme);
    const currentUser = useSelector((state) => state.user.currentUser);

    // handle search function
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('search');
    };

    // handle sign out account
    const handleSignOutAccount = () => {
        try {
            dispatch(user_SignOut());
            console.log('sign out');
        } catch (error) {
            toast.error('Hệ thống đang bận, vui lòng thử lại sau');
            console.log(error);
        }
    };

    return (
        <Navbar className='shadow-lg border-b-2 flex flex-wrap md:flex-nowrap items-center justify-between'>
            {/* name app */}
            <Link
                to='/'
                className='self-center whitespace-nowrap text-xl sm:text-2xl md:text-xl lg:font-bold font-semibold'
            >
                <span className='px-3 py-1 md:py-[7px] lg:px-5 rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600'>
                    <span className='tracking-widest font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-900 to-black dark:from-white dark:to-orange-500'>
                        Watc<span className='font-bold text-teal-500 dark:text-white'>H</span>es
                    </span>
                </span>
            </Link>

            {/* search form */}
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Tìm kiếm...'
                    rightIcon={AiOutlineSearch}
                    className='w-60 hidden sm:inline md:inline-block md:w-36 lg:w-96'
                    // value={searchTerm ?? ''}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {/* button change theme & sign-in */}
            <div className='flex gap-2 md:order-2'>
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    className='w-12 h-10 sm:inline flex justify-center items-center'
                    color='gray'
                    pill
                >
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        className='mt-1'
                        inline
                        arrowIcon={false}
                        label={<Avatar alt='Avatar_User' img={currentUser?.avatarImg} rounded />}
                    >
                        <Dropdown.Header>
                            <span className='block text-center text-sm font-medium truncate'>
                                {currentUser?.username}
                            </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=dashboard'}>
                            <Dropdown.Item>Trang cá nhân</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOutAccount}>Đăng xuất</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/login' className='ml-2'>
                        <Button
                            className='bg-gradient-to-r from-slate-700 via-slate-700 to-zinc-700 text-white px-1'
                            outline
                            pill
                        >
                            Đăng nhập
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>

            {/* menu */}
            <Navbar.Collapse className=''>
                <Navbar.Link active={pathURL === '/'} as={'div'}>
                    <Link to='/'>Trang chủ</Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/products'} as={'div'}>
                    <Link to='/products'>Sản phẩm</Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/cart'} as={'div'}>
                    <Link to='/cart'>Giỏ hàng</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}
