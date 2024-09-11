import { FaArrowRight } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ShopNow() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const handleFilterProduct = (value) => {
    //     dispatch(filterProducts([{ key: value, title: 'Đối tượng' }]));
    //     navigate('/products');
    // };

    return (
        <div className='mt-7 font-semibold'>
            <div className='flex flex-col md:flex-row justify-center items-center gap-5'>
                <div className='relative w-full md:w-1/2 cursor-pointer'>
                    <div className='overflow-hidden'>
                        <img
                            src='https://timex.com/cdn/shop/files/4967_TX_TC24_collection_mod_TW2W51600_dd9b2b52-2099-4a6e-9e76-f3cb0449ba06.jpg?v=1714968502'
                            alt='Men Watches'
                            className='rounded-md w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                        />
                    </div>
                    <div className='absolute bottom-10 inset-x-0 flex justify-center items-center p-4'>
                        <button
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center rounded-md bg-white px-6 py-4 text-lg font-semibold text-black transition-all duration-500 hover:bg-gray-800 hover:text-white'
                        >
                            Đồng hồ Nam
                            <FaArrowRight className='ml-2 transition-transform duration-300 transform group-hover:translate-x-2' />
                        </button>
                    </div>
                </div>

                <div className='relative w-full md:w-1/2 cursor-pointer'>
                    <div className='overflow-hidden'>
                        <img
                            src='https://timex.com/cdn/shop/files/TW2W32200_CollectionMod.jpg?v=1711979408'
                            alt='Women Watches'
                            className='rounded-md w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                        />
                    </div>
                    <div className='absolute bottom-10 inset-x-0 flex justify-center items-center p-4'>
                        <button
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center rounded-md bg-white px-6 py-4 text-lg font-semibold text-black transition-all duration-500 hover:bg-gray-800 hover:text-white'
                        >
                            Đồng hồ Nữ
                            <FaArrowRight className='ml-2 transition-transform duration-300 transform group-hover:translate-x-2' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
