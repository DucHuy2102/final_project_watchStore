import { Avatar, Button, Dropdown, Modal, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { user_SignOut } from '../../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { IoIosCart, IoIosHome } from 'react-icons/io';
import { MdDone, MdWatch } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { IoTriangle } from 'react-icons/io5';

export default function Header_Component() {
    // states
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pathURL = useLocation().pathname;
    const theme = useSelector((state) => state.theme.theme);
    const tokenUser = useSelector((state) => state.user.access_token);
    const currentUser = useSelector((state) => state.user.user);
    const cartProduct = useSelector((state) => state.cart.cartItem);
    const [showCartSuccess, setShowCartSuccess] = useState(false);

    // show cart success when add product to cart
    useEffect(() => {
        if (cartProduct.length > 0) {
            setShowCartSuccess(true);
            setTimeout(() => {
                setShowCartSuccess(false);
            }, 5000);
        }
    }, [cartProduct]);

    // handle navigate to cart page
    const handleNavigateToCart = () => {
        navigate('/cart');
        setShowCartSuccess(false);
    };

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
                {tokenUser ? (
                    <Dropdown
                        className='mt-1'
                        inline
                        arrowIcon={false}
                        label={
                            <Avatar
                                alt='Avatar_User'
                                img={currentUser.avatarImg || '../assets/default_Avatar.jpg'}
                                rounded
                            />
                        }
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
                    <Link to='/' className='flex justify-center items-center gap-x-2'>
                        <IoIosHome size={'20px'} />
                        Trang chủ
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/products'} as={'div'}>
                    <Link to='/products' className='flex justify-center items-center gap-x-2'>
                        <MdWatch size={'20px'} />
                        Sản phẩm
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={pathURL === '/cart'} as={'div'}>
                    <Link to='/cart' className='flex justify-center items-center gap-x-2'>
                        <IoIosCart size={'20px'} />
                        Giỏ hàng
                    </Link>
                </Navbar.Link>
                {/* {showCartSuccess && (
                    <div className='absolute top-[62px] right-36 z-10'>
                        <div
                            className='absolute top-[-12px] left-[10px] w-0 h-0 border-l-[15px] 
                    border-l-transparent border-r-[15px] border-r-transparent border-b-[15px] border-b-blue-500 dark:border-b-white'
                        ></div>
                        <div
                            className='bg-blue-500 dark:bg-white p-4 rounded-lg shadow-lg 
                    flex flex-col gap-y-4 relative'
                        >
                            <span className='flex justify-center items-center gap-x-2'>
                                <MdDone
                                    className='bg-white text-blue-500 dark:bg-green-500 dark:text-white rounded-full p-1'
                                    size={20}
                                />
                                <span className='text-white dark:text-black font-semibold'>
                                    Thêm vào giỏ hàng thành công!
                                </span>
                            </span>

                            <button
                                onClick={handleNavigateToCart}
                                className='text-white bg-red-600 hover:bg-red-700 w-full py-2 rounded-lg transition duration-300'
                            >
                                Xem và thanh toán
                            </button>
                        </div>
                    </div>
                )} */}
            </Navbar.Collapse>
        </Navbar>
    );
}
