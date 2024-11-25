import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function EmptyCart() {
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleNavigateToLoginPage = () => {
        navigate('/login', { state: { from: pathname } });
    };

    return (
        <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300'>
            <div className='absolute inset-0 bg-[url("/assets/luxuryWatch.jpg")] bg-no-repeat bg-center bg-cover opacity-10 dark:opacity-10' />
            <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/5 to-rose-500/5 dark:from-amber-500/10 dark:to-rose-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob' />
            <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000' />

            <div className='relative z-10 w-full max-w-5xl'>
                <div className='mb-5 text-center'>
                    <h1 className='font-serif text-3xl md:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 animate-shimmer'>
                        Giỏ Hàng Của Bạn
                    </h1>
                    <div className='w-16 h-0.5 mx-auto bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-200 dark:to-amber-400'></div>
                </div>

                <div className='relative rounded-3xl p-8'>
                    <div className='grid md:grid-cols-2 gap-8 items-center'>
                        <div className='relative group perspective'>
                            <div className='relative transform transition-all duration-700 group-hover:rotate-y-12'>
                                <img
                                    src='/assets/watchMiniCart.avif'
                                    alt='Đồng Hồ Cao Cấp'
                                    className='rounded-2xl shadow-2xl w-auto h-[60vh] object-cover'
                                />
                                <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl'></div>
                            </div>
                        </div>

                        <div className='space-y-6'>
                            {tokenUser ? (
                                <div className='space-y-5 animate-fadeIn'>
                                    <h2 className='text-2xl md:text-3xl font-serif text-amber-700 dark:text-amber-300 leading-tight'>
                                        Hiện tại chưa có sản phẩm
                                    </h2>
                                    <p className='text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed'>
                                        Khám phá bộ sưu tập đồng hồ tinh tế, nơi hội tụ những thiết kế độc đáo và đẳng
                                        cấp nhất.
                                    </p>
                                    <Link to='/products'>
                                        <button className='group relative w-full mt-4'>
                                            <div className='absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt'></div>
                                            <div className='relative px-6 py-3 bg-white dark:bg-gray-900 rounded-lg leading-none flex items-center justify-center'>
                                                <span className='text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition duration-200 text-sm font-medium'>
                                                    Khám Phá Bộ Sưu Tập Đồng Hồ
                                                </span>
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            ) : (
                                <div className='space-y-6 animate-fadeIn'>
                                    <h2 className='text-2xl md:text-3xl font-serif text-amber-700 dark:text-amber-300 leading-tight'>
                                        Trải Nghiệm Giá Trị Vượt Trội
                                    </h2>
                                    <p className='text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed'>
                                        Đăng nhập để bắt đầu hành trình khám phá thế giới đồng hồ cao cấp và những trải
                                        nghiệm xa xỉ được tuyển chọn đặc biệt kỹ lưỡng.
                                    </p>
                                    <button
                                        onClick={handleNavigateToLoginPage}
                                        className='group relative w-full overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2'
                                    >
                                        <div className='absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-x'></div>

                                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000'></div>

                                        <div className='relative px-6 py-3.5 rounded-lg leading-none flex items-center justify-center'>
                                            <div className='absolute inset-0 bg-black rounded-lg transition-opacity duration-500 group-hover:opacity-0'></div>

                                            <span className='flex items-center gap-2 text-amber-300 group-hover:text-amber-200 transition-colors duration-200 text-base font-medium relative z-10'>
                                                <span className='tracking-wide'>ĐĂNG NHẬP NGAY</span>
                                                <svg
                                                    className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                >
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth='2'
                                                        d='M14 5l7 7m0 0l-7 7m7-7H3'
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
