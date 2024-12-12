import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineClose, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { toggleLikeProduct, clearLikedProducts } from '../../../../services/redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function LikeProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { likedProducts } = useSelector((state) => state.product);
    const [isOpen, setIsOpen] = useState(true);

    if (likedProducts.length === 0) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 
                    ${isOpen ? 'translate-x-[-320px]' : 'translate-x-0'}
                    transition-transform duration-300 ease-in-out
                    bg-white dark:bg-gray-800 shadow-[-4px_0_16px_rgba(0,0,0,0.1)]
                    p-2 rounded-l-xl flex items-center gap-2 group
                    hover:bg-gray-50 dark:hover:bg-gray-700`}
            >
                {isOpen ? (
                    <MdKeyboardArrowRight size={24} className='text-gray-600 dark:text-gray-300' />
                ) : (
                    <>
                        <AiFillHeart className='text-red-500' />
                        <span className='text-gray-600 dark:text-gray-300 font-medium'>{likedProducts.length}</span>
                        <MdKeyboardArrowLeft size={24} className='text-gray-600 dark:text-gray-300' />
                    </>
                )}
            </button>

            <div
                className={`fixed right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 
                shadow-[-4px_0_16px_rgba(0,0,0,0.1)] rounded-l-2xl p-4 z-40 
                max-h-[80vh] overflow-y-auto w-[320px] transition-all duration-300
                ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div
                    className='sticky top-0 bg-white dark:bg-gray-800 z-10 pb-4 border-b 
                    dark:border-gray-700 mb-4'
                >
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                            <AiOutlineHeart className='text-red-500 text-xl' />
                            <h3 className='text-lg font-semibold text-gray-800 dark:text-white'>
                                Sản phẩm yêu thích ({likedProducts.length})
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                dispatch(clearLikedProducts());
                            }}
                            className='text-gray-500 hover:text-red-500 transition-colors duration-300'
                            title='Xóa tất cả'
                        >
                            <AiOutlineClose size={20} />
                        </button>
                    </div>
                </div>

                <div className='space-y-4'>
                    {likedProducts.map((product) => (
                        <div
                            key={product.id}
                            className='group relative bg-gray-50 dark:bg-gray-700 rounded-xl p-3 
                                hover:shadow-md transition-all duration-300'
                        >
                            <div
                                className='flex gap-3 cursor-pointer'
                                onClick={() => navigate(`/product-detail/${product.id}`)}
                            >
                                <div className='w-24 h-24 overflow-hidden rounded-lg'>
                                    <img
                                        src={product.img[0]}
                                        alt={product.productName}
                                        className='w-full h-full object-cover transform 
                                            group-hover:scale-110 transition-transform duration-500'
                                    />
                                </div>

                                <div className='flex-1'>
                                    <h4
                                        className='font-medium text-gray-800 dark:text-white 
                                        line-clamp-2 mb-1 group-hover:text-blue-600 
                                        transition-colors duration-300'
                                    >
                                        {product.productName}
                                    </h4>
                                    <div className='space-y-1'>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>{product.style}</p>
                                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                                            {product.genderUser === 'Nam' ? 'Nam' : 'Nữ'} • {product.waterproof}ATM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => dispatch(toggleLikeProduct(product))}
                                className='absolute -top-2 -right-2 p-1.5 bg-red-500 text-white 
                                    rounded-full opacity-0 group-hover:opacity-100 
                                    transition-all duration-300 hover:bg-red-600 
                                    transform hover:scale-110'
                            >
                                <AiOutlineClose size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
