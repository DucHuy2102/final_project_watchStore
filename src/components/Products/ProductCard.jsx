import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Modal } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CiWarning } from 'react-icons/ci';
import { setProductToCheckout } from '../../services/redux/slices/checkoutSlice';

export default function ProductCard({ product }) {
    const { id, productName, price, img, genderUser, length, width, style, waterproof, option } = product;
    const sizeProduct = useMemo(() => {
        return length === width ? `${length} mm` : `${length} x ${width} mm`;
    }, [length, width]);
    const handleRenderGenderUser = useMemo(() => {
        return genderUser === 'Male' ? 'Nam' : 'Nữ';
    }, [genderUser]);
    const initialSelectedColor = useMemo(() => {
        return option?.find((opt) => opt.value.state === 'saling')?.key || null;
    }, [option]);

    // state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const tokenUser = useSelector((state) => state.user.access_token);
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(initialSelectedColor);

    const selectedOption = option?.find((opt) => opt.key === selectedColor)?.value;

    const priceFormat = useCallback((price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }, []);

    const handleQuantityDecrease = useCallback((e) => {
        e.stopPropagation();
        setQuantity((prev) => Math.max(1, prev - 1));
    }, []);

    const handleQuantityIncrease = useCallback((e) => {
        e.stopPropagation();
        setQuantity((prev) => prev + 1);
    }, []);

    const handleColorSelect = useCallback((e, colorKey) => {
        e.stopPropagation();
        setSelectedColor(colorKey);
    }, []);

    const renderColorOptions = useMemo(() => {
        if (!option) return null;

        return option.map((opt) => (
            <button
                key={opt.key}
                onClick={(e) => handleColorSelect(e, opt.key)}
                className={`w-8 h-8 rounded-full border-2 transition-all
                    ${opt.value.state === 'soldOf' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${selectedColor === opt.key ? 'border-blue-500 scale-110' : 'border-gray-300'}
                    hover:scale-110`}
                style={{ backgroundColor: opt.key }}
                disabled={opt.value.state === 'soldOf'}
                title={opt.value.color}
            />
        ));
    }, [option, selectedColor, handleColorSelect]);

    const priceDisplay = useMemo(() => {
        if (!selectedOption) return null;

        const finalPrice = selectedOption.price - selectedOption.discount;
        return (
            <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-gray-900'>{priceFormat(finalPrice)}</span>
                {selectedOption.discount > 0 && (
                    <>
                        <span className='text-sm text-gray-500 line-through'>{priceFormat(selectedOption.price)}</span>
                        <span className='text-sm text-red-500'>
                            -{Math.round((selectedOption.discount / selectedOption.price) * 100)}%
                        </span>
                    </>
                )}
            </div>
        );
    }, [selectedOption, priceFormat]);

    // function buy now
    const handleBuyNow = useCallback(() => {
        if (!selectedOption) return;

        const totalAmountToPay = quantity * (selectedOption.price - selectedOption.discount);
        dispatch(
            setProductToCheckout({
                productItems: {
                    ...product,
                    selectedColor,
                    selectedOption,
                },
                totalPrice: selectedOption.price * quantity,
                totalDiscountPrice: selectedOption.discount * quantity,
                totalAmountToPay,
                totalQuantity: quantity,
                isBuyNow: true,
            }),
        );
        navigate('/checkout');
        setShowModalBuyNow(false);
    }, [dispatch, navigate, product, quantity, selectedColor, selectedOption]);

    // function navigate to login page
    const handleNavigateToLoginPage = useCallback(() => {
        navigate('/login', { state: { from: pathname } });
        setShowModalBuyNow(false);
    }, [navigate, pathname]);

    // function navigate to product detail
    const handleNavigateToProductDetail = useCallback(() => {
        navigate(`/product-detail/${id}`);
    }, [navigate, id]);

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
            <div className='absolute top-2 left-2 z-10 flex gap-2'>
                <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {style}
                </span>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {waterproof}ATM
                </span>
            </div>

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

            {/*  Product info */}
            <div onClick={handleNavigateToProductDetail} className='w-full px-4 py-3 cursor-pointer'>
                <div className='mb-3'>
                    <h3
                        className='text-lg font-semibold text-gray-700 
                        hover:text-gray-900 transition-colors duration-300'
                    >
                        {productName}
                    </h3>
                </div>

                {option && (
                    <div className='space-y-3'>
                        <div className='flex gap-2'>{renderColorOptions}</div>
                        {priceDisplay}
                    </div>
                )}
            </div>

            {/* Button buy */}
            <div className='w-full'>
                <Button
                    onClick={() => setShowModalBuyNow(true)}
                    className={`w-full rounded-t-none font-medium py-1 focus:!ring-0 ${
                        !tokenUser && 'bg-black hover:!bg-gray-500 dark:bg-gray-700'
                    }`}
                >
                    Mua hàng ngay
                </Button>
            </div>

            {/* Modal Buy Now */}
            <Modal size='md' popup show={showModalBuyNow} onClose={() => setShowModalBuyNow(false)}>
                {tokenUser ? (
                    <>
                        <Modal.Header />
                        <Modal.Body>
                            <div className='flex flex-col justify-center items-center'>
                                <Swiper className='h-full w-full rounded-lg' loop={true} spaceBetween={0}>
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
                                <h4 className='mt-4 text-lg sm:text-xl font-semibold text-gray-800'>{productName}</h4>
                                <p className='text-sm sm:text-base text-gray-500'>
                                    {sizeProduct} | {handleRenderGenderUser} giới
                                </p>
                                <p className='text-lg font-semibold sm:text-xl text-blue-500'>
                                    {selectedOption && priceFormat(selectedOption.price - selectedOption.discount)}
                                </p>
                                <div className='flex items-center mt-4'>
                                    <Button
                                        className='focus:!ring-0'
                                        pill
                                        color={'gray'}
                                        onClick={handleQuantityDecrease}
                                    >
                                        -
                                    </Button>
                                    <span className='text-center font-semibold text-lg w-10 sm:w-12'>{quantity}</span>
                                    <Button
                                        className='focus:!ring-0'
                                        pill
                                        color={'gray'}
                                        onClick={handleQuantityIncrease}
                                    >
                                        +
                                    </Button>
                                </div>
                                <Button className='w-full mt-4 focus:!ring-0' onClick={handleBuyNow}>
                                    Mua hàng ngay
                                </Button>
                            </div>
                        </Modal.Body>
                    </>
                ) : (
                    <Modal show={showModalBuyNow} size='md' popup>
                        <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                            <CiWarning size='70px' color={'red'} />
                            <span className='text-lg font-medium text-black'>Bạn cần đăng nhập để mua hàng</span>
                            <div className='w-full flex justify-between items-center gap-x-5'>
                                <Button
                                    outline
                                    className='w-full focus:!ring-0'
                                    onClick={() => setShowModalBuyNow(false)}
                                >
                                    Hủy
                                </Button>
                                <Button className='w-full focus:!ring-0' onClick={handleNavigateToLoginPage}>
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
