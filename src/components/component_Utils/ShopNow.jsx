import { FaArrowRight } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ShopNow() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterProduct = (value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('gender', value);
        setSearchParams(newSearchParams);
        navigate({
            pathname: '/products',
            search: `?${newSearchParams.toString()}`,
        });
    };

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
                            onClick={() => handleFilterProduct('Nam')}
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center rounded-md 
                            sm:bg-transparent sm:border-2 sm:border-white sm:text-white bg-white text-black
                            py-2 sm:py-4 text-lg font-semibold transition-all duration-500 hover:bg-white hover:text-black'
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
                            onClick={() => handleFilterProduct('Nữ')}
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center rounded-md 
                            sm:bg-transparent sm:border-2 sm:border-white sm:text-white bg-white text-black
                            py-2 sm:py-4 text-lg font-semibold transition-all duration-500 hover:bg-white hover:text-black'
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
