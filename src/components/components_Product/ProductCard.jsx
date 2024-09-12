import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Modal } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    const { id, productName, price, img, size, genderUser } = product;

    // state
    const currentUser = useSelector((state) => state.user.currentUser);
    const tokenUser = currentUser?.access_token;
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);

    // format price to VND
    const priceFormat = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);

    // function buy now
    const handleBuyNow = () => {
        console.log('Buy now');
    };

    return (
        <div
            className='relative bg-white w-full border-b-4 border-gray-600 sm:border-none flex flex-col justify-between items-center 
            sm:w-[45vw] sm:min-h-[50vh] md:w-[30vw] md:min-h-[45vh] 
            lg:w-[23vw] lg:min-h-[40vh] xl:w-[18vw] xl:min-h-[35vh]
            max-w-md min-h-[50vh] mx-auto shadow-md rounded-lg overflow-hidden 
            transition-transform duration-300 ease-in-out transform hover:scale-105'
        >
            {/* Image watches */}
            <div
                className='w-full h-[45vh] sm:h-[30vh] md:h-[25vh] lg:h-[30vh] xl:h-[25vh] 
            flex items-center justify-center overflow-hidden'
            >
                <Swiper className='h-full w-full' loop={true} spaceBetween={0}>
                    {img.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={item}
                                alt={productName}
                                className='h-full w-full object-contain'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Name and price */}
            <div className='w-full px-4 py-2 sm:px-6'>
                <Link to={`/product-detail/${id}`}>
                    <h3 className='text-lg font-semibold text-gray-800'>{productName}</h3>
                    <p className='text-sm sm:text-base text-gray-500'>
                        {size} | {genderUser === 'Male' ? 'Nam' : 'Nữ'} giới
                    </p>
                    <p className='text-lg sm:font-medium font-bold text-gray-900'>{priceFormat}</p>
                </Link>
            </div>

            {/* Button buy */}
            <div className='w-full'>
                <button
                    onClick={() => setShowModalBuyNow(true)}
                    className='w-full py-2 sm:py-3 rounded-t-none bg-gray-200 text-gray-800
                    hover:bg-gray-300 hover:text-black font-medium transition-colors duration-200'
                >
                    Mua hàng ngay
                </button>
            </div>

            {/* Modal Buy Now */}
            {showModalBuyNow && (
                <Modal
                    size='md'
                    popup
                    show={showModalBuyNow}
                    onClose={() => setShowModalBuyNow(false)}
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='flex flex-col justify-center items-center'>
                            <img
                                src={img[0]}
                                alt={productName}
                                className='h-48 w-40 sm:h-64 sm:w-52 object-cover rounded-lg shadow-md'
                            />
                            <h4 className='mt-4 text-lg sm:text-xl font-semibold text-gray-800'>
                                {productName}
                            </h4>
                            <p className='text-sm sm:text-base text-gray-500'>
                                {size} | {genderUser === 'Male' ? 'Nam' : 'Nữ'} giới
                            </p>
                            <p className='text-lg sm:text-xl text-gray-900'>{priceFormat}</p>
                            <div className='flex items-center mt-4'>
                                <button className='text-center font-semibold text-lg sm:text-xl w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200'>
                                    -
                                </button>
                                <span className='text-center font-semibold text-lg w-10 sm:w-12'>
                                    1
                                </span>
                                <button className='text-center font-semibold text-lg sm:text-xl w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200'>
                                    +
                                </button>
                            </div>
                            <button
                                onClick={handleBuyNow}
                                className='mt-4 w-full bg-gray-300 text-black font-medium py-2 rounded-lg
                            hover:bg-gray-400 hover:text-white transition-colors duration-200'
                            >
                                Mua hàng ngay
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}
