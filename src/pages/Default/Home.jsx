import { Carousel_Component } from '../../components/exportComponent';
import { ShopNow, Policy, SayThanks, Review_Component } from './components/exportCom_DefaultPage';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

export default function Home() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const toggleScrollToTop = () => {
            if (window.scrollY > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleScrollToTop);

        return () => {
            window.removeEventListener('scroll', toggleScrollToTop);
        };
    }, []);

    return (
        <div className='min-h-screene p-5'>
            <Carousel_Component />
            <ShopNow />
            <Policy />
            <Review_Component />
            <SayThanks />

            <div
                onClick={() => navigate('/products')}
                className='w-full mx-auto mb-5 p-8 bg-gradient-to-r from-black via-gray-900 to-black
                text-white rounded-2xl cursor-pointer hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]
                transition-all duration-500 ease-out border border-gray-800 backdrop-blur-lg group'
            >
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-8'>
                        <div className='w-24 h-24 relative'>
                            <img
                                src='./assets/imgHome.webp'
                                alt='Watch'
                                className='w-full h-full transform group-hover:rotate-12 transition-transform duration-500 object-cover rounded-full'
                            />
                        </div>
                        <div>
                            <h2 className='text-3xl py-1 font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent'>
                                Đừng bỏ lỡ giây phút nào nữa
                            </h2>
                            <p className='text-gray-400 text-lg group-hover:text-gray-300 transition-colors duration-300'>
                                Khám phá các sản phẩm của chúng tôi
                            </p>
                        </div>
                    </div>

                    <button
                        className='px-8 py-4 border border-gray-700 rounded-full 
                        flex items-center gap-3 group-hover:gap-4
                        hover:border-amber-400/50 hover:bg-gradient-to-r hover:from-amber-900/10 hover:to-transparent
                        transition-all duration-300'
                    >
                        <span className='text-lg font-medium'>Xem thêm</span>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6 transform group-hover:translate-x-1 transition-transform duration-300'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className='fixed bottom-40 right-7 p-4 bg-white dark:bg-gray-800 
                    rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 
                    transition-all duration-300 z-50 group border border-gray-200 
                    dark:border-gray-700'
                    aria-label='Scroll to top'
                >
                    <FiArrowUp
                        className='w-6 h-6 text-gray-600 dark:text-gray-300 
                        group-hover:text-blue-600 dark:group-hover:text-blue-400 
                        transition-colors duration-300'
                    />
                </button>
            )}
        </div>
    );
}
