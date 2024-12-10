import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { TfiHandPointRight } from 'react-icons/tfi';
import { IoIosHome, IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';
import { PasswordStrengthMeter } from './components/exportCom_Auth';
import axios from 'axios';
import { Input } from 'antd';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password || !verifyPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        if (password !== verifyPassword) {
            toast.error('Mật khẩu không khớp!');
            setPassword('');
            setVerifyPassword('');
            return;
        }
        try {
            setLoadingState(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
                code: token,
                newPassword: password,
            });
            if (res?.status === 200) {
                toast.success('Đặt lại mật khẩu thành công!');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div className='w-full h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-10 relative'>
                <div className='hidden lg:block lg:w-1/2 h-screen'>
                    <div className='relative h-full w-full'>
                        <img
                            src={'../assets/reset_password.jpg'}
                            alt='Reset Password'
                            className='w-full h-full object-cover rounded-r-[40px] shadow-2xl transform hover:scale-105 
                            transition-all duration-700 animate-ken-burns'
                        />
                    </div>
                </div>
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center'>
                    <div className='absolute top-6 left-6'>
                        <Link
                            to={'/'}
                            className='flex items-center gap-2 px-6 py-2.5 text-gray-700 
                            bg-transparent hover:bg-gray-100 backdrop-blur-sm
                            rounded-tl-3xl rounded-br-3xl shadow-lg hover:shadow-xl
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
                            Đặt lại mật khẩu
                        </h2>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 text-center'>
                            Hãy chọn mật khẩu mới cho tài khoản của bạn
                        </p>

                        <form
                            className='w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl'
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label htmlFor='password' className='block text-gray-700 dark:text-gray-300 mb-2'>
                                    Mật khẩu mới
                                </label>
                                <Input.Password
                                    prefix={<FaLock className='text-gray-600 mr-1' />}
                                    type='password'
                                    placeholder='Nhập mật khẩu mới'
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setPasswordStrength(getStrength(e.target.value));
                                    }}
                                    className='!ring-0 !border-gray-300 h-10'
                                    autoFocus
                                />
                            </div>
                            <PasswordStrengthMeter password={password} strength={passwordStrength} />
                            <div>
                                <label htmlFor='verifyPassword' className='block text-gray-700 dark:text-gray-300 mb-2'>
                                    Xác nhận mật khẩu
                                </label>
                                <Input.Password
                                    prefix={<FaLock className='text-gray-600 mr-1' />}
                                    type='password'
                                    placeholder='Xác nhận mật khẩu mới'
                                    value={verifyPassword}
                                    onChange={(e) => setVerifyPassword(e.target.value)}
                                    className='!ring-0 !border-gray-300 h-10'
                                />
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
                                    <span className='flex justify-center items-center gap-x-2'>
                                        <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />
                                        Cập nhật mật khẩu mới
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className='w-full max-w-md mt-6'>
                            <div className='flex items-center justify-center gap-x-2 mb-4'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    Bạn không muốn đặt lại mật khẩu?
                                </span>
                                <Link
                                    to='/login'
                                    className='text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 
                                    flex items-center font-medium transition-colors duration-300'
                                >
                                    <TfiHandPointRight className='mr-1' /> Trang đăng nhập
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
