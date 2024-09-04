import { useState } from 'react';
import { Alert, Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../redux/slices/theme.slice';

export default function Header_Component() {
    // states
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathURL = useLocation().pathname;
    const theme = useSelector((state) => state.theme.theme);
    const currentUser = {
        email: 'duchuytv2102',
        avatar: 'https://pbs.twimg.com/media/EnbDAFKXcAAVBsO?format=jpg&name=large',
    };
    const [uploadFailed, setUploadError] = useState(null);

    // handle search function
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('search');
    };

    // handle sign out account
    const handleSignOutAccount = () => {
        console.log('sign out');
    };

    return (
        <Navbar className='border-b-2'>
            {/* name app */}
            <Link to='/' className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold'>
                <span className='px-3 py-2 rounded-lg bg-gradient-to-r from-white via-gray-200 to-white '>
                    <span className='bg-clip-text text-transparent bg-gradient-to-r from-black via-gray-900 to-black hover:text-black'>
                        Watc<span className='text-black text-xl sm:text-2xl'>H</span>es
                    </span>
                </span>
            </Link>

            {/* search form */}
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Tìm kiếm...'
                    rightIcon={AiOutlineSearch}
                    className='w-60 inline-block sm:w-80'
                    // value={searchTerm ?? ''}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {/* button change theme & sign-in */}
            <div className='flex gap-2 md:order-2'>
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    className='w-12 h-10 hidden sm:inline'
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
                        label={<Avatar alt='Avatar_User' img={currentUser.avatar} rounded />}
                    >
                        <Dropdown.Header>
                            <span className='block text-sm font-medium truncate'>
                                {currentUser.email}
                            </span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Trang cá nhân</Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignOutAccount}>Đăng xuất</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to='/sign-in' className='ml-2'>
                        <Button gradientDuoTone='purpleToBlue' pill outline>
                            Đăng nhập
                        </Button>
                    </Link>
                )}
                <Navbar.Toggle />
            </div>

            {/* menu */}
            <Navbar.Collapse>
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

            {/* show error when sign out failed */}
            {uploadFailed && (
                <Alert
                    color='failure'
                    className='w-full font-semibold flex justify-center items-center'
                >
                    {uploadFailed}
                </Alert>
            )}
        </Navbar>
    );
}
