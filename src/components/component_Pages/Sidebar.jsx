import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { user_SignOut } from '../../redux/slices/userSlice';
import { Button, Modal, Sidebar } from 'flowbite-react';
import {
    HiAnnotation,
    HiArrowSmDown,
    HiChartPie,
    HiDocumentText,
    HiOutlineExclamationCircle,
    HiOutlineUserGroup,
    HiShoppingBag,
    HiUser,
} from 'react-icons/hi';
import { FaShippingFast } from 'react-icons/fa';

export default function Sidebar_Component() {
    // state
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    // const isAdmin = useSelector((state) => state.user.currentUser.isAdmin);
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
        try {
            dispatch(user_SignOut());
            console.log('sign out');
        } catch (error) {
            setError('Hệ thống đang bận, vui lòng thử lại sau');
            console.log(error);
        }
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                {isAdmin && (
                    <Sidebar.ItemGroup className='flex flex-col gap-1 justify-center'>
                        <Sidebar.Collapse icon={HiDocumentText} label='Quản lý hệ thống'>
                            <Sidebar.Item
                                as={Link}
                                to='/dashboard?tab=posts'
                                active={tab === 'posts'}
                                icon={HiShoppingBag}
                                className={`${tab === 'posts' ? 'bg-gray-400 text-black' : ''}`}
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
                                to='/dashboard?tab=comments'
                                active={tab === 'comments'}
                                icon={FaShippingFast}
                                className={`${tab === 'comments' ? 'bg-gray-400 text-black' : ''}`}
                            >
                                Đơn hàng
                            </Sidebar.Item>
                        </Sidebar.Collapse>
                    </Sidebar.ItemGroup>
                )}
                <Sidebar.ItemGroup className='flex flex-col gap-1 justify-center'>
                    <Sidebar.Item
                        as={Link}
                        to='/dashboard?tab=dashboard'
                        active={tab === 'dashboard'}
                        icon={HiChartPie}
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
                    <Sidebar.Item
                        icon={HiArrowSmDown}
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
