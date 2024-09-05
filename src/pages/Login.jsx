import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { CiLogin, CiMail, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { Link } from 'react-router-dom';

export default function Login() {
    // state
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loadingState, setLoadingState] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // handle change input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }
        try {
            setLoadingState(true);
            console.log(formData);
        } catch (error) {
            setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại sau!');
            console.log(error);
        } finally {
            setLoadingState(false);
        }
    };
    return (
        <div
            className='w-full p-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
            bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900'
        >
            {/* Form Section */}
            <div className='w-full sm:w-[50%] p-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <span className='text-xl font-bold sm:text-2xl sm:font-semibold text-gray-800 dark:text-white text-center block'>
                    Đăng nhập
                </span>
                <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>
                    <div>
                        <Label value='Email' className='text-gray-700 dark:text-gray-300' />
                        <TextInput
                            icon={CiMail}
                            type='text'
                            placeholder='Đại chỉ email'
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
                                <CiLogin className='transition-transform duration-300 transform group-hover:-translate-x-2' />{' '}
                                Đăng nhập
                            </span>
                        )}
                    </Button>
                </form>

                <div className='flex gap-2 text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400'>
                    <span>Bạn chưa có tài khoản?</span>
                    <Link
                        to='/register'
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                    >
                        Đăng ký ngay
                    </Link>
                </div>
            </div>

            {/* Image Section */}
            <div className='hidden sm:block sm:w-[50%] bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <img
                    src='https://timex.com/cdn/shop/files/02617_WB23_July_alt_lifestyle_featured_image_TW2V49700_5bdba602-5733-4fb1-83ad-8297308ef20b.jpg?v=1689775668&width=990'
                    alt='Product Image'
                    className='w-[90vw] h-[90vh] object-cover rounded-lg shadow-lg'
                />
            </div>
        </div>
    );
}
