import { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Modal, Spinner } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CiWarning } from 'react-icons/ci';
import { setProductToCheckout } from '../../../services/redux/slices/checkoutSlice';
import { Tag, Tooltip } from 'antd';
import { BsCheck, BsArrowLeftRight } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { toggleCompareProduct, toggleLikeProduct } from '../../../services/redux/slices/productSlice';

const isLightColor = (hex) => {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
};

export default function ProductCard({ product }) {
    console.log(product);
    const { id, productName, img, genderUser, style, waterproof, option } = product;
    const handleRenderGenderUser = useMemo(() => {
        return genderUser === 'Nam' ? 'Nam' : 'Nữ';
    }, [genderUser]);

    // state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [loadingEffect, setLoadingEffect] = useState(false);
    const [selectedColor, setSelectedColor] = useState(option?.[0]?.key);
    const { compareProducts } = useSelector((state) => state.product);
    const isInCompare = compareProducts?.some((p) => p.id === product.id);
    const { likedProducts } = useSelector((state) => state.product);
    const isLiked = likedProducts?.some((p) => p.id === product.id);

    const priceFormat = useCallback((price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }, []);

    const handleQuantityDecrease = (e) => {
        e.stopPropagation();
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleQuantityIncrease = (e) => {
        e.stopPropagation();
        setQuantity((prev) => prev + 1);
    };

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
                className={`w-8 h-8 rounded-full relative flex items-center justify-center
                    ${opt.value.state === 'soldOf' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    transition-all duration-200 hover:scale-110`}
                disabled={opt.value.state === 'soldOf'}
                title={opt.value.color}
            >
                <div
                    className={`absolute inset-0 rounded-full border-2
                        ${selectedColor === opt.key && 'border-blue-500'}`}
                    style={{ backgroundColor: opt.key }}
                />
                {selectedColor === opt.key && (
                    <BsCheck
                        className={`z-10 text-xl
                            ${isLightColor(opt.key) ? 'text-black' : 'text-white'}`}
                    />
                )}
            </button>
        ));
    }, [option, selectedColor, handleColorSelect]);

    const selectedOption = option?.find((opt) => opt.key === selectedColor)?.value;
    const priceDisplay = useMemo(() => {
        if (!selectedOption) return null;

        const finalPrice = selectedOption.price - selectedOption.discount;
        const discountPercent = Math.round((selectedOption.discount / selectedOption.price) * 100);

        return (
            <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-gray-900'>{priceFormat(finalPrice)}</span>
                {selectedOption.discount > 0 && (
                    <>
                        <span className='text-sm text-gray-500 line-through'>{priceFormat(selectedOption.price)}</span>
                        <Tag color='red'>-{discountPercent}%</Tag>
                    </>
                )}
            </div>
        );
    }, [selectedOption, priceFormat]);

    // function buy now
    const handleBuyNow = useCallback(() => {
        if (!selectedOption) return;
        const keyColor = option?.find((opt) => opt.key === selectedColor).key;
        dispatch(
            setProductToCheckout({
                productItems: {
                    option: keyColor,
                    productItem: product,
                    quantity: quantity,
                },
                totalQuantity: quantity,
                isBuyNow: true,
            }),
        );
        setLoadingEffect(true);
        setTimeout(() => {
            setLoadingEffect(false);
            navigate('/checkout');
        }, 1500);
        setShowModalBuyNow(false);
    }, [dispatch, navigate, option, product, quantity, selectedColor, selectedOption]);

    const handleCompare = (e) => {
        e.stopPropagation();
        if (compareProducts?.length >= 2 && !isInCompare) {
            toast.warning('Chỉ có thể so sánh 2 sản phẩm!');
            return;
        }
        dispatch(toggleCompareProduct(product));
    };

    const handleLike = (e) => {
        e.stopPropagation();
        dispatch(toggleLikeProduct(product));
    };

    // loading
    if (loadingEffect) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        );
    }

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
            <div className='absolute top-2 left-2 z-20 flex gap-2 [&>*]:backdrop-blur-none'>
                <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {style}
                </span>
                <span className='bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full'>
                    {waterproof}ATM
                </span>
            </div>

            <div className='absolute top-2 right-2 z-20 flex gap-2'>
                <button
                    onClick={handleLike}
                    className={`p-2 rounded-full transition-all duration-300 ${
                        isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    {isLiked ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
                </button>
                <button
                    onClick={handleCompare}
                    className={`p-2 rounded-full transition-all duration-300 ${
                        isInCompare ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <BsArrowLeftRight size={20} />
                </button>
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
                                className='h-auto w-auto cursor-pointer rounded-lg object-cover 
                                transition-transform duration-500 ease-in-out transform hover:scale-105'
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/*  Product info */}
            <div onClick={() => navigate(`/product-detail/${id}`)} className='w-full px-4 py-3 cursor-pointer'>
                <div className='mb-3'>
                    <h3
                        className='text-lg font-semibold text-gray-700 
                        hover:text-gray-900 transition-colors duration-300'
                    >
                        {productName}
                    </h3>
                </div>

                <div className='space-y-3'>
                    <div className='flex gap-2'>{renderColorOptions}</div>
                    {priceDisplay}
                </div>
            </div>

            {/* Button buy */}
            <div className='w-full'>
                <Button
                    onClick={() => setShowModalBuyNow(true)}
                    className={`w-full rounded-t-none font-medium py-1 focus:!ring-0 ${
                        !tokenUser &&
                        'bg-black hover:!bg-black dark:bg-white dark:text-black dark:border-t-black dark:hover:!bg-white'
                    }`}
                >
                    Mua hàng ngay
                </Button>
            </div>

            {/* Modal Buy Now */}
            <Modal
                className='backdrop-blur-md'
                size='md'
                popup
                show={showModalBuyNow}
                onClose={() => setShowModalBuyNow(false)}
            >
                {tokenUser ? (
                    <>
                        <Modal.Header />
                        <Modal.Body className='overflow-hidden'>
                            <div className='flex flex-col justify-center items-center'>
                                <div className='w-full max-w-md overflow-hidden rounded-lg shadow-lg'>
                                    <Swiper className='h-[350px] w-full rounded-lg' loop={true} spaceBetween={0}>
                                        {img.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={item}
                                                    alt={productName}
                                                    className='h-full w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-105'
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                                <div className='w-full mt-6 space-y-3'>
                                    <Link to={`/product-detail/${id}`}>
                                        <h4 className='text-xl font-bold text-gray-900 text-center truncate'>
                                            {productName}
                                        </h4>
                                    </Link>
                                    <div className='flex items-center justify-center gap-4 text-gray-600'>
                                        <p className='text-base flex items-center gap-2'>
                                            Màu sắc đã chọn:{' '}
                                            <span
                                                className='inline-block rounded-full w-5 h-5 border shadow-sm'
                                                style={{
                                                    backgroundColor: selectedColor,
                                                    border: isLightColor(selectedColor) ? '1px solid #e2e8f0' : 'none',
                                                }}
                                            />
                                        </p>
                                        <span className='w-px h-4 bg-gray-400' />
                                        <p className='text-base'>{handleRenderGenderUser} giới</p>
                                    </div>
                                    <p className='text-2xl font-bold text-blue-600 text-center'>
                                        {selectedOption &&
                                            priceFormat((selectedOption.price - selectedOption.discount) * quantity)}
                                    </p>

                                    <div className='flex items-center justify-center'>
                                        <Button
                                            className='focus:!ring-0 !px-2 !font-bold'
                                            pill
                                            color={'gray'}
                                            onClick={handleQuantityDecrease}
                                        >
                                            −
                                        </Button>
                                        <span className='text-center font-semibold text-xl w-12'>{quantity}</span>
                                        <Button
                                            className='focus:!ring-0 !px-2 !font-bold'
                                            pill
                                            color={'gray'}
                                            onClick={handleQuantityIncrease}
                                        >
                                            +
                                        </Button>
                                    </div>

                                    <Button
                                        className='w-full !bg-blue-500 hover:!bg-blue-600 !text-white font-medium 
                                        py-2 focus:!ring-0 transition-all duration-300'
                                        onClick={handleBuyNow}
                                    >
                                        Tiến hành mua hàng
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </>
                ) : (
                    <Modal className='backdrop-blur-md' show={showModalBuyNow} size='md' popup>
                        <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                            <CiWarning size='70px' className='text-yellow-300' />
                            <span className='text-lg font-medium text-black'>Bạn cần đăng nhập để mua hàng</span>
                            <div className='w-full flex justify-between items-center gap-4'>
                                <Button
                                    color='gray'
                                    onClick={() => setShowModalBuyNow(false)}
                                    className='w-full hover:shadow-sm hover:scale-105 transition-all duration-300 rounded-xl !text-black !ring-0'
                                >
                                    Hủy
                                </Button>
                                <Button
                                    color='blue'
                                    onClick={() => {
                                        navigate('/login', { state: { from: pathname } });
                                        setShowModalBuyNow(false);
                                    }}
                                    className='w-full hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl !ring-0'
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                )}
            </Modal>
        </div>
    );
}
