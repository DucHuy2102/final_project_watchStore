import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { TfiHandPointRight } from 'react-icons/tfi';
import { IoIosHome, IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';
import { Input } from 'antd';

export default function ForgotPassword() {
    // state
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loadingState, setLoadingState] = useState(false);

    // submit form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error('Vui lòng nhập email của bạn!');
            return;
        }
        try {
            setLoadingState(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/forgotPassword`, {
                email,
            });
            if (res?.status === 200) {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div className='h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900'>
            <div className='w-full min-h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-12 relative'>
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2'></div>
                </div>

                <div className='absolute top-5 left-10'>
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

                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center relative z-10'>
                    <div className='w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/20'>
                        {!isSubmitted ? (
                            <>
                                <div className='flex flex-col items-center mb-8'>
                                    <div className='w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-spin-slow'>
                                        <FaEnvelope className='h-8 w-8 text-white animate-spin-reverse-slow' />
                                    </div>
                                    <h2 className='text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-3 text-center'>
                                        Quên mật khẩu
                                    </h2>
                                    <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-sm'>
                                        Vui lòng nhập email của bạn để đặt lại mật khẩu
                                    </p>
                                </div>

                                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor='email' className='block text-gray-700 dark:text-gray-300 mb-2'>
                                            Email
                                        </label>
                                        <Input
                                            prefix={<FaEnvelope className='text-gray-600 mr-1' />}
                                            placeholder='Nhập email của bạn'
                                            type='email'
                                            autoFocus
                                            id='email'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='!ring-0 !border-gray-300 h-10'
                                        />
                                    </div>

                                    <Button
                                        type='submit'
                                        className='group w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:!ring-0'
                                    >
                                        {loadingState ? (
                                            <>
                                                <Spinner size='sm' />
                                                <span className='pl-3'>Đang xử lý...</span>
                                            </>
                                        ) : (
                                            <span className='flex justify-center items-center gap-x-2 text-base font-medium'>
                                                <IoIosSend className='transition-all duration-300 transform group-hover:-translate-x-1' />
                                                Gửi yêu cầu
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center p-4'>
                                <div className='w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto my-6 shadow-lg transform rotate-12 hover:rotate-0 transition-all duration-300'>
                                    <a href='https://mail.google.com' target='_blank' rel='noopener noreferrer'>
                                        <FaEnvelope className='h-12 w-12 text-white transform -rotate-12 hover:rotate-0 transition-all' />
                                    </a>
                                </div>
                                <span className='text-xl font-bold sm:text-2xl bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent text-center block mb-6'>
                                    Đã gửi yêu cầu thành công!
                                </span>
                                <p className='text-gray-600 text-md font-medium max-w-md text-center dark:text-gray-300 mb-6'>
                                    Nếu tài khoản với địa chỉ email{' '}
                                    <strong className='text-blue-600 dark:text-blue-400'>{email}</strong> tồn tại, bạn
                                    sẽ nhận được liên kết đặt lại mật khẩu qua email.
                                </p>
                                <Button
                                    onClick={() => window.open('https://mail.google.com', '_blank')}
                                    className='group w-full px-24 sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:!ring-0'
                                >
                                    <span className='flex justify-center items-center gap-x-2 text-base font-medium'>
                                        <FaEnvelope className='transition-all duration-300 transform group-hover:-translate-y-0.5' />
                                        Mở Gmail
                                    </span>
                                </Button>
                            </div>
                        )}

                        <div className='mt-8 flex flex-col items-center gap-4'>
                            <div className='w-full h-[1px] bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent'></div>
                            <Link
                                to='/login'
                                className='group flex items-center gap-3 px-24 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-600'
                            >
                                <TfiHandPointRight className='text-blue-600 dark:text-blue-400 transition-transform duration-300 transform group-hover:translate-x-1' />
                                <span className='text-gray-700 dark:text-gray-200 font-medium'>Trang đăng nhập</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='hidden lg:block lg:w-1/2 cursor-pointer'>
                    <img
                        src={'../assets/forgot_password.jpg'}
                        alt='Forgot Password'
                        className='w-full h-screen object-cover rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500'
                    />
                </div>
            </div>
        </div>
    );
}
