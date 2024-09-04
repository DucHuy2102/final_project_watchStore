import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
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
                        <Label
                            value='Tên người dùng'
                            className='text-gray-700 dark:text-gray-300'
                        />
                        <TextInput
                            type='text'
                            placeholder='Tên người dùng'
                            id='email'
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label value='Mật khẩu' className='text-gray-700 dark:text-gray-300' />
                        <TextInput
                            type='password'
                            placeholder='Mật khẩu'
                            id='password'
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <Button
                        disabled={loadingState}
                        type='submit'
                        className='w-full bg-gradient-to-r from-[#44cdc4] via-[#86A8E7] to-[#D16BA5]
                        hover:from-[#3cbab2] hover:via-[#7a9ed9] hover:to-[#c65491] text-white font-medium rounded-md py-3'
                    >
                        {loadingState ? (
                            <>
                                <Spinner size='sm' />
                                <span className='pl-3'>Đang xử lý...</span>
                            </>
                        ) : (
                            'Đăng nhập'
                        )}
                    </Button>
                </form>

                <div className='flex gap-2 text-sm mt-6 text-gray-600 dark:text-gray-400'>
                    <span>Bạn chưa có tài khoản?</span>
                    <Link to='/sign-up' className='text-blue-600 dark:text-blue-400'>
                        Đăng ký ngay
                    </Link>
                </div>

                {errorMessage && (
                    <Alert
                        className='mt-5 flex justify-center items-center font-bold text-red-600 dark:text-red-400'
                        color='failure'
                    >
                        {errorMessage}
                    </Alert>
                )}
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
