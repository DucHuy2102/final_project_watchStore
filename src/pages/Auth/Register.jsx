import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CiLogin, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { IoIosCart, IoIosHome, IoIosSend } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PasswordStrengthMeter } from '../../components/exportComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { TfiHandPointRight } from 'react-icons/tfi';
import { FcGoogle } from 'react-icons/fc';
import { MdHomeRepairService, MdWatch } from 'react-icons/md';

// handle change phone input
const handlePhoneChange = (phone) => {
    return phone.startsWith('84') ? phone.replace(/^84/, '0') : phone;
};

export default function Register() {
    // state
    const { pathname } = useLocation();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loadingState, setLoadingState] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const dispatch = useDispatch();
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
            setErrorMessage('Vui lòng nhập đầy đủ thông tin!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        if (passwordStrength < 3) {
            setErrorMessage('Mật khẩu quá yếu, vui lòng chọn mật khẩu khác!');
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
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
                setErrorMessage('Email đã tồn tại! Vui lòng chọn email khác!');
            } else {
                setErrorMessage('Đã xảy ra lỗi, vui lòng thử lại sau!');
            }
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            console.log(error);
        } finally {
            setLoadingState(false);
        }
    };

    return (
        <div className='w-full h-screen'>
            <div className='w-full h-screen flex flex-col md:flex-row items-center justify-center lg:gap-x-5 relative'>
                <div className='hidden lg:block lg:w-1/2'>
                    <img
                        src={'../assets/register.webp'}
                        alt='Login'
                        className='w-full h-screen object-cover rounded-lg lg:rounded-none'
                    />
                </div>

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
                    <div className='flex flex-col items-center justify-center w-full md:max-w-2xl lg:max-w-full p-10 mt-10'>
                        <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>
                            Tạo tài khoản mới
                        </h2>

                        <form className='w-full space-y-4' onSubmit={handleSubmit}>
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
                            {/* <div>
                                <Label
                                    value='Số điện thoại'
                                    className='text-gray-700 dark:text-gray-300'
                                />
                                <PhoneInput
                                    country={'vn'}
                                    value={formData.phone}
                                    onChange={(phone) => setFormData({ ...formData, phone })}
                                    className='mt-1 custom-phone-input'
                                    inputProps={{
                                        required: true,
                                    }}
                                    inputStyle={{
                                        width: '100%',
                                        height: '42px',
                                        fontSize: '0.9rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '0.375rem',
                                        color: '#1f2937',
                                        backgroundColor: '#f9fafb',
                                    }}
                                />
                            </div> */}
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
                                <Label
                                    value='Mật khẩu'
                                    className='text-gray-700 dark:text-gray-300'
                                />
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
                            <PasswordStrengthMeter
                                password={formData.password}
                                strength={passwordStrength}
                            />

                            <Button
                                disabled={loadingState}
                                type='submit'
                                color='blue'
                                className='w-full'
                            >
                                {loadingState ? (
                                    <>
                                        <Spinner size='sm' />
                                        <span className='pl-3'>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <span className='flex justify-center items-center gap-x-2 text-sm sm:text-lg'>
                                        <IoIosSend className='transition-transform duration-300 transform group-hover:-translate-x-2' />
                                        Đăng ký tài khoản
                                    </span>
                                )}
                            </Button>
                        </form>
                        <div className='w-full mt-6'>
                            <div className='flex items-center justify-center gap-x-2 mb-4'>
                                <span className='text-sm text-gray-600 dark:text-gray-400'>
                                    Bạn muốn đăng nhập?
                                </span>
                                <Link
                                    to='/login'
                                    className='text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center'
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
