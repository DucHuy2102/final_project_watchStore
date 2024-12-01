import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Button, Modal, Spinner, Tabs } from 'flowbite-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addProductToCart } from '../../services/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumb_Component } from '../../components/exportComponent';
import { setProductToCheckout } from '../../services/redux/slices/checkoutSlice';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { CiWarning } from 'react-icons/ci';
import { Image } from 'antd';
import { formatWatchDescription, prProduct } from '../../components/Utils/infomationComponent';
import { ListReview, Policy, Review } from './components/exportCom_Product';

export default function ProductDetail() {
    const formatPrice = useCallback(
        (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        [],
    );

    const isLightColor = (color) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    };

    // state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const { pathname } = useLocation();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadingEffect, setLoadingEffect] = useState(false);
    const [quantityProduct, setQuantityProduct] = useState(0);
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);
    const [moreProduct, setMoreProduct] = useState([]);
    const [isBuyThisProduct, setIsBuyThisProduct] = useState(true);
    const [listReviews, setListReviews] = useState([]);
    console.log(isBuyThisProduct);

    const getReviewsByProductId = async () => {
        try {
            setLoadingEffect(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/client/get-reviews-by-product`, {
                params: { productId: id },
            });
            if (res?.status === 200) {
                setListReviews(res.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingEffect(false);
        }
    };

    const checkIsBuyThisProduct = async () => {
        try {
            setLoadingEffect(true);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/order/is-ordered`, null, {
                params: { productId: id },
                headers: {
                    Authorization: `Bearer ${tokenUser}`,
                },
            });
            if (res?.status === 200) {
                const { data } = res;
                setIsBuyThisProduct(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingEffect(false);
        }
    };

    // call API to get product detail
    useEffect(() => {
        const getProductDetail = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/client/product`, {
                    params: { productId: id },
                });
                if (res?.status === 200) {
                    const data = res.data;
                    setProduct(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        checkIsBuyThisProduct();
        getProductDetail();
        getReviewsByProductId();
    }, [id]);

    // destructuring product detail
    const {
        img,
        productName,
        brand,
        origin,
        discount,
        price,
        description,
        wireMaterial,
        shellMaterial,
        style,
        feature,
        shape,
        waterproof,
        weight,
        genderUser,
        category,
        length,
        width,
        height,
        option,
    } = product;

    const sizeProduct = length === width ? `${length} mm` : `${length} x ${width} mm`;

    // specifications of product detail
    const specifications = useMemo(
        () => [
            {
                id: 1,
                title: 'Thương Hiệu',
                value: brand,
            },
            {
                id: 2,
                title: 'Xuất xứ',
                value: origin,
            },
            {
                id: 3,
                title: 'Độ dầy',
                value: `${height} mm`,
            },
            {
                id: 4,
                title: 'Kích thước mặt',
                value: sizeProduct,
            },
            {
                id: 5,
                title: 'Chất liệu dây',
                value: wireMaterial,
            },
            {
                id: 6,
                title: 'Chất liệu vỏ',
                value: shellMaterial,
            },
            {
                id: 7,
                title: 'Phong cách',
                value: style,
            },
            {
                id: 8,
                title: 'Tính năng',
                value: feature,
            },
            {
                id: 9,
                title: 'Hình dạng',
                value: shape,
            },
            {
                id: 10,
                title: 'Kháng nước',
                value: `${waterproof}atm`,
            },
            {
                id: 11,
                title: 'Trọng lượng',
                value: `${weight} g`,
            },
            {
                id: 12,
                title: 'Đối tượng sử dụng',
                value: genderUser,
            },
        ],
        [
            brand,
            feature,
            genderUser,
            height,
            origin,
            shape,
            shellMaterial,
            sizeProduct,
            style,
            waterproof,
            weight,
            wireMaterial,
        ],
    );

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedColor, setSelectedColor] = useState(
        option?.find((opt) => opt.value.state === 'saling')?.key || null,
    );

    useEffect(() => {
        if (product?.option?.length > 0) {
            const defaultOption = product.option.find((opt) => opt.value.state === 'saling') || product.option[0];
            if (defaultOption) {
                setSelectedColor(defaultOption.key);
                setSelectedOption(defaultOption);
            }
        }
    }, [product]);

    // available colors of product
    const availableColors = useMemo(() => {
        return product?.option?.map((opt) => opt.key) || [];
    }, [product?.option]);

    // selected option of product
    const selectedOptionDetails = useMemo(() => {
        if (!selectedColor || !product?.option) return null;
        return product.option.find((opt) => opt.key === selectedColor);
    }, [selectedColor, product?.option]);

    // price, discount, priceFormat, discountPrice, percentDiscount of product
    const prices = useMemo(() => {
        if (!selectedOptionDetails)
            return {
                price: price,
                discount: discount,
                priceFormat: formatPrice(price),
                discountPrice: formatPrice(price - discount),
                percentDiscount: discount !== 0 ? Math.floor((discount / price) * 100) : 0,
            };

        const optPrice = selectedOptionDetails.value.price;
        const optDiscount = selectedOptionDetails.value.discount;

        return {
            price: optPrice,
            discount: optDiscount,
            priceFormat: formatPrice(optPrice),
            discountPrice: formatPrice(optPrice - optDiscount),
            percentDiscount: optDiscount !== 0 ? Math.floor((optDiscount / optPrice) * 100) : 0,
        };
    }, [selectedOptionDetails, price, discount, formatPrice]);

    // handle select color of product
    const handleColorSelect = (color) => {
        setSelectedColor(color);
        const newOption = product?.option?.find((opt) => opt.key === color);
        setSelectedOption(newOption);
        setQuantityProduct(0);
    };

    // navgigate to another product detail page
    const handleNavigateToProductDetail = (productId) => {
        navigate(`/product-detail/${productId}`);
    };

    // function add product to cart
    const handleAddProductToCart = useCallback(async () => {
        if (!tokenUser) {
            setShowModalBuyNow(true);
            return;
        }
        if (!selectedColor) {
            toast.error('Vui lòng chọn màu sắc sản phẩm');
            return;
        }
        if (quantityProduct === 0) {
            toast.error('Vui lòng chọn số lượng sản phẩm');
            return;
        }
        try {
            setLoadingEffect(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/add-product-to-cart`,
                {
                    product: id,
                    quantity: quantityProduct,
                    option: selectedColor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                const { data } = res;
                console.log(data);
                dispatch(
                    addProductToCart({
                        idCart: data.id,
                        productItem: product,
                        quantity: quantityProduct,
                        option: selectedColor,
                    }),
                );
                toast.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setQuantityProduct(0);
            setLoadingEffect(false);
        }
    }, [tokenUser, selectedColor, id, quantityProduct, dispatch, product]);

    // get more product of the same brand
    useEffect(() => {
        const getMoreProduct = async () => {
            if (!category) return;
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/client/category`, {
                    params: { idCategory: category },
                });
                if (res?.status === 200) {
                    const { data } = res;
                    setMoreProduct(data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMoreProduct();
    }, [category]);

    useEffect(() => {
        if (product?.option?.length > 0) {
            const defaultOption = product.option.find((opt) => opt.value.state === 'saling');
            if (defaultOption) {
                setSelectedColor(defaultOption.key);
                setSelectedOption(defaultOption);
            }
        }
    }, [product]);

    // loading
    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        );
    }

    // handle verify user to buy now product:
    // if user not login, show modal to login page
    // else, handle buy now product
    const handleVerifyUser = () => {
        if (!tokenUser) {
            setShowModalBuyNow(true);
        } else {
            handleBuyNow();
        }
    };

    // function buy now product
    const handleBuyNow = () => {
        if (quantityProduct === 0) {
            toast.error('Vui lòng chọn số lượng sản phẩm');
            return;
        }
        dispatch(
            setProductToCheckout({
                productItems: {
                    option: selectedColor,
                    productItem: product,
                    quantity: quantityProduct,
                },
                totalQuantity: quantityProduct,
                isBuyNow: true,
            }),
        );
        setLoadingEffect(true);
        setTimeout(() => {
            setLoadingEffect(false);
            navigate('/checkout');
        }, 1500);
    };

    return (
        <div className='min-h-screen bg-gradient-to-b from-[#f8f9fb] to-white dark:from-gray-900 dark:to-gray-800'>
            {/* Breadcrumb */}
            <div className='px-20 pt-5'>
                <Breadcrumb_Component displayName={productName} />
            </div>

            <div className='px-10 py-2 lg:max-w-7xl max-w-4xl mx-auto'>
                {/* Product detail */}
                <div
                    className='bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 p-10 mb-10
                    backdrop-blur-xl backdrop-filter'
                >
                    <div className='grid items-start grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10'>
                        {/* Left: Image gallery */}
                        <div className='space-y-6'>
                            <Swiper
                                loop={true}
                                spaceBetween={0}
                                modules={[Navigation, Autoplay]}
                                autoplay={{ delay: 4000 }}
                                navigation
                                className='aspect-square rounded-2xl overflow-hidden bg-gray-50 
                                shadow-md hover:shadow-xl transition-shadow duration-300'
                            >
                                {img.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <Image
                                            src={item}
                                            preview={{
                                                mask: (
                                                    <div
                                                        className='text-sm font-medium bg-black/50 backdrop-blur-sm 
                                                    text-white px-3 py-1 rounded-full'
                                                    >
                                                        Xem ảnh
                                                    </div>
                                                ),
                                            }}
                                            alt='Image'
                                            className='w-full h-full object-contain'
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className='grid grid-cols-5 gap-4'>
                                {img.slice(0, 5).map((item, index) => (
                                    <div
                                        key={index}
                                        className='aspect-square rounded-xl overflow-hidden cursor-pointer
                                        border-2 hover:border-blue-500 transition-all bg-gray-50
                                        hover:shadow-lg transform hover:scale-105 duration-300'
                                    >
                                        <Image
                                            src={item}
                                            preview={{
                                                mask: (
                                                    <div
                                                        className='text-sm font-medium bg-black/50 backdrop-blur-sm 
                                                    text-white px-3 py-1 rounded-full'
                                                    >
                                                        Xem ảnh
                                                    </div>
                                                ),
                                            }}
                                            alt='Thumbnail'
                                            className='w-full h-full object-contain p-2'
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product info */}
                        <div className='space-y-6'>
                            {/* Brand & Name */}
                            <div className='space-y-3'>
                                <h3 className='text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase'>
                                    {brand}
                                </h3>
                                <h1 className='text-4xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight'>
                                    {productName}
                                </h1>
                            </div>

                            {/* Price */}
                            <div
                                className='p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 
                                dark:to-gray-600 rounded-2xl space-y-3 shadow-inner'
                            >
                                {prices.discount !== 0 ? (
                                    <>
                                        <div className='flex items-baseline gap-x-4'>
                                            <p
                                                className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 
                                                bg-clip-text text-transparent'
                                            >
                                                {prices.discountPrice}
                                            </p>
                                            <p className='text-xl text-gray-400 line-through'>{prices.priceFormat}</p>
                                        </div>
                                        <div
                                            className='inline-block px-4 py-1.5 text-sm font-bold text-red-600 
                                            bg-red-50 rounded-full shadow-sm'
                                        >
                                            Tiết kiệm {prices.percentDiscount}%
                                        </div>
                                    </>
                                ) : (
                                    <p
                                        className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 
                                        bg-clip-text text-transparent'
                                    >
                                        {prices.priceFormat}
                                    </p>
                                )}
                            </div>

                            {/* Color selection */}
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Màu sắc</h3>
                                    {selectedOption && (
                                        <span
                                            className='px-4 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-full
                                            text-sm text-blue-600 dark:text-blue-400 font-medium'
                                        >
                                            Còn {selectedOption.value.quantity} sản phẩm
                                        </span>
                                    )}
                                </div>
                                <div className='flex flex-wrap gap-4'>
                                    {availableColors.map((color, index) => {
                                        const option = product.option[index];
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleColorSelect(color)}
                                                className={`
                                                    group relative w-14 h-14 rounded-2xl transition-all duration-300
                                                    ${
                                                        selectedColor === color &&
                                                        'ring-2 ring-offset-0 ring-blue-500 scale-110'
                                                    }
                                                `}
                                            >
                                                <span
                                                    style={{ backgroundColor: color }}
                                                    className='absolute inset-0 rounded-2xl'
                                                />
                                                {selectedColor === color && (
                                                    <span
                                                        className={`
                                                        absolute inset-0 flex items-center justify-center
                                                        ${isLightColor(color) ? 'text-gray-900' : 'text-white'}
                                                    `}
                                                    >
                                                        ✓
                                                    </span>
                                                )}
                                                <span className='sr-only'>{option.value.color}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                {selectedOption && (
                                    <p className='text-sm text-gray-600'>
                                        Màu đã chọn: <span className='font-medium'>{selectedOption.value.color}</span>
                                    </p>
                                )}
                            </div>

                            {/* Quantity selector */}
                            <div className='flex items-center gap-x-5'>
                                <h3 className='text-base font-medium text-gray-900 dark:text-white'>Số lượng</h3>
                                <div className='flex items-center gap-x-6'>
                                    <div className='flex items-center border border-gray-200 rounded-lg bg-white'>
                                        <button
                                            onClick={() => setQuantityProduct(Math.max(0, quantityProduct - 1))}
                                            disabled={quantityProduct === 0}
                                            className='p-3 text-gray-600 hover:text-blue-600 disabled:opacity-50'
                                        >
                                            <FiMinus className='w-4 h-4' />
                                        </button>
                                        <span className='w-16 text-center font-medium'>{quantityProduct}</span>
                                        <button
                                            onClick={() => setQuantityProduct(quantityProduct + 1)}
                                            disabled={
                                                !selectedOption || quantityProduct >= selectedOption.value.quantity
                                            }
                                            className='p-3 text-gray-600 hover:text-blue-600 disabled:opacity-50'
                                        >
                                            <FiPlus className='w-4 h-4' />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className='grid grid-cols-2 gap-6'>
                                <Button
                                    disabled={loadingEffect}
                                    onClick={handleAddProductToCart}
                                    className='w-full font-semibold text-base py-3 !ring-0
        transition-all duration-300 transform hover:scale-105'
                                >
                                    {loadingEffect ? (
                                        <div className='flex items-center justify-center gap-2'>
                                            <Spinner size='sm' />
                                            <span>Đang thêm...</span>
                                        </div>
                                    ) : (
                                        'Thêm vào giỏ hàng'
                                    )}
                                </Button>
                                <Button
                                    disabled={loadingEffect}
                                    onClick={handleVerifyUser}
                                    className='w-full font-semibold text-base py-3 !ring-0
        bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 
        hover:to-gray-700 transition-all duration-300 transform hover:scale-105'
                                >
                                    {loadingEffect ? (
                                        <div className='flex items-center justify-center gap-2'>
                                            <Spinner size='sm' />
                                            <span>Đang xử lý...</span>
                                        </div>
                                    ) : (
                                        'Mua ngay'
                                    )}
                                </Button>
                            </div>

                            {/* Policy section */}
                            <Policy />
                        </div>
                    </div>
                </div>

                {/* Product details tabs */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 mb-8'>
                    <Tabs className='focus:!ring-0 !outline-none'>
                        <Tabs.Item title='Mô tả sản phẩm'>
                            <div className='prose dark:prose-invert max-w-none py-6'>
                                <div
                                    className='space-y-6'
                                    dangerouslySetInnerHTML={{
                                        __html: formatWatchDescription(description, productName)
                                            .split('\n')
                                            .map(
                                                (paragraph) =>
                                                    `<p class="text-gray-600 dark:text-gray-300 leading-relaxed 
                        hover:text-gray-900 dark:hover:text-white transition-colors duration-300
                        pl-6 relative before:content-[''] before:absolute before:left-0 before:top-3 
                        before:w-2 before:h-2 before:bg-gray-300 dark:before:bg-gray-600 
                        before:rounded-full before:transition-colors before:duration-300
                        hover:before:bg-blue-500 dark:hover:before:bg-blue-400">
                            ${paragraph}
                        </p>`,
                                            )
                                            .join(''),
                                    }}
                                />
                            </div>
                        </Tabs.Item>
                        <Tabs.Item title='Thông số kỹ thuật'>
                            <div className='py-6'>
                                <dl className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {specifications.map((spec) => (
                                        <div
                                            key={spec.id}
                                            className='flex flex-col p-4 rounded-xl bg-gray-50 dark:bg-gray-700
                                            hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-300'
                                        >
                                            <dt className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                                                {spec.title}
                                            </dt>
                                            <dd className='text-base font-medium text-gray-900 dark:text-white'>
                                                {spec.value}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        </Tabs.Item>
                    </Tabs>
                </div>

                {/* Features section */}
                <div
                    className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 mb-8
    bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900'
                >
                    <h2
                        className='text-2xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-700 
        bg-clip-text text-transparent dark:from-white dark:to-gray-300'
                    >
                        Những tính năng nổi bật của sản phẩm
                    </h2>
                    <div className='grid grid-cols-3 gap-8'>
                        {prProduct.map((item) => (
                            <div
                                key={item.id}
                                className='group relative p-8 rounded-2xl
                    bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                    hover:shadow-xl transition-all duration-700 ease-in-out
                    border border-gray-100 dark:border-gray-700
                    hover:border-blue-100 dark:hover:border-blue-900
                    transform hover:-translate-y-2 hover:scale-[1.02]'
                            >
                                <div
                                    className='absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/0 to-blue-100/0 
                    dark:from-blue-500/0 dark:to-blue-600/0 opacity-0 group-hover:opacity-100 
                    transition-all duration-700 ease-in-out'
                                ></div>

                                <div
                                    className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 via-blue-50/10 to-transparent 
                    dark:from-blue-500/10 rounded-full blur-3xl transition-all duration-700 ease-in-out 
                    opacity-0 group-hover:opacity-100 group-hover:scale-150'
                                ></div>

                                <div className='relative flex flex-col items-center text-center cursor-pointer'>
                                    <div className='relative mb-8'>
                                        <div
                                            className='absolute inset-0 bg-gradient-to-br from-blue-200/30 to-blue-100/20 
                            dark:from-blue-400/20 dark:to-blue-300/10 rounded-full blur-2xl
                            transform scale-75 group-hover:scale-125 transition-all duration-700 ease-in-out'
                                        ></div>
                                        <div
                                            className='relative w-24 h-24 rounded-2xl rotate-45 transform 
                            bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700
                            group-hover:rotate-[225deg] transition-all duration-1000 ease-in-out
                            shadow-lg group-hover:shadow-xl border border-gray-100/50 dark:border-gray-600/30'
                                        >
                                            <div
                                                className='absolute inset-0 flex items-center justify-center -rotate-45
                                group-hover:rotate-[135deg] transition-all duration-1000 ease-in-out'
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={item.title}
                                                    className='w-12 h-12 object-contain transform 
                                    group-hover:scale-110 transition-all duration-700 ease-in-out'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <h3
                                        className='text-lg font-bold mb-3 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 
                        bg-clip-text text-transparent dark:from-white dark:via-gray-200 dark:to-gray-300
                        group-hover:from-blue-600 group-hover:via-blue-500 group-hover:to-blue-600 
                        transition-all duration-700 ease-in-out'
                                    >
                                        {item.title}
                                    </h3>
                                    <p
                                        className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed
                        transition-all duration-700 ease-in-out
                        opacity-80 group-hover:opacity-100 max-w-[250px]
                        transform group-hover:scale-[1.02]'
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related products */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8'>
                    <h2 className='text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white'>
                        Sản phẩm liên quan
                    </h2>
                    <Swiper
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 4 },
                        }}
                        className='!pb-8'
                    >
                        {moreProduct?.map((product) => (
                            <SwiperSlide key={product.id}>
                                <div
                                    onClick={() => handleNavigateToProductDetail(product.id)}
                                    className='group cursor-pointer'
                                >
                                    <div className='aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50'>
                                        <img
                                            src={product.img[0]}
                                            alt={product.productName}
                                            className='w-full h-full object-contain p-4
                                            group-hover:scale-110 transition-transform duration-500'
                                        />
                                    </div>
                                    <h3
                                        className='font-medium text-gray-900 dark:text-white
                                        group-hover:text-blue-600 transition-colors line-clamp-2 truncate'
                                    >
                                        {product.productName}
                                    </h3>
                                    <p className='text-sm text-gray-500 mb-2'>{product.brand}</p>
                                    <p className='font-bold text-blue-600'>{formatPrice(product.priceSafely)}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Review product */}
                <div className='flex flex-col justify-center items-center mb-8 mt-4'>
                    <div className='w-full max-w-4xl mx-auto flex items-center justify-between'>
                        <h3 className='relative inline-block'>
                            <span
                                className='text-2xl font-bold 
                                    bg-gradient-to-r from-gray-800 via-gray-600 to-gray-900
                                    dark:from-gray-100 dark:via-white dark:to-gray-200
                                    bg-clip-text text-transparent
                                    tracking-wide font-serif'
                            >
                                Đánh giá từ khách hàng
                            </span>
                            {listReviews.length > 0 && (
                                <span className='ml-3 inline-flex items-center'>
                                    <span className='text-2xl font-bold text-blue-500'>{listReviews.length}</span>
                                    <span className='ml-1 text-lg text-gray-400 font-light'>đánh giá</span>
                                </span>
                            )}
                            <span
                                className='absolute -bottom-2 left-0 w-2/3 h-0.5
                                    bg-gradient-to-r from-blue-600 to-transparent'
                            ></span>
                        </h3>

                        {isBuyThisProduct && <Review />}
                    </div>

                    <ListReview reviews={listReviews} />
                </div>

                {/* Modal verify user */}
                <Modal show={showModalBuyNow} size='md' popup>
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
            </div>
        </div>
    );
}
