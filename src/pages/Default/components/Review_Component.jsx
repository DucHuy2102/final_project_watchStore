import { Rating } from 'flowbite-react';

export default function TheReviews() {
    return (
        <div className='w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mb-2 flex justify-start items-center space-x-4'>
                    <span className='text-6xl text-blue-500 font-serif'>&ldquo;</span>
                    <p
                        className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200'
                    >
                        Khách hàng nói gì về WatcHes
                    </p>
                    <div className='flex-grow border border-blue-300 dark:border-blue-400' />
                </div>

                <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                    {[
                        {
                            review: 'Tôi đã mua hàng từ WatcHes nhiều lần và luôn hài lòng với chất lượng sản phẩm. Nhân viên tư vấn nhiệt tình và giá cả hợp lý. Đây là nơi tôi sẽ tiếp tục ủng hộ!',
                            name: 'Nguyễn Hoài Linh',
                            location: 'Hà Nội',
                        },
                        {
                            review: 'Chất lượng đồng hồ tuyệt vời và dịch vụ khách hàng rất chu đáo. Tôi cảm thấy được chăm sóc và sẽ trở lại trong tương lai.',
                            name: 'Lâm Thanh Hà',
                            location: 'Đà Nẵng',
                        },
                        {
                            review: 'Dịch vụ và sản phẩm đều xuất sắc. Giá cả hợp lý và nhân viên tư vấn rất thân thiện. WatcHes thực sự là sự lựa chọn tốt!',
                            name: 'Nguyễn Tấn Công',
                            location: 'Hồ Chí Minh',
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className='bg-white cursor-pointer dark:bg-gray-800 p-8 rounded-2xl shadow-xl 
                hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
                        >
                            <Rating size='md' className='mb-2'>
                                <Rating.Star filled={true} className='text-amber-400' />
                                <Rating.Star filled={true} className='text-amber-400' />
                                <Rating.Star filled={true} className='text-amber-400' />
                                <Rating.Star filled={true} className='text-amber-400' />
                                <Rating.Star filled={true} className='text-amber-400' />
                            </Rating>
                            <p className='text-gray-800 dark:text-gray-300 leading-relaxed'>{item.review}</p>
                            <p className='mt-6 text-right text-sm font-medium text-gray-600 dark:text-gray-400'>
                                {item.name} - {item.location}
                            </p>
                        </div>
                    ))}
                </div>

                <div className='flex justify-end items-center space-x-2 mt-5'>
                    <div className='flex-grow border border-blue-300 dark:border-blue-400' />
                    <p
                        className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r 
                from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-200'
                    >
                        Chúng tôi cam kết tiếp tục cung cấp dịch vụ và sản phẩm tốt nhất!
                    </p>
                    <span className='text-5xl text-blue-500 font-serif'>&rdquo;</span>
                </div>
            </div>
        </div>
    );
}
