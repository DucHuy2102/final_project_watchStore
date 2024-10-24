import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CiLogin, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { user_SignIn } from '../../redux/slices/userSlice';
import { TfiHandPointRight } from 'react-icons/tfi';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { IoIosCart, IoIosHome } from 'react-icons/io';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';

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

    // Facebook Login
    const responseFacebook = async (response) => {
        const token = response.data.accessToken;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/facebook?token=${token}`);
            console.log(res);
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
        <div className='w-full h-screen'>
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-5 relative'>
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center'>
                    <div className='absolute top-6 left-6'>
                        <Link
                            to={'/'}
                            className='flex items-center gap-2 px-4 py-2 hover:text-blue-500 text-gray-700 
                        dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 group'
                        >
                            <IoIosHome className='text-xl group-hover:scale-110 transition-transform duration-300' />
                            <span className='font-medium'>Trang chủ</span>
                        </Link>
                    </div>
                    <div className='flex flex-col items-center justify-center w-full md:max-w-2xl lg:max-w-full p-10 mt-10'>
                        <h2 className='text-2xl font-bold md:text-3xl text-gray-800 dark:text-white mb-2'>
                            Chào mừng bạn trở lại
                        </h2>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 text-center'>
                            Sử dụng tên người dùng và mật khẩu để đăng nhập
                        </p>
                        <form className='w-full space-y-6' onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor='username' className='text-gray-700 dark:text-gray-300 mb-1'>
                                    Tên người dùng
                                </Label>
                                <TextInput
                                    icon={CiUser}
                                    type='text'
                                    placeholder='Tên người dùng'
                                    id='username'
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor='password' className='text-gray-700 dark:text-gray-300 mb-1'>
                                    Mật khẩu
                                </Label>
                                <TextInput
                                    icon={GoLock}
                                    type='password'
                                    placeholder='Mật khẩu'
                                    id='password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className='flex items-center justify-end'>
                                <Link
                                    className='text-sm text-gray-500 hover:text-blue-600 hover:underline dark:text-blue-400'
                                    to='/forgot-password'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <Button disabled={loadingState} type='submit' color='blue' className='w-full'>
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
                        <div className='w-full mt-6'>
                            <div className='flex items-center justify-center gap-x-2 mb-4'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Bạn chưa có tài khoản?</span>
                                <Link
                                    to='/register'
                                    className='text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center'
                                >
                                    <TfiHandPointRight className='mr-1' /> Đăng ký ngay
                                </Link>
                            </div>
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-gray-300'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-2 bg-gray-50 dark:bg-gray-900 text-gray-500'>Hoặc</span>
                                </div>
                            </div>
                            <Button color={'gray'} className='w-full mt-3' onClick={() => loginGoogle()}>
                                <div className='flex items-center justify-center gap-x-2'>
                                    <FcGoogle />
                                    <span>Đăng nhập bằng Google</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className='hidden lg:block lg:w-1/2'>
                    <img
                        src={'../assets/login.webp'}
                        alt='Login'
                        className='w-full h-screen object-cover rounded-lg lg:rounded-none'
                    />
                </div>
            </div>
        </div>
    );
}
