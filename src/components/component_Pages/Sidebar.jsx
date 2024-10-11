import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { user_SignOut } from '../../redux/slices/userSlice';
import { Button, Modal, Sidebar } from 'flowbite-react';
import {
    HiChartPie,
    HiOutlineExclamationCircle,
    HiOutlineUserGroup,
    HiShoppingBag,
    HiUser,
} from 'react-icons/hi';
import { FaShippingFast } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { MdDiscount } from 'react-icons/md';

export default function Sidebar_Component() {
    // state
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const currentUser = useSelector((state) => state.user.user);
    const isAdmin = false;

    // get tab from url
    const location = useLocation();
    const [tab, setTab] = useState('');
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabURL = urlParams.get('tab');
        setTab(tabURL);
    }, [location.search]);

    // sign out function
    const handleSignOutAccount = async () => {
        dispatch(user_SignOut());
    };

    return (
        <div
            className={`h-[91vh] w-full ${
                theme === 'light' ? 'bg-white' : 'bg-gray-900'
            } shadow-lg p-6 flex flex-col justify-between transition-colors duration-300 sidebar-animation`}
        >
            <div>
                <div className='flex flex-col items-center mb-8'>
                    <div className='relative'>
                        <img
                            src={currentUser?.avatarImg || '/assets/default_Avatar.jpg'}
                            className='rounded-full w-24 h-24 object-cover border-4 border-gray-200 shadow-sm'
                            alt='Avatar User'
                        />
                        <div className='absolute bottom-1 right-1 bg-green-400 rounded-full w-4 h-4 border-2 border-white'></div>
                    </div>
                    <h2
                        className={`mt-4 text-xl font-semibold ${
                            theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                        }`}
                    >
                        {currentUser.username}
                    </h2>
                    <span
                        className={`mt-1 px-3 py-1 ${
                            theme === 'light'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-blue-900 text-blue-200'
                        } rounded-full text-xs font-medium`}
                    >
                        {currentUser.admin ? 'ADMIN' : 'USER'}
                    </span>
                    <p
                        className={`mt-2 text-sm font-medium ${
                            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                        }`}
                    >
                        {currentUser.email}
                    </p>
                </div>

                <nav className='space-y-1'>
                    <SidebarItem
                        to='/dashboard?tab=dashboard'
                        icon={HiChartPie}
                        active={tab === 'dashboard'}
                        theme={theme}
                    >
                        Trang chủ
                    </SidebarItem>
                    <SidebarItem
                        to='/dashboard?tab=profile'
                        icon={HiUser}
                        active={tab === 'profile'}
                        theme={theme}
                    >
                        Trang cá nhân
                    </SidebarItem>
                    {!isAdmin && (
                        <SidebarItem
                            to='/dashboard?tab=order'
                            icon={FaShippingFast}
                            active={tab === 'order'}
                            theme={theme}
                        >
                            Đơn hàng của tôi
                        </SidebarItem>
                    )}
                    {isAdmin && (
                        <>
                            <div className={`relative`}>
                                <div className={`absolute inset-0 flex items-center`}>
                                    <div
                                        className={`w-full border-t ${
                                            theme === 'light'
                                                ? 'border-gray-300'
                                                : 'border-gray-700'
                                        }`}
                                    ></div>
                                </div>
                                <div className='relative flex justify-center mt-5'>
                                    <span
                                        className={`px-3 text-sm font-semibold uppercase ${
                                            theme === 'light'
                                                ? 'bg-white text-gray-600'
                                                : 'bg-gray-900 text-gray-300'
                                        }`}
                                    >
                                        Quản lý
                                    </span>
                                </div>
                            </div>
                            <SidebarItem
                                to='/dashboard?tab=products'
                                icon={HiShoppingBag}
                                active={tab === 'products'}
                                theme={theme}
                            >
                                Sản phẩm
                            </SidebarItem>
                            <SidebarItem
                                to='/dashboard?tab=vouchers'
                                icon={MdDiscount}
                                active={tab === 'vouchers'}
                                theme={theme}
                            >
                                Giảm giá
                            </SidebarItem>
                            <SidebarItem
                                to='/dashboard?tab=users'
                                icon={HiOutlineUserGroup}
                                active={tab === 'users'}
                                theme={theme}
                            >
                                Người dùng
                            </SidebarItem>
                            <SidebarItem
                                to='/dashboard?tab=orders'
                                icon={FaShippingFast}
                                active={tab === 'orders'}
                                theme={theme}
                            >
                                Đơn hàng
                            </SidebarItem>
                        </>
                    )}
                </nav>
            </div>

            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center justify-center w-full py-2 mt-6 ${
                    theme === 'light'
                        ? 'bg-gray-200 hover:bg-red-600 hover:text-white text-black'
                        : 'bg-gray-700 hover:bg-red-800 text-gray-200'
                } rounded-lg transition-colors duration-200 shadow-md`}
            >
                <TbLogout2 className='mr-2' />
                Đăng xuất
            </button>

            <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
                        <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                            Bạn có chắc chắn muốn đăng xuất?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleSignOutAccount}>
                                Đăng xuất
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

function SidebarItem({ to, icon: Icon, active, children, theme }) {
    return (
        <Link
            to={to}
            className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                active
                    ? theme === 'light'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-blue-900 text-blue-200'
                    : theme === 'light'
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-300 hover:bg-gray-800'
            }`}
        >
            <Icon
                className={`mr-3 ${
                    active ? (theme === 'light' ? 'text-blue-600' : 'text-blue-300') : ''
                }`}
            />
            <span>{children}</span>
        </Link>
    );
}
