import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { TfiHandPointRight } from 'react-icons/tfi';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';
import { GoLock } from 'react-icons/go';
import { PasswordStrengthMeter } from '../../components/exportComponent';
import axios from 'axios';

export default function ResetPassword() {
    // state
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    // get strength of password
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    // submit form function
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
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div
            className='w-full px-5 py-5 sm:py-0 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
    bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900
    sm:h-auto min-h-[93vh] items-center justify-center'
        >
            {/* Image Section */}
            <div className='sm:w-[50%] w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <img
                    src={'../assets/reset_password.jpg'}
                    alt='Product Image'
                    className='w-full h-80 sm:w-[90vw] sm:h-[90vh] object-cover rounded-lg shadow-lg'
                />
            </div>
            {/* Form Section */}
            <div className='w-full border border-t-2 dark:border-gray-700 sm:w-[50%] p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
                <span className='text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white text-center block'>
                    Đặt lại mật khẩu
                </span>
                <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>
                    <div>
                        <Label value='Mật khẩu' className='text-gray-700 dark:text-gray-300' />
                        <TextInput
                            icon={GoLock}
                            type='password'
                            placeholder='Mật khẩu'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordStrength(getStrength(e.target.value));
                            }}
                            className='mt-1'
                        />
                    </div>
                    <PasswordStrengthMeter password={password} strength={passwordStrength} />
                    <div>
                        <Label
                            value='Xác nhận mật khẩu'
                            className='text-gray-700 dark:text-gray-300'
                        />
                        <TextInput
                            icon={GoLock}
                            type='password'
                            placeholder='Hãy nhập lại mật khẩu'
                            value={verifyPassword}
                            onChange={(e) => setVerifyPassword(e.target.value)}
                            className='mt-1'
                        />
                    </div>

                    <Button
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
                            <span className='flex justify-center items-center gap-x-2 text-sm'>
                                <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />{' '}
                                Cập nhật mật khẩu mới
                            </span>
                        )}
                    </Button>
                </form>

                <div className='flex gap-2 text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400'>
                    <span>Hủy thao tác?</span>
                    <div className='flex justify-center items-center gap-x-2 hover:text-blue-600'>
                        <TfiHandPointRight />
                        <Link to='/login' className='dark:text-blue-400 hover:underline'>
                            Trang đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
