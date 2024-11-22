import { FaPhoneAlt, FaShieldAlt } from 'react-icons/fa';
import { GiReturnArrow } from 'react-icons/gi';

export default function Policy() {
    return (
        <div className='grid grid-cols-3 gap-4 mt-6'>
            <div
                className='group cursor-pointer relative overflow-hidden
            bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700
            rounded-xl border border-gray-100 dark:border-gray-600
            hover:border-blue-200 dark:hover:border-blue-500/30
            transition-all duration-500 ease-in-out
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            transform hover:-translate-y-1 hover:scale-[1.02]
            aspect-square'
            >
                <div className='h-full flex flex-col items-center justify-center p-4'>
                    <div className='flex-shrink-0 relative mb-3'>
                        <div
                            className='absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-xl
                        transform group-hover:scale-150 transition-transform duration-500'
                        ></div>
                        <div
                            className='relative w-12 h-12 rounded-xl rotate-45 transform
                        bg-gradient-to-br from-blue-100 to-white dark:from-blue-900 dark:to-blue-800
                        group-hover:rotate-[225deg] transition-transform duration-700 ease-in-out
                        border border-blue-100 dark:border-blue-700 group-hover:border-blue-200'
                        >
                            <div
                                className='absolute inset-0 flex items-center justify-center -rotate-45
                            group-hover:rotate-[135deg] transition-transform duration-700'
                            >
                                <GiReturnArrow
                                    size={20}
                                    className='text-blue-600 dark:text-blue-400
                                transform group-hover:scale-110 transition-all duration-500'
                                />
                            </div>
                        </div>
                    </div>
                    <h4
                        className='text-sm font-semibold text-center bg-gradient-to-r from-gray-900 to-gray-600
                    dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent
                    group-hover:from-blue-600 group-hover:to-blue-400
                    transition-all duration-500'
                    >
                        Đổi trả miễn phí
                    </h4>
                    <p className='text-xs text-center text-gray-500 dark:text-gray-400 mt-2'>Trong vòng 7 ngày</p>
                </div>
            </div>

            <div
                className='group cursor-pointer relative overflow-hidden
            bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700
            rounded-xl border border-gray-100 dark:border-gray-600
            hover:border-green-200 dark:hover:border-green-500/30
            transition-all duration-500 ease-in-out
            hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            transform hover:-translate-y-1 hover:scale-[1.02]
            aspect-square'
            >
                <div className='h-full flex flex-col items-center justify-center p-4'>
                    <div className='flex-shrink-0 relative mb-3'>
                        <div
                            className='absolute inset-0 bg-green-500/20 dark:bg-green-400/20 rounded-full blur-xl
                        transform group-hover:scale-150 transition-transform duration-500'
                        ></div>
                        <div
                            className='relative w-12 h-12 rounded-xl rotate-45 transform
                        bg-gradient-to-br from-green-100 to-white dark:from-green-900 dark:to-green-800
                        group-hover:rotate-[225deg] transition-transform duration-700 ease-in-out
                        border border-green-100 dark:border-green-700 group-hover:border-green-200'
                        >
                            <div
                                className='absolute inset-0 flex items-center justify-center -rotate-45
                            group-hover:rotate-[135deg] transition-transform duration-700'
                            >
                                <FaShieldAlt
                                    size={20}
                                    className='text-green-600 dark:text-green-400
                                transform group-hover:scale-110 transition-all duration-500'
                                />
                            </div>
                        </div>
                    </div>
                    <h4
                        className='text-sm font-semibold text-center bg-gradient-to-r from-gray-900 to-gray-600
                    dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent
                    group-hover:from-green-600 group-hover:to-green-400
                    transition-all duration-500'
                    >
                        Bảo hành 12 tháng
                    </h4>
                    <p className='text-xs text-center text-gray-500 dark:text-gray-400 mt-2'>Tại cửa hàng</p>
                </div>
            </div>

            <div
                className='group cursor-pointer relative overflow-hidden
    bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700
    rounded-xl border border-gray-100 dark:border-gray-600
    hover:border-purple-200 dark:hover:border-purple-500/30
    transition-all duration-500 ease-in-out
    hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]
    transform hover:-translate-y-1 hover:scale-[1.02]
    aspect-square'
            >
                <div className='h-full flex flex-col items-center justify-center p-4'>
                    <div className='flex-shrink-0 relative mb-3'>
                        <div
                            className='absolute inset-0 bg-purple-500/20 dark:bg-purple-400/20 rounded-full blur-xl
                transform group-hover:scale-150 transition-transform duration-500'
                        ></div>
                        <div
                            className='relative w-12 h-12 rounded-xl rotate-45 transform
                bg-gradient-to-br from-purple-100 to-white dark:from-purple-900 dark:to-purple-800
                group-hover:rotate-[225deg] transition-transform duration-700 ease-in-out
                border border-purple-100 dark:border-purple-700 group-hover:border-purple-200'
                        >
                            <div
                                className='absolute inset-0 flex items-center justify-center -rotate-45
                    group-hover:rotate-[135deg] transition-transform duration-700'
                            >
                                <FaPhoneAlt
                                    size={20}
                                    className='text-purple-600 dark:text-purple-400
                        transform group-hover:scale-110 transition-all duration-500'
                                />
                            </div>
                        </div>
                    </div>
                    <h4
                        className='text-sm font-semibold text-center bg-gradient-to-r from-gray-900 to-gray-600
            dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent
            group-hover:from-purple-600 group-hover:to-purple-400
            transition-all duration-500'
                    >
                        Hotline hỗ trợ
                    </h4>
                    <p className='text-xs text-center text-gray-500 dark:text-gray-400 mt-2'>1900 xxxx</p>
                </div>
            </div>
        </div>
    );
}
