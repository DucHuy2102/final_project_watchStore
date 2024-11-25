import { motion } from 'framer-motion';
import { IoCartOutline } from 'react-icons/io5';

export default function EmptyCheckout({ countdown }) {
    return (
        <div className='min-h-[60vh] flex flex-col items-center justify-center p-8'>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className='relative'
            >
                <div className='absolute -top-2 -right-2'>
                    <span className='relative flex h-4 w-4'>
                        <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                        <span className='relative inline-flex rounded-full h-4 w-4 bg-blue-500'></span>
                    </span>
                </div>
                <IoCartOutline className='w-32 h-32 text-gray-400 mb-4' />
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center'
            >
                Giỏ hàng của bạn đang trống
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className='text-gray-500 dark:text-gray-400 text-center mb-8 flex items-center gap-2'
            >
                Đang chuyển hướng đến trang sản phẩm... <span>({countdown}s)</span>
            </motion.p>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='w-32 h-1 bg-gray-200 rounded-full'
            >
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5 }}
                    className='h-full bg-blue-500 rounded-full'
                />
            </motion.div>
        </div>
    );
}
