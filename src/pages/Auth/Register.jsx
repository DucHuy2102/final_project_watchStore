import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { CiMail, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { IoIosSend } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { PasswordStrengthMeter } from '../../components/exportComponent';
import axios from 'axios';

export default function Login() {
    // state
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loadingState, setLoadingState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // handle change input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }
        try {
            setLoadingState(true);
            console.log(formData);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
        } catch (error) {
            setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        } finally {
            setLoadingState(false);
            setFormData({ username: '', email: '', password: '' });
        }
    };
    return (
        <div
            className='w-full p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
            bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900'
        >
            {/* Image Section */}
            <div className='hidden sm:block sm:w-[50%] bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <img
                    src='https://timex.com/cdn/shop/files/4812_TX_TC23_featured-collectionTW2W51400.jpg?v=1710247987&width=768'
                    alt='Product Image'
                    className='w-[90vw] h-[90vh] object-cover rounded-lg shadow-lg'
                />
            </div>

            {/* Form Section */}
            <div className='w-full sm:w-[50%] px-8 pt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <span className='text-xl font-bold sm:text-2xl sm:font-semibold text-gray-800 dark:text-white text-center block'>
                    Đăng ký tài khoản
                </span>
                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
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
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label value='Email' className='text-gray-700 dark:text-gray-300' />
                        <TextInput
                            icon={CiMail}
                            type='text'
                            placeholder='Địa chỉ email'
                            id='email'
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
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <PasswordStrengthMeter password={formData.password} />
                    {errorMessage && (
                        <Alert
                            className='mt-5 flex justify-center items-center font-bold text-red-600 dark:text-red-400'
                            color='failure'
                        >
                            {errorMessage}
                        </Alert>
                    )}
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
                                <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />{' '}
                                Đăng ký
                            </span>
                        )}
                    </Button>
                </form>

                <div className='mb-5 flex justify-end gap-2 text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400'>
                    <span>Bạn muốn mua đồng hồ giá tốt?</span>
                    <Link to='/login' className='text-blue-600 dark:text-blue-400 hover:underline'>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
}
