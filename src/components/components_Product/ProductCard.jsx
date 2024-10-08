import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Modal } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiWarning } from 'react-icons/ci';

export default function ProductCard({ product }) {
    const { id, productName, price, img, genderUser, shape, length, width } = product;
    const sizeProduct = length === width ? `${length} mm` : `${length} x ${width} mm`;
    const handleRenderGenderUser = genderUser === 'Male' ? 'Nam' : 'Nữ';

    // state
    const tokenUser = useSelector((state) => state.user.access_token);
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [quantity, setQuantity] = useState(1);

    // format price to VND
    const priceFormat = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);

    // function buy now
    const handleBuyNow = () => {
        console.log('Buy now');
    };

    // function navigate to login page
    const handleNavigateToLoginPage = () => {
        navigate('/login', { state: { from: pathname } });
        setShowModalBuyNow(false);
    };

    // function navigate to product detail
    const handleNavigateToProductDetail = () => {
        navigate(`/product-detail/${id}`);
    };

    return (
        <div
            className='relative bg-white w-full sm:border-none 
            shadow-lg shadow-gray-300 dark:shadow-sm dark:shadow-gray-800
            flex flex-col justify-between items-center 
            sm:w-[45vw] sm:min-h-[50vh] md:w-[30vw] md:min-h-[45vh] 
            lg:w-[30vw] lg:min-h-[45vh] xl:w-[50vw] xl:min-h-[50vh]
            max-w-md min-h-[50vh] mx-auto rounded-lg overflow-hidden 
            transition-transform duration-500 ease-[cubic-bezier(0.25, 0.1, 0.25, 1)] transform hover:scale-105'
        >
            {/* Image watches */}
            <div
                className='w-full p-1 h-[50vh] sm:h-[40vh] md:h-[40vh] 
                lg:h-[45vh] lg:p-2 xl:h-[53vh] xl:px-5
                flex items-center justify-center overflow-hidden'
            >
                <Swiper className='h-full w-full rounded-lg' loop={true} spaceBetween={0}>
                    {img.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={item}
                                alt={productName}
                                className='h-auto w-auto rounded-lg object-cover transition-transform duration-500 ease-in-out transform hover:scale-105'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Name and price */}
            <div
                onClick={handleNavigateToProductDetail}
                className='w-full px-4 py-2 sm:px-6 lg:px-4 lg:pb-4 xl:px-5 cursor-pointer'
            >
                <h3 className='text-lg lg:text-xl xl:text-xl font-semibold text-gray-700 transition-colors duration-300 hover:text-gray-900'>
                    {productName}
                </h3>
                <p className='text-sm sm:text-base lg:text-lg text-gray-500'>
                    {sizeProduct} | {handleRenderGenderUser} giới
                </p>
                <p
                    className='text-lg sm:font-medium lg:font-bold lg:text-xl 
                    xl:text-2xl font-bold text-gray-900 transition-colors duration-300'
                >
                    {priceFormat}
                </p>
            </div>

            {/* Button buy */}
            <div className='w-full'>
                <Button
                    onClick={() => setShowModalBuyNow(true)}
                    className={`w-full rounded-t-none font-medium py-1 ${
                        tokenUser
                            ? ''
                            : 'bg-black text-white dark:bg-gray-800 dark:text-white hover:!bg-gray-700'
                    }`}
                >
                    Mua hàng ngay
                </Button>
            </div>

            {/* Modal Buy Now */}
            <Modal size='md' popup show={showModalBuyNow} onClick={() => setShowModalBuyNow(false)}>
                {tokenUser ? (
                    <>
                        <Modal.Header />
                        <Modal.Body>
                            <div className='flex flex-col justify-center items-center'>
                                <Swiper
                                    className='h-full w-full rounded-lg'
                                    loop={true}
                                    spaceBetween={0}
                                >
                                    {img.map((item, index) => (
                                        <SwiperSlide key={index}>
                                            <img
                                                src={item}
                                                alt={productName}
                                                className='h-full w-full rounded-lg object-cover transition-transform duration-500 ease-in-out transform hover:scale-105'
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <h4 className='mt-4 text-lg sm:text-xl font-semibold text-gray-800'>
                                    {productName}
                                </h4>
                                <p className='text-sm sm:text-base text-gray-500'>
                                    {sizeProduct} | {genderUser === 'Male' ? 'Nam' : 'Nữ'} giới
                                </p>
                                <p className='text-lg font-semibold sm:text-xl text-blue-500'>
                                    {priceFormat}
                                </p>
                                <div className='flex items-center mt-4'>
                                    <Button pill color={'gray'}>
                                        -
                                    </Button>
                                    <span className='text-center font-semibold text-lg w-10 sm:w-12'>
                                        1
                                    </span>
                                    <Button pill color={'gray'}>
                                        +
                                    </Button>
                                </div>
                                <Button className='w-full mt-4' onClick={handleBuyNow}>
                                    Mua hàng ngay
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                ) : (
                    <Modal show={showModalBuyNow} size='md' popup>
                        <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                            <CiWarning size='70px' color={'red'} />
                            <span className='text-lg font-medium text-black'>
                                Bạn cần đăng nhập để mua hàng
                            </span>
                            <div className='w-full flex justify-between items-center gap-x-5'>
                                <Button
                                    outline
                                    className='w-full'
                                    onClick={() => setShowModalBuyNow(false)}
                                >
                                    Hủy
                                </Button>
                                <Button className='w-full' onClick={handleNavigateToLoginPage}>
                                    Đăng nhập
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                )}
            </Modal>
        </div>
    );
}
