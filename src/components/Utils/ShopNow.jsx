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
                {/* Men */}
                <div className='relative w-full md:w-1/2 group cursor-pointer'>
                    <div className='relative rounded-tr-3xl rounded-br-md rounded-tl-md rounded-bl-3xl overflow-hidden'>
                        <img
                            src={'/assets/shopNow_Men.webp'}
                            alt='Men Watches'
                            className='w-full h-full object-cover transition-all duration-700 
            group-hover:scale-110 group-hover:brightness-90'
                        />
                        <div
                            className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                        />
                    </div>
                    <div className='absolute bottom-10 inset-x-0 flex justify-center items-center p-4'>
                        <button
                            onClick={() => handleFilterProduct('Nam')}
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center 
                            backdrop-blur-sm bg-black/20 border-2 border-white text-white
                            rounded-md py-2 sm:py-4 text-lg font-semibold 
                            transition-all duration-500 hover:bg-white hover:text-black
                            hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        >
                            <span className='relative'>
                                <span className='relative z-10'>Đồng hồ Nam</span>
                                <span
                                    className='absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                                    -skew-x-12 opacity-0 group-hover:animate-shine'
                                />
                            </span>
                            <FaArrowRight className='ml-2 transition-transform duration-300 transform group-hover:translate-x-2' />
                        </button>
                    </div>
                </div>

                {/* Female */}
                <div className='relative w-full md:w-1/2 group cursor-pointer'>
                    <div className='relative'>
                        <div className='relative rounded-tl-3xl rounded-bl-md rounded-tr-md rounded-br-3xl overflow-hidden'>
                            <img
                                src={'/assets/shopNow_Female.webp'}
                                alt='Women Watches'
                                className='w-full h-full object-cover transition-all duration-700 
            group-hover:scale-110 group-hover:brightness-90'
                            />
                            <div
                                className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                            />
                        </div>
                    </div>
                    <div className='absolute bottom-10 inset-x-0 flex justify-center items-center p-4'>
                        <button
                            onClick={() => handleFilterProduct('Nữ')}
                            type='button'
                            className='w-full max-w-xs group inline-flex items-center justify-center 
                            backdrop-blur-sm bg-black/20 border-2 border-white text-white
                            rounded-md py-2 sm:py-4 text-lg font-semibold 
                            transition-all duration-500 hover:bg-white hover:text-black
                            hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                        >
                            <span className='relative'>
                                <span className='relative z-10'>Đồng hồ Nữ</span>
                                <span
                                    className='absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                                    -skew-x-12 opacity-0 group-hover:animate-shine'
                                />
                            </span>
                            <FaArrowRight className='ml-2 transition-transform duration-300 transform group-hover:translate-x-2' />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
