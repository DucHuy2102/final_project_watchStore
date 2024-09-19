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
import { resetCart } from '../../redux/slices/cartSlice';

export default function Sidebar_Component() {
    // state
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const currentUser = useSelector((state) => state.user.user);
    const isAdmin = currentUser.admin;

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
        dispatch(resetCart());
    };

    return (
        <Sidebar className='min-h-[90vh] w-full md:w-56'>
            <Sidebar.Items
                className={`h-full flex flex-col ${isAdmin ? 'justify-between' : 'justify-start'}`}
            >
                <div className='flex flex-col justify-center items-center pt-5'>
                    <img
                        src={currentUser.avatarImg}
                        className='rounded-full w-20 h-20 object-cover'
                        alt='Avatar User'
                    />
                    <div className='mt-3 flex flex-col justify-center items-center'>
                        <span className='text-black dark:text-gray-200 font-semibold text-lg'>
                            {currentUser.username} -{' '}
                            <span
                                className='bg-blue-500 hover:bg-blue-600 dark:bg-red-500 dark:hover:bg-red-600                             
                    text-white uppercase text-sm px-4 py-1 rounded-lg transition-colors duration-200 cursor-pointer'
                            >
                                {currentUser.admin ? 'admin' : 'user'}
                            </span>
                        </span>
                        <span className='text-gray-700 dark:text-gray-200 text-sm'>
                            {currentUser.email}
                        </span>
                    </div>
                </div>
                <Sidebar.ItemGroup className='flex flex-col gap-1 justify-center'>
                    <Sidebar.Item
                        as={Link}
                        to='/dashboard?tab=dashboard'
                        active={tab === 'dashboard'}
                        icon={HiChartPie}
                        label={isAdmin ? 'Admin' : ''}
                        labelColor={theme === 'light' ? 'dark' : 'light'}
                        className={`${tab === 'dashboard' ? 'bg-gray-400 text-black' : ''}`}
                    >
                        Trang chủ
                    </Sidebar.Item>
                    <Sidebar.Item
                        as={Link}
                        to='/dashboard?tab=profile'
                        active={tab === 'profile'}
                        icon={HiUser}
                        labelColor='dark'
                        className={`${tab === 'profile' ? 'bg-gray-400 text-black' : ''}`}
                    >
                        Trang cá nhân
                    </Sidebar.Item>
                    {!isAdmin && (
                        <Sidebar.Item
                            as={Link}
                            to='/dashboard?tab=order'
                            active={tab === 'order'}
                            icon={FaShippingFast}
                            labelColor='dark'
                            className={`${tab === 'order' ? 'bg-gray-400 text-black' : ''}`}
                        >
                            Đơn hàng
                        </Sidebar.Item>
                    )}
                </Sidebar.ItemGroup>

                {isAdmin && (
                    <Sidebar.ItemGroup className='flex flex-col gap-1 justify-center'>
                        <Sidebar.Item
                            as={Link}
                            to='/dashboard?tab=products'
                            active={tab === 'products'}
                            icon={HiShoppingBag}
                            className={`${tab === 'products' ? 'bg-gray-400 text-black' : ''}`}
                        >
                            Sản phẩm
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to='/dashboard?tab=users'
                            active={tab === 'users'}
                            icon={HiOutlineUserGroup}
                            className={`${tab === 'users' ? 'bg-gray-400 text-black' : ''}`}
                        >
                            Người dùng
                        </Sidebar.Item>
                        <Sidebar.Item
                            as={Link}
                            to='/dashboard?tab=orders'
                            active={tab === 'orders'}
                            icon={FaShippingFast}
                            className={`${tab === 'orders' ? 'bg-gray-400 text-black' : ''}`}
                        >
                            Đơn hàng
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                )}
                <Sidebar.ItemGroup>
                    <Sidebar.Item
                        icon={TbLogout2}
                        className={'cursor-pointer'}
                        onClick={() => setShowModal(true)}
                    >
                        Đăng xuất
                    </Sidebar.Item>
                </Sidebar.ItemGroup>

                <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='text-red-500 text-5xl mx-auto' />
                            <span className='text-lg font-medium text-black'>
                                Bạn có chắc chắn muốn đăng xuất?
                            </span>
                            <div className='flex justify-between items-center mt-5'>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    Hủy
                                </Button>
                                <Button color='warning' onClick={handleSignOutAccount}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </Sidebar.Items>
        </Sidebar>
    );
}
