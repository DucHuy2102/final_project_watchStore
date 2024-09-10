import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { CiMail } from 'react-icons/ci';
import { TfiHandPointRight } from 'react-icons/tfi';
import { IoIosSend } from 'react-icons/io';
import { toast } from 'react-toastify';

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
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitted(true);
        }
    };

    return (
        <div
            className='w-full px-5 py-5 sm:py-0 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
    bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900
    sm:h-auto min-h-[93vh] items-center justify-center'
        >
            {/* Form Section */}
            <div className='w-full sm:w-[50%] p-8 bg-white dark:bg-gray-800 shadow-md rounded-lg'>
                {!isSubmitted ? (
                    <>
                        <span className='text-xl font-bold sm:text-2xl sm:font-semibold text-gray-800 dark:text-white text-center block'>
                            Quên mật khẩu
                        </span>
                        <span className='text-sm sm:text-lg text-gray-500 dark:text-white text-center block'>
                            Hãy nhập email của bạn để lấy lại mật khẩu
                        </span>
                        <form className='flex flex-col gap-6 mt-6' onSubmit={handleSubmit}>
                            <div>
                                <Label
                                    value='Email của bạn'
                                    className='text-gray-700 dark:text-gray-300'
                                />
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
                        <div className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <a
                                href='https://mail.google.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <CiMail className='h-8 w-8 text-white' />
                            </a>
                        </div>
                        <p className='text-gray-500 text-md w-[32vw] text-center dark:text-gray-300'>
                            Nếu tài khoản với địa chỉ email <strong>{email}</strong> tồn tại, bạn sẽ
                            nhận được liên kết đặt lại mật khẩu sớm.
                        </p>
                    </div>
                )}

                <div className='flex gap-2 text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400'>
                    <span>Trở lại {isSubmitted ? 'trang đăng nhập?' : 'trang trước?'}</span>
                    <div className='flex justify-center items-center gap-x-2 hover:text-blue-600'>
                        <TfiHandPointRight />
                        <Link to='/login' className='dark:text-blue-400 hover:underline'>
                            Trang đăng nhập
                        </Link>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div className='sm:w-[50%] w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
                <img
                    src={'../assets/forgot_password.jpg'}
                    alt='Product Image'
                    className='w-full h-80 sm:w-[90vw] sm:h-[90vh] object-cover rounded-lg shadow-lg'
                />
            </div>
        </div>
    );
}
