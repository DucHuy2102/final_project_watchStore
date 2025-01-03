import { Button, Modal, Spinner } from 'flowbite-react';
import { useState } from 'react';
import { CiLogin } from 'react-icons/ci';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { user_SignIn } from '../../services/redux/slices/userSlice';
import { TfiHandPointRight } from 'react-icons/tfi';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { IoIosHome } from 'react-icons/io';
import { FaLock, FaUser } from 'react-icons/fa';
import { Input } from 'antd';

export default function Login() {
    // state
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loadingState, setLoadingState] = useState(false);
    const [count, setCount] = useState(0);
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();

    // handle change input value in form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Login using username and password
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            setLoadingState(true);
            const credentials = btoa(`${formData.username}:${formData.password}`);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/sign-in`, null, {
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });
            if (res?.status === 200) {
                const { data } = res;
                dispatch(user_SignIn({ access_token: data.access_token, user: data }));
                toast.success('Đăng nhập thành công!');
                setTimeout(() => {
                    if (state?.from) {
                        navigate(state.from);
                    } else {
                        navigate('/');
                    }
                }, 3000);
            }
        } catch (error) {
            const countFailedAttempts = count + 1;
            setCount(countFailedAttempts);
            if (countFailedAttempts >= 3) {
                setModalShow(true);
            }
            setFormData({ username: '', password: '' });
            toast.error('Tài khoản hoặc mật khẩu không đúng!');
            console.log(error);
        } finally {
            setLoadingState(false);
        }
    };

    // Google Login
    const loginGoogle = useGoogleLogin({
        onSuccess: (response) => {
            const token = response.access_token;
            sendTokenToServer(token);
        },
        onFailure: (response) => {
            console.log('Login Failed:', response);
        },
    });

    // send token to server for verification and login
    const sendTokenToServer = async (token) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/google?token=${token}`);
            if (res.status === 200) {
                const { data } = res;
                dispatch(user_SignIn({ access_token: data.access_token, user: data }));
                toast.success('Đăng nhập thành công!');
                setTimeout(() => {
                    if (state?.from) {
                        navigate(state.from);
                    } else {
                        navigate('/');
                    }
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
            {/* modal check login 3 times */}
            <Modal show={modalShow} onClose={() => setModalShow(false)} popup className='backdrop-blur-md' size='md'>
                <Modal.Header />
                <Modal.Body className='p-y-4 space-y-5'>
                    <div className='text-center'>
                        <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
                            Bạn có muốn đặt lại mật khẩu không?
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Hệ thống chúng tôi ghi nhận bạn đã nhập sai nhiều lần
                        </p>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <Button color='gray' onClick={() => setModalShow(false)} className='w-32 !ring-0'>
                            Hủy
                        </Button>
                        <Button
                            color='blue'
                            onClick={() => {
                                navigate('/forgot-password');
                                setModalShow(false);
                            }}
                            className='w-32 !ring-0'
                        >
                            Xác nhận
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* login form */}
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-10 relative'>
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center'>
                    <div className='absolute top-6 left-6'>
                        <Link
                            to={'/'}
                            className='flex items-center gap-2 px-6 py-2.5 hover:text-blue-600 text-gray-700 
                            dark:text-gray-200 bg-white dark:bg-gray-800 rounded-tl-3xl rounded-br-3xl shadow-lg hover:shadow-xl
                            transition-all duration-300 group'
                        >
                            <IoIosHome className='text-xl group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-medium'>Trang chủ</span>
                        </Link>
                    </div>

                    <div className='flex flex-col items-center justify-center w-full md:max-w-2xl lg:max-w-full p-10 mt-10'>
                        <h2
                            className='text-3xl font-bold md:text-4xl text-gray-800 dark:text-white
                            bg-gradient-to-r from-blue-600 to-purple-600 h-12 bg-clip-text text-transparent'
                        >
                            Chào mừng bạn trở lại
                        </h2>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 text-center'>
                            Sử dụng tên người dùng và mật khẩu để đăng nhập
                        </p>

                        <form
                            className='w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl'
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label htmlFor='username' className='block text-gray-700 dark:text-gray-300 mb-2'>
                                    Tên người dùng
                                </label>
                                <Input
                                    prefix={<FaUser className='text-gray-600 mr-1' />}
                                    type='text'
                                    autoFocus
                                    placeholder='Tên người dùng'
                                    id='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                    className='!ring-0 !border-gray-300 h-10'
                                />
                            </div>
                            <div>
                                <label htmlFor='password' className='block text-gray-700 dark:text-gray-300 mb-2'>
                                    Mật khẩu
                                </label>
                                <Input.Password
                                    prefix={<FaLock className='text-gray-600 mr-1' />}
                                    placeholder='Mật khẩu'
                                    id='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                    className='!ring-0 !border-gray-300 h-10'
                                />
                            </div>
                            <div className='flex items-center justify-end'>
                                <Link
                                    to='/forgot-password'
                                    className='text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 
                    transition-colors duration-300 flex items-center'
                                >
                                    <TfiHandPointRight className='mr-1' />
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Button
                                disabled={loadingState}
                                type='submit'
                                color='blue'
                                className='focus:!ring-0 w-full rounded-xl py-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                            >
                                {loadingState ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='ml-2'>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <div className='flex items-center justify-center gap-x-2'>
                                        <CiLogin
                                            size={'20px'}
                                            className='transition-transform duration-300 transform group-hover:-translate-x-2'
                                        />
                                        <span>Đăng nhập</span>
                                    </div>
                                )}
                            </Button>
                        </form>

                        <div className='w-full max-w-md mt-6'>
                            <div className='flex items-center justify-center gap-x-2 mb-6'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Bạn chưa có tài khoản?</span>
                                <Link
                                    to='/register'
                                    className='text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 
                                    flex items-center font-medium transition-colors duration-300'
                                >
                                    <TfiHandPointRight className='mr-1' /> Đăng ký ngay
                                </Link>
                            </div>

                            <div className='relative my-6'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-gray-200 dark:border-gray-700'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span
                                        className='px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 
                                    dark:to-gray-800 text-gray-500 font-medium'
                                    >
                                        Hoặc
                                    </span>
                                </div>
                            </div>

                            <Button
                                color={'gray'}
                                className='w-full mt-3 focus:!ring-0 rounded-xl py-2.5 bg-white hover:bg-gray-50 
                                dark:bg-gray-800 dark:hover:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-300'
                                onClick={() => loginGoogle()}
                            >
                                <div className='flex items-center justify-center gap-x-3'>
                                    <FcGoogle className='text-xl' />
                                    <span>Đăng nhập bằng Google</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='hidden lg:block lg:w-1/2 h-screen'>
                    <div className='relative h-full w-full'>
                        <img
                            src={'../assets/login.webp'}
                            alt='Login'
                            className='w-full h-full object-cover rounded-l-[40px] shadow-2xl transform hover:scale-105 
            transition-all duration-700 animate-ken-burns'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-l-[40px]'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
