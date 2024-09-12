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
        <Navbar className='shadow-2xl border-b-2 flex flex-wrap md:flex-nowrap items-center justify-between bg-white text-gray-800'>
            {/* name app */}
            <Link
                to='/'
                className='self-center tracking-widest outline-none whitespace-nowrap text-xl sm:text-2xl md:text-3xl font-semibold'
            >
                <span
                    className='bg-clip-text text-transparent bg-gradient-to-r 
                from-gray-600 via-gray-800 to-gray-500 dark:from-gray-200 dark:to-gray-400'
                >
                    Watc<span className='font-extrabold text-yellow-400 dark:text-blue-400'>H</span>
                    es
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
                    {theme === 'light' ? (
                        <FaSun className='text-yellow-400' />
                    ) : (
                        <FaMoon className='text-blue-400' />
                    )}
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
                        {/* <Button
                            outline
                            pill
                            className='bg-gradient-to-r from-slate-700 via-slate-700 to-zinc-700 text-white px-1'
                        > */}
                        <Button pill outline>
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
