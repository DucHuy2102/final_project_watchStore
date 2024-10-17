import { useState, useEffect, Fragment, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import { user_SignOut } from '../../redux/slices/userSlice';
import { Button, Modal } from 'flowbite-react';
import { HiChartPie, HiOutlineExclamationCircle, HiOutlineUserGroup, HiShoppingBag, HiUser } from 'react-icons/hi';
import { FaShippingFast } from 'react-icons/fa';
import { TbLogout2 } from 'react-icons/tb';
import { MdDiscount } from 'react-icons/md';
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

const SidebarItem = ({ to, icon: Icon, active, showSidebar, children }) => {
    return (
        <div className='w-full'>
            <Tooltip title={children} placement='right' className='w-full'>
                <Link
                    to={to}
                    className={`flex items-center justify-start w-full rounded-lg py-2 transition-all duration-200 
                     ${
                         active
                             ? 'bg-blue-500 hover:bg-blue-600 text-white font-semibold'
                             : 'hover:bg-gray-100 text-gray-700'
                     } 
                     ${showSidebar ? 'px-5' : 'px-2 justify-center'}`}
                >
                    {showSidebar ? <Icon size={20} /> : <Icon size={25} />}
                    {showSidebar && <span className='ml-2'>{children}</span>}
                </Link>
            </Tooltip>
        </div>
    );
};

export default function Sidebar_Component() {
    // state
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const theme = useSelector((state) => state.theme.theme);
    const currentUser = useSelector((state) => state.user.user);
    const [showSidebar, setShowSidebar] = useState(true);
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
    const handleSignOutAccount = useCallback(async () => {
        dispatch(user_SignOut());
    }, [dispatch]);

    const toggleSidebar = useCallback(() => {
        setShowSidebar((prev) => !prev);
    }, []);

    return (
        <div
            className={`relative transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-r dark:border-gray-500 ${
                showSidebar ? 'w-64' : 'w-16'
            }`}
        >
            <div className={`flex flex-col items-center justify-between h-screen ${showSidebar ? 'p-5' : 'px-2 py-5'}`}>
                <div className='w-full flex flex-col items-center justify-between gap-y-5'>
                    <div className='flex items-center justify-center w-full'>
                        {showSidebar && (
                            <Link
                                to='/'
                                className='tracking-widest outline-none whitespace-nowrap text-2xl sm:text-2xl font-semibold md:font-bold'
                            >
                                <span
                                    className='bg-clip-text text-transparent bg-gradient-to-r
                    from-gray-600 via-gray-800 to-gray-500 dark:from-gray-200 dark:to-gray-400'
                                >
                                    Watc<span className='font-extrabold text-yellow-400 dark:text-blue-400'>H</span>
                                    es
                                </span>
                            </Link>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className={`z-10 transition-all absolute duration-300 ease-in-out p-2 rounded-full 
                            bg-gray-200 text-gray-600 hover:bg-gray-600 hover:text-gray-200 
                            dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-800
                                    ${showSidebar ? '-right-5 top-[50%]' : 'top-3'}`}
                        >
                            {showSidebar ? <SlArrowLeft size={20} /> : <SlArrowRight size={20} />}
                        </button>
                    </div>

                    <div className={`flex flex-col items-center justify-center ${!showSidebar && 'mt-5'}`}>
                        <div className='relative'>
                            <img
                                src={currentUser?.avatarImg ?? '/assets/default_Avatar.jpg'}
                                className={`rounded-full object-cover border-4 border-gray-200 shadow-sm ${
                                    showSidebar ? 'w-28 h-28' : 'w-12 h-12'
                                }`}
                                alt='Avatar User'
                            />
                            <div
                                className={`absolute bottom-1 right-1 bg-green-400 rounded-full 
                            border-2 border-white ${showSidebar ? 'w-4 h-4' : 'w-3 h-3'}`}
                            />
                        </div>

                        {showSidebar && (
                            <>
                                <h2
                                    className={`mt-4 text-xl font-semibold ${
                                        theme === 'light' ? 'text-gray-800' : 'text-gray-200'
                                    }`}
                                >
                                    {currentUser.username}
                                </h2>
                                <span
                                    className={`mt-1 px-3 py-1 ${
                                        theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
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
                            </>
                        )}

                        <nav className='space-y-2 w-full mt-5'>
                            <SidebarItem
                                to='/dashboard?tab=dashboard'
                                icon={HiChartPie}
                                active={tab === 'dashboard'}
                                showSidebar={showSidebar}
                            >
                                Trang chủ
                            </SidebarItem>
                            <SidebarItem
                                to='/dashboard?tab=profile'
                                icon={HiUser}
                                active={tab === 'profile'}
                                showSidebar={showSidebar}
                            >
                                Trang cá nhân
                            </SidebarItem>
                            {!isAdmin && (
                                <SidebarItem
                                    to='/dashboard?tab=order'
                                    icon={FaShippingFast}
                                    active={tab === 'order'}
                                    showSidebar={showSidebar}
                                >
                                    Đơn hàng của tôi
                                </SidebarItem>
                            )}

                            {isAdmin && (
                                <Fragment>
                                    {showSidebar && (
                                        <div className={`relative`}>
                                            <div className={`absolute inset-0 flex items-center`}>
                                                <div
                                                    className={`w-full border-t ${
                                                        theme === 'light' ? 'border-gray-300' : 'border-gray-700'
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
                                    )}
                                    <SidebarItem
                                        to='/dashboard?tab=products'
                                        icon={HiShoppingBag}
                                        active={tab === 'products'}
                                        theme={theme}
                                        showSidebar={showSidebar}
                                    >
                                        Sản phẩm
                                    </SidebarItem>
                                    <SidebarItem
                                        to='/dashboard?tab=vouchers'
                                        icon={MdDiscount}
                                        active={tab === 'vouchers'}
                                        theme={theme}
                                        showSidebar={showSidebar}
                                    >
                                        Giảm giá
                                    </SidebarItem>
                                    <SidebarItem
                                        to='/dashboard?tab=users'
                                        icon={HiOutlineUserGroup}
                                        active={tab === 'users'}
                                        theme={theme}
                                        showSidebar={showSidebar}
                                    >
                                        Người dùng
                                    </SidebarItem>
                                    <SidebarItem
                                        to='/dashboard?tab=orders'
                                        icon={FaShippingFast}
                                        active={tab === 'orders'}
                                        theme={theme}
                                        showSidebar={showSidebar}
                                    >
                                        Đơn hàng
                                    </SidebarItem>{' '}
                                </Fragment>
                            )}
                        </nav>
                    </div>
                </div>
                <div className='w-full'>
                    <Tooltip title='Đăng xuất' placement='right' className='w-full'>
                        <button
                            onClick={() => setShowModal(true)}
                            className='w-full bg-red-500 hover:bg-red-600 rounded-lg py-2 text-white'
                        >
                            <div
                                className={`flex items-center justify-center ${showSidebar ? 'px-5 gap-x-2' : 'px-2'}`}
                            >
                                <TbLogout2 size={showSidebar ? 20 : 25} />
                                {showSidebar && <span>Đăng xuất</span>}
                            </div>
                        </button>
                    </Tooltip>
                </div>
            </div>

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
// return (
//     <div
//         className={`relative transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-r dark:border-gray-500 ${
//             showSidebar ? 'w-64' : 'w-16'
//         }`}
//     >
//         <div className={`flex flex-col items-center justify-between h-screen ${showSidebar ? 'p-5' : 'px-2 py-5'}`}>
//             <div className='w-full flex flex-col items-center justify-between gap-y-5'>
//                 <button
//                     onClick={toggleSidebar}
//                     className={`transition-all duration-300 ${showSidebar ? 'self-start' : 'self-center'}`}
//                 >
//                     {showSidebar ? <SlArrowLeft size={20} /> : <SlArrowRight size={20} />}
//                 </button>

//                 <div className='flex flex-col items-center justify-center'>
//                     <div className='relative'>
//                         <img
//                             src={currentUser?.avatarImg ?? '/assets/default_Avatar.jpg'}
//                             className={`rounded-full object-cover border-4 border-gray-200 shadow-sm ${
//                                 showSidebar ? 'w-28 h-28' : 'w-12 h-12'
//                             }`}
//                             alt='Avatar User'
//                         />
//                         <div
//                             className={`absolute bottom-1 right-1 bg-green-400 rounded-full
//                         border-2 border-white ${showSidebar ? 'w-4 h-4' : 'w-3 h-3'}`}
//                         />
//                     </div>

//                     {showSidebar && (
//                         <>
//                             <h2
//                                 className={`mt-4 text-xl font-semibold ${
//                                     theme === 'light' ? 'text-gray-800' : 'text-gray-200'
//                                 }`}
//                             >
//                                 {currentUser.username}
//                             </h2>
//                             <span
//                                 className={`mt-1 px-3 py-1 ${
//                                     theme === 'light' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900 text-blue-200'
//                                 } rounded-full text-xs font-medium`}
//                             >
//                                 {currentUser.admin ? 'ADMIN' : 'USER'}
//                             </span>
//                             <p
//                                 className={`mt-2 text-sm font-medium ${
//                                     theme === 'light' ? 'text-gray-600' : 'text-gray-400'
//                                 }`}
//                             >
//                                 {currentUser.email}
//                             </p>
//                         </>
//                     )}

//                     <nav className='space-y-2 w-full mt-5'>
//                         <SidebarItem
//                             to='/dashboard?tab=dashboard'
//                             icon={HiChartPie}
//                             active={tab === 'dashboard'}
//                             showSidebar={showSidebar}
//                         >
//                             Trang chủ
//                         </SidebarItem>
//                         <SidebarItem
//                             to='/dashboard?tab=profile'
//                             icon={HiUser}
//                             active={tab === 'profile'}
//                             showSidebar={showSidebar}
//                         >
//                             Trang cá nhân
//                         </SidebarItem>
//                         {!isAdmin && (
//                             <SidebarItem
//                                 to='/dashboard?tab=order'
//                                 icon={FaShippingFast}
//                                 active={tab === 'order'}
//                                 showSidebar={showSidebar}
//                             >
//                                 Đơn hàng của tôi
//                             </SidebarItem>
//                         )}

//                         {isAdmin && (
//                             <Fragment>
//                                 {showSidebar && (
//                                     <div className={`relative`}>
//                                         <div className={`absolute inset-0 flex items-center`}>
//                                             <div
//                                                 className={`w-full border-t ${
//                                                     theme === 'light' ? 'border-gray-300' : 'border-gray-700'
//                                                 }`}
//                                             ></div>
//                                         </div>
//                                         <div className='relative flex justify-center mt-5'>
//                                             <span
//                                                 className={`px-3 text-sm font-semibold uppercase ${
//                                                     theme === 'light'
//                                                         ? 'bg-white text-gray-600'
//                                                         : 'bg-gray-900 text-gray-300'
//                                                 }`}
//                                             >
//                                                 Quản lý
//                                             </span>
//                                         </div>
//                                     </div>
//                                 )}
//                                 <SidebarItem
//                                     to='/dashboard?tab=products'
//                                     icon={HiShoppingBag}
//                                     active={tab === 'products'}
//                                     theme={theme}
//                                     showSidebar={showSidebar}
//                                 >
//                                     Sản phẩm
//                                 </SidebarItem>
//                                 <SidebarItem
//                                     to='/dashboard?tab=vouchers'
//                                     icon={MdDiscount}
//                                     active={tab === 'vouchers'}
//                                     theme={theme}
//                                     showSidebar={showSidebar}
//                                 >
//                                     Giảm giá
//                                 </SidebarItem>
//                                 <SidebarItem
//                                     to='/dashboard?tab=users'
//                                     icon={HiOutlineUserGroup}
//                                     active={tab === 'users'}
//                                     theme={theme}
//                                     showSidebar={showSidebar}
//                                 >
//                                     Người dùng
//                                 </SidebarItem>
//                                 <SidebarItem
//                                     to='/dashboard?tab=orders'
//                                     icon={FaShippingFast}
//                                     active={tab === 'orders'}
//                                     theme={theme}
//                                     showSidebar={showSidebar}
//                                 >
//                                     Đơn hàng
//                                 </SidebarItem>{' '}
//                             </Fragment>
//                         )}
//                     </nav>
//                 </div>
//             </div>
//             <div className='w-full'>
//                 <Tooltip title='Đăng xuất' placement='right' className='w-full'>
//                     <button
//                         onClick={() => setShowModal(true)}
//                         className='w-full bg-red-500 hover:bg-red-600 rounded-lg py-2 text-white'
//                     >
//                         <div
//                             className={`flex items-center justify-center ${showSidebar ? 'px-5 gap-x-2' : 'px-2'}`}
//                         >
//                             <TbLogout2 size={showSidebar ? 20 : 25} />
//                             {showSidebar && <span>Đăng xuất</span>}
//                         </div>
//                     </button>
//                 </Tooltip>
//             </div>
//         </div>

//         <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
//             <Modal.Header />
//             <Modal.Body>
//                 <div className='text-center'>
//                     <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
//                     <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
//                         Bạn có chắc chắn muốn đăng xuất?
//                     </h3>
//                     <div className='flex justify-center gap-4'>
//                         <Button color='failure' onClick={handleSignOutAccount}>
//                             Đăng xuất
//                         </Button>
//                         <Button color='gray' onClick={() => setShowModal(false)}>
//                             Hủy
//                         </Button>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     </div>
// );
// }
