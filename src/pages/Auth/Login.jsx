import { Button, Label, Spinner, TextInput } from 'flowbite-react';
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

export default function Login() {
    // state
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loadingState, setLoadingState] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
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
            if (error.response.status === 401) {
                setErrorMessage('Tài khoản hoặc mật khẩu không đúng!');
            } else {
                setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại sau!');
            }
            setFormData({ username: '', password: '' });
            toast.error(errorMessage);
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
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
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
                                <Label htmlFor='username' className='text-gray-700 dark:text-gray-300'>
                                    Tên người dùng
                                </Label>
                                <TextInput
                                    icon={FaUser}
                                    style={{ border: '1px solid #BDBDBD', boxShadow: 'none', outline: 'none' }}
                                    type='text'
                                    autoFocus
                                    placeholder='Tên người dùng'
                                    id='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor='password' className='text-gray-700 dark:text-gray-300'>
                                    Mật khẩu
                                </Label>
                                <TextInput
                                    style={{ border: '1px solid #BDBDBD', boxShadow: 'none', outline: 'none' }}
                                    icon={FaLock}
                                    type='password'
                                    placeholder='Mật khẩu'
                                    id='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex items-center justify-end'>
                                <Link
                                    to='/forgot-password'
                                    className='text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 
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
                                className='focus:!ring-0 w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
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
