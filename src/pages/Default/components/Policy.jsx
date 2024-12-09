const policyData = [
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/relationship.png',
        title: '100%',
        subtitle: 'chính hãng',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/guarantee.png',
        title: 'bảo hành',
        subtitle: 'toàn quốc',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/delivery-status.png',
        title: '30 ngày',
        subtitle: 'đổi mới',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/low-battery.png',
        title: 'thay pin',
        subtitle: 'miễn phí',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/discount.png',
        title: 'giá luôn',
        subtitle: 'ưu đãi',
    },
];

export default function Policy() {
    return (
        <div className='my-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='relative mb-12 text-3xl sm:text-4xl text-center font-bold uppercase'>
                <span
                    className='relative z-10 bg-white dark:bg-[rgb(16,32,42)] px-6 py-1 inline-block
            bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 
            dark:from-gray-100 dark:to-gray-300'
                >
                    vì sao nên lựa chọn chúng tôi
                </span>
            </div>
            <div className='w-full'>
                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                    {policyData.map((item, index) => (
                        <div
                            key={index}
                            className='flex flex-col justify-center items-center gap-6 p-6 
                    bg-white dark:bg-gray-800 rounded-2xl transition-all duration-500 
                    hover:shadow-2xl hover:scale-105 hover:cursor-pointer
                    border border-gray-100 dark:border-gray-700
                    hover:border-gray-200 dark:hover:border-gray-600'
                        >
                            <div className='relative group'>
                                <img
                                    src={item.img}
                                    className='relative h-16 w-16 object-cover transition-all duration-300 
                            group-hover:scale-110 dark:opacity-100'
                                />
                            </div>
                            <div className='flex flex-col justify-center items-center text-center'>
                                <p className='uppercase font-bold text-lg text-gray-800 dark:text-gray-200'>
                                    {item.title}
                                </p>
                                <p className='uppercase font-medium text-gray-600 dark:text-gray-400'>
                                    {item.subtitle}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
