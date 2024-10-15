import { Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { IoIosCart, IoIosHome, IoIosSearch } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';

export default function Mini_Navbar() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.theme.theme);

    // state
    const [tab, setTab] = useState('');

    const NavButton = ({ to, icon: Icon, children }) => (
        <Button outline color={theme === 'light' ? 'light' : 'dark'}>
            <Link
                to={to}
                className='flex items-center justify-start gap-x-1
                     text-sm lg:text-md lg:font-bold font-medium cursor-pointer'
            >
                <Icon size={16} />
                <span>{children}</span>
            </Link>
        </Button>
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

    return (
        <nav className='flex flex-wrap items-center justify-between gap-4 px-4 py-2'>
            <form onSubmit={handleSearch} className='flex-grow max-w-md'>
                <div className='relative'>
                    <input
                        type='search'
                        className={`w-full pl-10 pr-4 py-2 rounded-full text-sm ${
                            theme === 'light'
                                ? 'bg-gray-100 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                                : 'bg-gray-700 text-white focus:ring-blue-600 focus:border-blue-600'
                        } border-none`}
                        placeholder='Tìm kiếm nhanh...'
                    />
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                        <IoIosSearch
                            className={theme === 'light' ? 'text-gray-500' : 'text-gray-400'}
                            size={18}
                        />
                    </div>
                </div>
            </form>

            <div className='flex items-center gap-x-5'>
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

            <div className='flex items-center justify-center gap-x-2'>
                <Button
                    onClick={() => dispatch(toggleTheme())}
                    color={theme === 'light' ? 'light' : 'dark'}
                    pill
                >
                    {theme === 'light' ? (
                        <FaSun size={14} className='text-yellow-400' />
                    ) : (
                        <FaMoon size={14} className='text-blue-400' />
                    )}
                </Button>
                <div className='flex items-center space-x-2'>
                    <img
                        src={currentUser?.avatarImg || '../assets/default_Avatar.jpg'}
                        alt='User Avatar'
                        className='w-9 h-9 rounded-full object-cover'
                    />
                </div>
            </div>
        </nav>
    );
}
