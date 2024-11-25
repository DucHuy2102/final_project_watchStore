import { Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CiMail, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { IoIosHome, IoIosSend } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { PasswordStrengthMeter } from './components/exportCom_Auth';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-phone-input-2/lib/style.css';
import { TfiHandPointRight } from 'react-icons/tfi';

// handle change phone input
const handlePhoneChange = (phone) => {
    return phone.startsWith('84') ? phone.replace(/^84/, '0') : phone;
};

export default function Register() {
    // state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
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

    // handle change input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        if (e.target.id === 'password') {
            setPasswordStrength(getStrength(e.target.value));
        }
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || !formData.phone || !formData.password) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (passwordStrength < 3) {
            toast.error('Mật khẩu quá yếu, vui lòng chọn mật khẩu khác!');
            return;
        }

        const newPhone = handlePhoneChange(formData.phone);
        const newFormData = { ...formData, phone: newPhone };

        try {
            setLoadingState(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/register`, newFormData);
            if (res?.status === 200) {
                toast.success('Đăng ký tài khoản thành công!');
                setTimeout(() => {
                    navigate('/verify-email');
                }, 3000);
            }
        } catch (error) {
            const { response } = error;
            if (response?.status === 400) {
                toast.error('Email đã tồn tại! Vui lòng chọn email khác!');
            } else {
                toast.error('Đã xảy ra lỗi, vui lòng thử lại sau!');
            }
            console.log(error);
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div className='w-full h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-10 relative'>
                <div className='hidden lg:block lg:w-1/2 h-screen'>
                    <div className='relative h-full w-full'>
                        <img
                            src={'../assets/register.webp'}
                            alt='Register'
                            className='w-full h-full object-cover rounded-r-[40px] shadow-2xl transform hover:scale-105 
                            transition-all duration-700 animate-ken-burns'
                        />
                    </div>
                </div>
                <div className='w-full lg:w-1/2 flex flex-col items-center justify-center'>
                    <div className='absolute top-6 right-6'>
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

                    <div className='flex flex-col items-center justify-center w-full md:max-w-2xl lg:max-w-full p-10 mt-10'>
                        <h2
                            className='text-3xl font-bold md:text-4xl text-gray-800 dark:text-white
                            bg-gradient-to-r from-blue-600 to-purple-600 h-12 bg-clip-text text-transparent'
                        >
                            Tạo tài khoản mới
                        </h2>
                        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 text-center'>
                            Điền thông tin của bạn để tạo tài khoản
                        </p>

                        <form
                            className='w-full max-w-md space-y-6 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl'
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <Label value='Tên người dùng' className='text-gray-700 dark:text-gray-300' />
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
                                <Label value='Email' className='text-gray-700 dark:text-gray-300' />
                                <TextInput
                                    icon={CiMail}
                                    type='text'
                                    placeholder='Địa chỉ email'
                                    id='email'
                                    value={formData.email}
                                    onChange={handleChange}
                                    className='mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
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
                            <PasswordStrengthMeter password={formData.password} strength={passwordStrength} />

                            <Button
                                disabled={loadingState}
                                type='submit'
                                color='blue'
                                className='focus:!ring-0 w-full rounded-xl py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                            >
                                {loadingState ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='ml-2'>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <span className='flex justify-center items-center gap-x-2'>
                                        <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />
                                        Đăng ký tài khoản
                                    </span>
                                )}
                            </Button>
                        </form>

                        <div className='w-full max-w-md mt-6'>
                            <div className='flex items-center justify-center gap-x-2 mb-4'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>Bạn đã có tài khoản?</span>
                                <Link
                                    to='/login'
                                    className='text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 
                                    flex items-center font-medium transition-colors duration-300'
                                >
                                    <TfiHandPointRight className='mr-1' /> Đăng nhập ngay
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className='w-full h-screen'>
    //         <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-5'>
    //             <div className='hidden lg:block lg:w-1/2'>
    //                 <img
    //                     src={'../assets/register.webp'}
    //                     alt='Login'
    //                     className='w-full h-screen object-cover rounded-lg lg:rounded-none'
    //                 />
    //             </div>

    //             <div className='w-full lg:w-1/2 flex flex-col items-center justify-center relative'>
    //                 <div className='absolute -top-2 left-6'>
    //                     <Link
    //                         to={'/'}
    //                         className='flex items-center gap-2 px-4 py-2 hover:text-blue-500 text-gray-700
    //                     dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 group'
    //                     >
    //                         <IoIosHome className='text-xl group-hover:scale-110 transition-transform duration-300' />
    //                         <span className='font-medium'>Quay lại trang chủ</span>
    //                     </Link>
    //                 </div>
    //                 <div className='flex flex-col items-center justify-center w-full md:max-w-2xl lg:max-w-full p-10 mt-10'>
    //                     <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>Tạo tài khoản mới</h2>

    //                     <form className='w-full space-y-4' onSubmit={handleSubmit}>
    //                         <div>
    //                             <Label value='Tên người dùng' className='text-gray-700 dark:text-gray-300' />
    //                             <TextInput
    //                                 icon={CiUser}
    //                                 type='text'
    //                                 placeholder='Tên người dùng'
    //                                 id='username'
    //                                 value={formData.username}
    //                                 onChange={handleChange}
    //                                 className='mt-1'
    //                             />
    //                         </div>
    //                         <div>
    //                             <Label value='Email' className='text-gray-700 dark:text-gray-300' />
    //                             <TextInput
    //                                 icon={CiMail}
    //                                 type='text'
    //                                 placeholder='Địa chỉ email'
    //                                 id='email'
    //                                 value={formData.email}
    //                                 onChange={handleChange}
    //                                 className='mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
    //                             />
    //                         </div>
    //                         <div>
    //                             <Label value='Mật khẩu' className='text-gray-700 dark:text-gray-300' />
    //                             <TextInput
    //                                 icon={GoLock}
    //                                 type='password'
    //                                 placeholder='Mật khẩu'
    //                                 id='password'
    //                                 value={formData.password}
    //                                 onChange={handleChange}
    //                                 className='mt-1'
    //                             />
    //                         </div>
    //                         <PasswordStrengthMeter password={formData.password} strength={passwordStrength} />

    //                         <Button disabled={loadingState} type='submit' color='blue' className='focus:!ring-0 w-full'>
    //                             {loadingState ? (
    //                                 <>
    //                                     <Spinner size='sm' />
    //                                     <span className='pl-3'>Đang xử lý...</span>
    //                                 </>
    //                             ) : (
    //                                 <span className='flex justify-center items-center gap-x-2 text-sm sm:text-lg'>
    //                                     <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />
    //                                     Đăng ký tài khoản
    //                                 </span>
    //                             )}
    //                         </Button>
    //                     </form>
    //                     <div className='w-full mt-6'>
    //                         <div className='flex items-center justify-center gap-x-2 mb-4'>
    //                             <span className='text-sm text-gray-600 dark:text-gray-400'>Bạn muốn đăng nhập?</span>
    //                             <Link
    //                                 to='/login'
    //                                 className='text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center'
    //                             >
    //                                 <TfiHandPointRight className='mr-1' /> Trang đăng nhập
    //                             </Link>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
}
