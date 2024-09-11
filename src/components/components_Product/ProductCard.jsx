import { useSelector } from 'react-redux';
import Swiper from 'swiper';
import { SwiperSlide } from 'swiper/react';

export default function ProductCard() {
    const currentUser = useSelector((state) => state.user.currentUser);
    const tokenUser = currentUser?.access_token;

    return (
        <div className='relative h-[625px] w-[466px] font-Lato hover:scale-105 transition-transform duration-300 hover:cursor-pointer bg-white shadow-xl rounded-xl overflow-hidden'>
            {/* Image watches */}
            <div className='w-full h-[466px] flex items-center justify-center bg-gray-200 rounded-t-xl'>
                {/* <Swiper className='h-[430px] w-[430px]' loop={true} spaceBetween={0}>
                    {img.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={item}
                                className='h-full w-full object-cover rounded-lg shadow-md'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper> */}
                <img
                    src={
                        'https://fossil.scene7.com/is/image/FossilPartners/FS5304_main?$sfcc_fos_medium$'
                    }
                    className='h-full w-full object-cover rounded-lg shadow-md'
                />
            </div>

            {/* Name and price */}
            <div className='mt-3 mb-3 px-4 cursor-pointer'>
                <div className='text-lg font-semibold text-gray-800'>{'productName'}</div>
                <div className='text-gray-500'>
                    {'size'} | {'genderUser'} giới
                </div>
                <div className='font-bold text-xl text-gray-900'>{'priceFormat'}</div>
            </div>

            {/* Button buy */}
            <div
                className={`border text-lg text-center py-2 transition duration-300 hover:font-bold cursor-pointer ${
                    tokenUser
                        ? 'bg-gray-900 text-white '
                        : 'border-gray-300 text-gray-800 hover:bg-gray-300 hover:text-gray-900'
                } rounded-lg mx-4`}
            >
                Mua hàng ngay
            </div>

            {/* Product detail overlay */}
            {/* {showProductDetail && (
                <div
                    className='absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50'
                    onClick={() => setShowProductDetail(false)}
                >
                    <div
                        className='relative w-[350px] bg-white shadow-2xl p-6 rounded-lg'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex justify-between items-center mb-4'>
                            <h2 className='text-lg font-bold text-gray-800'>Thông tin sản phẩm</h2>
                            <button onClick={() => setShowProductDetail(false)}>
                                <CloseOutlined className='text-gray-500 hover:text-black transition duration-200' />
                            </button>
                        </div>
                        <div className='text-center'>
                            <img
                                src={img[0]}
                                className='h-[200px] w-[200px] object-cover mx-auto rounded-lg shadow-md'
                            />
                            <h3 className='mt-2 text-xl font-semibold text-gray-800'>
                                {productName}
                            </h3>
                            <p className='text-lg text-gray-900'>{priceFormat}</p>
                            <div className='flex items-center justify-center mt-4'>
                                <button
                                    onClick={() => handleChangeQuantity('decrease')}
                                    className='bg-gray-200 hover:bg-gray-300 transition duration-200 rounded-full py-2 px-4 mr-2'
                                >
                                    -
                                </button>
                                <span className='text-center w-8'>{quantityProduct}</span>
                                <button
                                    onClick={() => handleChangeQuantity('increase')}
                                    className='bg-gray-200 hover:bg-gray-300 transition duration-200 rounded-full py-2 px-4 ml-2'
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleBuyNow}
                                className='mt-4 w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg'
                            >
                                Mua
                            </button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
