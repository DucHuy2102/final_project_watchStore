const policyData = [
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/relationship.png',
        title: '100%',
        subtitle: 'chính hãng',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/guarantee.png',
        title: 'bảo hành tận nơi',
        subtitle: 'toàn quốc',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/delivery-status.png',
        title: '30 ngày',
        subtitle: 'đổi mới',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/low-battery.png',
        title: 'thay pin miễn phí',
        subtitle: 'trọn đời',
    },
    {
        img: 'https://casio-hcm.vn/wp-content/uploads/2024/03/discount.png',
        title: 'giá luôn',
        subtitle: 'ưu đãi',
    },
];

export default function Policy() {
    return (
        <div className='my-7 w-full'>
            <div className='relative mb-4 text-xl sm:text-3xl text-center font-semibold uppercase'>
                <span className='relative z-10 bg-white dark:bg-[rgb(16,32,42)] px-2 inline-block'>
                    vì sao nên lựa chọn chúng tôi
                </span>
                <div className='absolute inset-x-0 top-1/2 transform -translate-y-1/2 bg-black h-[1px] sm:h-[2px]'></div>
            </div>
            <div className='w-full sm:px-6 lg:px-10'>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                    {policyData.map((item, index) => (
                        <div
                            key={index}
                            className='flex flex-col justify-center items-center gap-4 p-4 border border-gray-300 rounded-lg transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:cursor-pointer'
                        >
                            <img
                                src={item.img}
                                className='h-16 w-16 object-cover transition-opacity duration-300 hover:opacity-75 dark:opacity-100'
                            />
                            <div className='flex flex-col justify-center items-center text-center text-lg'>
                                <p className='uppercase font-bold'>{item.title}</p>
                                <p className='uppercase font-bold'>{item.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
