import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { CiMail } from 'react-icons/ci';
import { TfiHandPointRight } from 'react-icons/tfi';
import { IoIosCart, IoIosHome, IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import axios from 'axios';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';

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
        <div className='w-full h-screen'>
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-5 relative'>
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center'>
                    <div className='flex justify-center items-center gap-x-3 md:gap-x-16 absolute top-10 lg:top-5 lg:gap-x-24'>
                        <Link
                            to={'/'}
                            className='flex items-center justify-start gap-x-1 text-sm lg:text-md lg:font-bold font-medium cursor-pointer hover:underline hover:text-blue-500'
                        >
                            <IoIosHome />
                            <span>Trang chủ</span>
                        </Link>
                        <Link
                            to={'/products'}
                            className='flex items-center justify-start gap-x-1 text-sm lg:text-md lg:font-bold font-medium cursor-pointer hover:underline hover:text-blue-500'
                        >
                            <MdWatch />
                            <span>Sản phẩm</span>
                        </Link>
                        <Link
                            to={'/cart'}
                            className='flex items-center justify-start gap-x-1 text-sm lg:text-md lg:font-bold font-medium cursor-pointer hover:underline hover:text-blue-500'
                        >
                            <IoIosCart />
                            <span>Giỏ hàng</span>
                        </Link>
                        <Link
                            to={'/services'}
                            className='flex items-center justify-start gap-x-1 text-sm lg:text-md lg:font-bold font-medium cursor-pointer hover:underline hover:text-blue-500'
                        >
                            <MdHomeRepairService />
                            <span>Dịch vụ</span>
                        </Link>
                    </div>
                    <div className='w-full p-8 rounded-lg'>
                        {!isSubmitted ? (
                            <>
                                <h2 className='text-2xl font-bold md:text-3xl text-gray-800 dark:text-white mb-2 text-center'>
                                    Quên mật khẩu
                                </h2>
                                <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 text-center'>
                                    Vui lòng nhập email của bạn để đặt lại mật khẩu
                                </p>
                                <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>
                                    <div>
                                        <Label value='Email của bạn' className='text-gray-700 dark:text-gray-300' />
                                        <TextInput
                                            icon={CiMail}
                                            type='email'
                                            placeholder='Email'
                                            id='username'
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='mt-1'
                                        />
                                    </div>

                                    <Button type='submit' color={'blue'} className='group w-full focus:!ring-0'>
                                        {loadingState ? (
                                            <>
                                                <Spinner size='sm' />
                                                <span className='pl-3'>Đang xử lý...</span>
                                            </>
                                        ) : (
                                            <span className='flex justify-center items-center gap-x-2 text-sm sm:text-lg'>
                                                <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />{' '}
                                                Gửi yêu cầu
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className='flex flex-col justify-center items-center'>
                                <span className='text-xl font-bold sm:text-2xl sm:font-semibold text-gray-800 dark:text-white text-center block'>
                                    Đã gửi yêu cầu thành công!
                                </span>
                                <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto my-4'>
                                    <a href='https://mail.google.com' target='_blank' rel='noopener noreferrer'>
                                        <CiMail className='h-8 w-8 text-white' />
                                    </a>
                                </div>
                                <p className='text-gray-500 text-md font-semibold w-[32vw] text-center dark:text-gray-300'>
                                    Nếu tài khoản với địa chỉ email <strong>{email}</strong> tồn tại, bạn sẽ nhận được
                                    liên kết đặt lại mật khẩu được gửi qua email của bạn.
                                </p>
                            </div>
                        )}

                        <div className='flex items-center justify-center mt-10 gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400'>
                            <span>Trở lại {isSubmitted ? 'trang đăng nhập?' : 'trang trước?'}</span>
                            <div className='flex justify-center items-center gap-x-2 hover:text-blue-600'>
                                <TfiHandPointRight />
                                <Link
                                    to='/login'
                                    className='dark:text-blue-400 text-blue-500 hover:text-blue-600 hover:underline'
                                >
                                    Trang đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='hidden lg:block lg:w-1/2'>
                    <img
                        src={'../assets/forgot_password.jpg'}
                        alt='Login'
                        className='w-full h-screen object-cover rounded-lg lg:rounded-none'
                    />
                </div>
            </div>
        </div>
    );
}
