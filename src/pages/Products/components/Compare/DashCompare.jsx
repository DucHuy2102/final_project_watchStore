import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'flowbite-react';
import { clearCompare } from '../../../../services/redux/slices/compareSlice';
import { BsX, BsArrowRight } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function DashCompare() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    const { compareProducts } = useSelector((state) => state.compare);

    if (compareProducts.length === 0) return null;

    const priceFormat = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <AnimatePresence>
            <motion.button
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className='fixed bottom-7 right-7 z-50 bg-amber-400 text-black p-3 rounded-full 
                shadow-lg hover:shadow-amber-400/20 transform hover:scale-110 transition-all duration-300'
                onClick={() => setIsVisible(!isVisible)}
            >
                <BsArrowRight
                    size={24}
                    className={`transform transition-transform duration-200 ${isVisible ? 'rotate-90' : '-rotate-90'}`}
                />
            </motion.button>

            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className='fixed bottom-0 left-0 right-0 z-40 overflow-hidden'
                >
                    <div className='bg-[#1a1a1a] bg-opacity-95 backdrop-blur-lg'>
                        <div className='max-w-7xl mx-auto p-8'>
                            <div className='flex items-center justify-between mb-8 border-b border-gray-700/50 pb-6'>
                                <div className='flex items-center gap-4'>
                                    <h3 className='text-2xl font-serif tracking-wide bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent'>
                                        So sánh sản phẩm
                                    </h3>
                                    <div className='w-px h-8 bg-gradient-to-b from-amber-200/20 to-amber-400/20'></div>
                                    <span className='px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-300 text-sm font-medium'>
                                        {compareProducts.length}/2
                                    </span>
                                </div>
                                <Button
                                    size='sm'
                                    onClick={() => dispatch(clearCompare())}
                                    className='!bg-transparent hover:!bg-amber-400/10 border border-amber-400/20 
                                    text-amber-300 transition-all duration-300'
                                >
                                    <BsX size={24} className='mr-1' />
                                    Xóa tất cả
                                </Button>
                            </div>

                            <div className='grid grid-cols-2 gap-8 mb-8'>
                                {compareProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className='flex items-center space-x-6 bg-white/5 rounded-xl p-6 
                                        backdrop-blur-sm border border-white/10 hover:border-amber-400/30 
                                        transition-all duration-500'
                                    >
                                        <div className='relative w-32 h-32 flex-shrink-0'>
                                            <img
                                                src={product.img[0]}
                                                alt={product.productName}
                                                className='w-full h-full object-cover rounded-lg shadow-xl'
                                            />
                                            <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-lg' />
                                            <div className='absolute inset-0 border border-white/10 rounded-lg'></div>
                                        </div>
                                        <div className='flex-1 space-y-4'>
                                            <h4 className='font-serif text-xl text-white/90 leading-tight line-clamp-2'>
                                                {product.productName}
                                            </h4>
                                            <p className='text-amber-300 font-medium text-lg'>
                                                {priceFormat(
                                                    product.option[0].value.price - product.option[0].value.discount,
                                                )}
                                            </p>
                                            <div className='flex flex-wrap gap-3'>
                                                <span
                                                    className='text-xs px-3 py-1.5 bg-white/5 border border-white/10 
                                                rounded-full text-white/70'
                                                >
                                                    {product.genderUser}
                                                </span>
                                                <span
                                                    className='text-xs px-3 py-1.5 bg-white/5 border border-white/10 
                                                rounded-full text-white/70'
                                                >
                                                    {product.waterproof} ATM
                                                </span>
                                                <span
                                                    className='text-xs px-3 py-1.5 bg-white/5 border border-white/10 
                                                rounded-full text-white/70'
                                                >
                                                    {product.style}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {compareProducts.length === 2 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='flex justify-center pt-4 border-t border-gray-700/50'
                                >
                                    <button
                                        onClick={() => navigate('/compare-products')}
                                        className='!bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 
                                        hover:to-amber-600 text-black font-medium px-8 py-3 rounded-full 
                                        transition-all duration-300 shadow-lg hover:shadow-amber-400/20 flex items-center
                                        transform hover:scale-110 hover:-translate-y-1'
                                    >
                                        <span className='mr-2 text-lg'>So sánh chi tiết</span>
                                        <BsArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
