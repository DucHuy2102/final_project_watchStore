import axios from 'axios';
import { Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { BsHouse } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function EmailVerification() {
    // states
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // input refs
    const inputRefs = useRef([]);

    // auto focus first input
    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    // handle change function
    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        setCode((prev) => {
            const newCode = [...prev];
            newCode[index] = value;
            return newCode;
        });
        if (value && index < code.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle key down function
    const handleKeyDown = (index, e) => {
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        } else if (
            (e.key === ' ' || e.key === 'ArrowRight') &&
            index < code.length - 1 &&
            code[index] !== ''
        ) {
            inputRefs.current[index + 1].focus();
        }
    };

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        try {
            setIsLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-email`, {
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
            setCode(['', '', '', '', '', '']);
        }
    };
    return (
        <div className='w-full h-[92vh] bg-gray-100 flex justify-center items-center px-4 md:px-0'>
            <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-600 p-6 md:p-8'>
                <div className='relative'>
                    <Link className='absolute hover:text-emerald-600 top-2 left-2' to={'/'}>
                        <BsHouse className='text-emerald-500 cursor-pointer' size={25} />
                    </Link>
                    <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                        Xác thực Email
                    </h2>
                </div>
                <p className='text-center text-gray-700 dark:text-gray-300 mb-6'>
                    Nhập mã xác thực đã được gửi đến email của bạn
                </p>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div className='flex justify-center items-center space-x-2 sm:space-x-4'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type='text'
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='w-12 h-12 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
                            />
                        ))}
                    </div>

                    <Button
                        type='submit'
                        disabled={isLoading || code.some((digit) => !digit)}
                        className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </Button>
                </form>
            </div>
        </div>
    );

    // return (
    //     <div className='w-full h-[90vh] flex justify-center items-center'>
    //         <div className='max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border dark:border-gray-500 p-8'>
    //             <div className='relative'>
    //                 <Link className='absolute top-2' to={'/'}>
    //                     <BsHouse className='text-emerald-500 cursor-pointer' size={25} />
    //                 </Link>
    //                 <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
    //                     Xác thực Email
    //                 </h2>
    //             </div>
    //             <p className='text-center text-gray-700 dark:text-gray-300 mb-6'>
    //                 Nhập mã xác thực đã được gửi đến email của bạn
    //             </p>

    //             <form onSubmit={handleSubmit} className='space-y-6'>
    //                 <div className='flex justify-between items-center'>
    //                     {code.map((digit, index) => (
    //                         <input
    //                             key={index}
    //                             ref={(el) => (inputRefs.current[index] = el)}
    //                             type='text'
    //                             value={digit}
    //                             maxLength={1}
    //                             onChange={(e) => handleChange(index, e.target.value)}
    //                             onKeyDown={(e) => handleKeyDown(index, e)}
    //                             className='w-12 h-12 text-center text-2xl font-bold bg-white dark:bg-gray-500 dark:border-none text-black dark:text-white
    //                             border-2 border-gray-300 rounded-lg focus:outline-none'
    //                         />
    //                     ))}
    //                 </div>

    //                 <Button
    //                     type='submit'
    //                     disabled={isLoading || code.some((digit) => !digit)}
    //                     className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
    //                 >
    //                     {isLoading ? 'Đang xác thực...' : 'Xác thực'}
    //                 </Button>
    //             </form>
    //         </div>
    //     </div>
    // );
}
