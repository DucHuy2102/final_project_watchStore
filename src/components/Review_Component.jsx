import { Rating } from 'flowbite-react';

export default function TheReviews() {
    return (
        <div className='w-full rounded-lg bg-gray-100 dark:bg-gray-900 py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='mb-5 flex items-center space-x-2'>
                    <span className='text-5xl text-blue-500 font-serif'>&ldquo;</span>
                    <p className='text-center text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6'>
                        Hãy cùng xem các khách hàng nói gì về dịch vụ và sản phẩm của WatcHes!
                    </p>
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
                            className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
                        >
                            <Rating className='mb-4'>
                                <Rating.Star />
                                <Rating.Star />
                                <Rating.Star />
                                <Rating.Star />
                                <Rating.Star />
                            </Rating>
                            <p className='text-gray-800 dark:text-gray-300 leading-relaxed'>
                                {item.review}
                            </p>
                            <p className='mt-6 text-right text-sm font-medium text-gray-600 dark:text-gray-400'>
                                {item.name} - {item.location}
                            </p>
                        </div>
                    ))}
                </div>

                <div className='flex justify-end items-center space-x-2 mt-6'>
                    <span className='mt-2 text-center text-lg sm:text-xl text-gray-600 dark:text-gray-300'>
                        Cảm ơn bạn đã tin tưởng và ủng hộ chúng tôi. Chúng tôi cam kết tiếp tục cung
                        cấp dịch vụ và sản phẩm tốt nhất!
                    </span>
                    <span className='text-5xl text-blue-500 font-serif'>&rdquo;</span>
                </div>
            </div>
        </div>
    );
}
