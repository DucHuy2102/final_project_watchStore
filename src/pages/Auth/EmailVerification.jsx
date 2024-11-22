import { motion } from 'framer-motion';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoIosHome } from 'react-icons/io';

export default function EmailVerification() {
    // states
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // auto focus first input
    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    // handle paste function
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();

        if (/^\d+$/.test(pastedData) && pastedData.length === 6) {
            const digits = pastedData.split('');
            setCode(digits);
            inputRefs.current[5].focus();
        }
    };

    // handle change function
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle key down function
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();

            if (code[index]) {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
                return;
            }

            if (index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                inputRefs.current[index - 1].focus();
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (e.key === 'ArrowRight' && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-user`, {
                code: verificationCode,
            });
            if (res?.status === 200) {
                toast.success('Xác thực thành công');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // handle clear all function
    const handleClearAll = () => {
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0].focus();
    };

    return (
        <div className='min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-emerald-900'>
            <div className='w-full min-h-screen flex items-center justify-center relative p-6'>
                {/* Decorative background elements */}
                <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
                    <div className='absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2'></div>
                    <div className='absolute bottom-0 right-0 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl opacity-30 translate-x-1/2 translate-y-1/2'></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className='w-full max-w-md relative z-10'
                >
                    <div className='p-8 bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-700'>
                        <div className='relative mb-8'>
                            <Link
                                to={'/'}
                                className='absolute -top-2 -left-2 p-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl hover:shadow-lg transition-all duration-300 group hover:from-emerald-500 hover:to-green-500'
                            >
                                <IoIosHome
                                    className='text-white transform group-hover:scale-110 transition-transform duration-300'
                                    size={22}
                                />
                            </Link>

                            <div className='w-16 h-16 bg-gradient-to-tr from-emerald-600 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform rotate-12'>
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                                    className='text-white text-2xl font-bold transform -rotate-12'
                                >
                                    ✓
                                </motion.div>
                            </div>

                            <h2 className='text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-3'>
                                Xác thực Email
                            </h2>
                            <p className='text-gray-300 text-center text-sm'>
                                Nhập mã xác thực đã được gửi đến email của bạn
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-8'>
                            <div className='relative'>
                                <div className='flex justify-between items-center gap-3'>
                                    {code.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type='text'
                                            value={digit}
                                            maxLength={1}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            onPaste={index === 0 ? handlePaste : undefined}
                                            className='w-12 h-14 text-center text-2xl font-bold bg-gray-700/50 text-emerald-400 border-2 border-gray-600 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md hover:border-emerald-400'
                                        />
                                    ))}
                                </div>

                                {code.some((digit) => digit) && (
                                    <motion.button
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        type='button'
                                        onClick={handleClearAll}
                                        className='absolute -top-5 -right-5 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 hover:text-white transition-all duration-300 group'
                                    >
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            className='h-5 w-5 transform group-hover:scale-110 transition-transform duration-300'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            stroke='currentColor'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M6 18L18 6M6 6l12 12'
                                            />
                                        </svg>
                                    </motion.button>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type='submit'
                                disabled={isLoading || code.some((digit) => !digit)}
                                className='w-full group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium py-3.5 px-4 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isLoading ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className='text-white'
                                        >
                                            ◌
                                        </motion.div>
                                        Đang xác thực...
                                    </span>
                                ) : (
                                    <span className='flex items-center justify-center gap-2'>
                                        Xác thực
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        <div className='mt-6 text-center'>
                            <button className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors duration-300'>
                                Gửi lại mã xác thực
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
