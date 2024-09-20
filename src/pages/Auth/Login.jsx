import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { CiLogin, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { user_SignIn } from '../../redux/slices/userSlice';
import { TfiHandPointRight } from 'react-icons/tfi';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import { googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { FaFacebookF, FaGoogle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';
import { gapi } from 'gapi-script';

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

    // handle submit form login using basic auth: username and password
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
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
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
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
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    // Facebook Login
    const loginFacebook = () => {
        console.log('Login Facebook');
    };

    return (
        <div
            className='w-full p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
    bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900
    sm:h-auto min-h-[93vh] items-center justify-center'
        >
            {/* Form Section */}
            <div className='w-full sm:w-[50%] p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <span className='text-xl font-bold sm:text-2xl sm:font-semibold text-gray-800 dark:text-white text-center block'>
                    Đăng nhập
                </span>
                <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>
                    <div>
                        <Label
                            value='Tên người dùng'
                            className='text-gray-700 dark:text-gray-300'
                        />
                        <TextInput
                            icon={CiUser}
                            type='text'
                            placeholder='Tên người dùng'
                            id='username'
                            value={formData.username}
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label value='Mật khẩu' className='text-gray-700 dark:text-gray-300' />
                        <TextInput
                            icon={GoLock}
                            type='password'
                            placeholder='Mật khẩu'
                            id='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    {errorMessage && (
                        <Alert
                            className='mt-5 flex justify-center items-center font-bold text-red-600 dark:text-red-400'
                            color='failure'
                        >
                            {errorMessage}
                        </Alert>
                    )}
                    <Link
                        className='text-sm sm:text-black text-gray-500 dark:text-gray-300 font-semibold hover:underline hover:text-blue-500'
                        to='/forgot-password'
                    >
                        Quên mật khẩu?
                    </Link>

                    <Button
                        disabled={loadingState}
                        type='submit'
                        outline
                        className='w-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500
                        dark:from-slate-700 dark:via-slate-700 dark:to-zinc-700
                        text-gray-800 dark:text-gray-200 font-medium'
                    >
                        {loadingState ? (
                            <>
                                <Spinner size='sm' />
                                <span className='pl-3'>Đang xử lý...</span>
                            </>
                        ) : (
                            <span className='flex justify-center items-center gap-x-2 text-sm sm:text-lg'>
                                <CiLogin className='transition-transform duration-300 transform group-hover:-translate-x-2' />{' '}
                                Đăng nhập
                            </span>
                        )}
                    </Button>
                </form>
                <div className='w-full flex justify-between items-center mt-6'>
                    <div className='flex gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                        <span>Bạn chưa có tài khoản?</span>
                        <div className='flex justify-center items-center gap-x-2 hover:text-blue-600'>
                            <TfiHandPointRight />
                            <Link to='/register' className='dark:text-blue-400 hover:underline'>
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>
                    <div className='flex justify-center items-center gap-x-2'>
                        <span className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                            Tiếp tục với
                        </span>
                        <button
                            className='rounded-full dark:bg-white'
                            onClick={() => loginGoogle()}
                        >
                            <FcGoogle size={'30px'} />
                        </button>
                        <span className='text-sm font-semibold text-gray-600 dark:text-gray-400'>
                            hoặc
                        </span>
                        <button onClick={() => loginFacebook()}>
                            <img
                                src={'../assets/fb.png'}
                                alt='Button_Login_Facebook'
                                className='w-8 h-8 rounded-full'
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className='sm:w-[50%] w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <img
                    src='https://timex.com/cdn/shop/files/02617_WB23_July_alt_lifestyle_featured_image_TW2V49700_5bdba602-5733-4fb1-83ad-8297308ef20b.jpg?v=1689775668&width=990'
                    alt='Product Image'
                    className='w-full h-80 sm:w-[90vw] sm:h-[90vh] object-cover rounded-lg shadow-lg'
                />
            </div>
        </div>
    );
}
