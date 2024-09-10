import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CiLogin, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { GoLock } from 'react-icons/go';
import { IoIosSend } from 'react-icons/io';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PasswordStrengthMeter } from '../../components/exportComponent';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
        <div
            className='w-full p-5 sm:px-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-center
    bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-800 dark:to-gray-900
    sm:h-auto min-h-[93vh] items-center justify-center'
        >
            {/* Image Section */}
            <div className='hidden sm:block w-full sm:w-[50%] bg-white dark:bg-gray-800 shadow-lg rounded-lg'>
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
                            value={formData.username}
                            onChange={handleChange}
                            className='mt-1'
                        />
                    </div>
                    <div>
                        <Label value='Số điện thoại' className='text-gray-700 dark:text-gray-300' />
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
                    <PasswordStrengthMeter
                        password={formData.password}
                        strength={passwordStrength}
                    />
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

                <div className='mb-5 flex justify-end gap-2 text-sm md:text-xs lg:text-sm font-semibold mt-6 text-gray-600 dark:text-gray-400'>
                    <span className='sm:hidden md:block'>Bạn muốn mua đồng hồ giá tốt?</span>
                    <div className='flex justify-center items-center gap-x-2 hover:text-blue-600'>
                        <CiLogin className='sm:text-lg' />
                        <Link to='/login' className='dark:text-blue-400 hover:underline'>
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
