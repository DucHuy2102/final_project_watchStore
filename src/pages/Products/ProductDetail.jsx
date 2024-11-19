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

export default function ProductDetail() {
    // redux
    const tokenUser = useSelector((state) => state.user.access_token);

    // format price to VND
    const formatPrice = useCallback(
        (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
        [],
    );

    // check color is light or dark
    const isLightColor = useCallback((color) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 155;
    }, []);

    // PR product
    const prProduct = useCallback(
        [
            {
                id: 1,
                url: '//timex.com/cdn/shop/files/Steel.svg?v=1688056464&width=40',
                title: 'Chất liệu vỏ đồng hồ',
                description:
                    'Vỏ đồng hồ được làm từ các chất liệu cao cấp, mang đến độ bền và sang trọng cho sản phẩm.',
            },
            {
                id: 2,
                url: '//timex.com/cdn/shop/files/Adjustable_Watch.svg?v=1688056476&width=40',
                title: 'Chất lượng dây đồng hồ',
                description:
                    'Dây đồng hồ được làm từ các chất liệu chọn lọc, có khả năng chịu nước ở độ sâu nhất định, giúp thoải mái sử dụng trong mọi hoàn cảnh.',
            },
            {
                id: 3,
                url: '//timex.com/cdn/shop/files/Stopwatch_bc7a4d6c-d8af-4131-a0f5-a68fa54e5f5c.svg?v=1688056464&width=40',
                title: 'Đồng hồ bấm giờ',
                description:
                    'Đồng hồ có tính năng bấm giờ chính xác, kích thước mặt đồng hồ phù hợp với cỡ cổ tay của bạn, giúp tự tin và thoải mái hơn khi đeo.',
            },
            {
                id: 4,
                url: '//timex.com/cdn/shop/files/Water_Resistant.svg?v=1687971970&width=40',
                title: 'Khả năng chống nước',
                description:
                    'Đồng hồ có khả năng chống nước đáp ứng các tiêu chuẩn an toàn, dây đồng hồ được làm từ chất liệu cao cấp, giúp bạn thoải mái sử dụng trong thời gian dài.',
            },
            {
                id: 5,
                url: 'https://timex.com/cdn/shop/files/Calendar.svg?v=1687971335&width=40',
                title: 'Tính năng xem ngày',
                description:
                    'Đồng hồ có tính năng xem ngày hiện đại và tiện dụng, độ dày phù hợp với cỡ cổ tay của bạn, giúp tự tin và thoải mái hơn khi sử dụng.',
            },
            {
                id: 6,
                url: 'https://timex.com/cdn/shop/files/Fits_Wrist.svg?v=1688403513&width=40',
                title: 'Tương thích với cỡ cổ tay',
                description:
                    'Đồng hồ nhẹ và tương thích với mọi cỡ cổ tay, trọng lượng nhẹ giúp bạn thoải mái sử dụng trong thời gian dài mà không gây khó chịu.',
            },
        ],
        [],
    );

    // state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [quantityProduct, setQuantityProduct] = useState(0);
    const [showModalBuyNow, setShowModalBuyNow] = useState(false);
    const [moreProduct, setMoreProduct] = useState([]);

    // call API to get product detail by productId
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
        getProductDetail();
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

    // selected COLOR of product
    const [selectedColor, setSelectedColor] = useState(
        option?.find((opt) => opt.value.state === 'saling')?.key || null,
    );

    // selected OPTION of product
    const [selectedOption, setSelectedOption] = useState(null);

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
    const handleColorSelect = useCallback(
        (color) => {
            setSelectedColor(color);
            const newOption = product?.option?.find((opt) => opt.key === color);
            setSelectedOption(newOption);
            setQuantityProduct(0);
        },
        [product?.option],
    );

    // navgigate to another product detail page
    const handleNavigateToProductDetail = useCallback(
        (productId) => {
            console.log(productId);
            navigate(`/product-detail/${productId}`);
        },
        [navigate],
    );

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
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/add-product-to-cart`,
                {
                    product: id,
                    quantity: quantityProduct,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                const data = res.data;
                dispatch(
                    addProductToCart({
                        idCart: data.id,
                        idProduct: product.id,
                        productItem: product,
                        quantity: quantityProduct,
                        discountPrice: discount,
                    }),
                );
                toast.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setQuantityProduct(0);
        }
    }, [selectedColor, id, quantityProduct, tokenUser, dispatch, product, discount]);

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

    // toggle description
    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

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

    // function navigate to login page
    const handleNavigateToLoginPage = () => {
        navigate('/login', { state: { from: pathname } });
        setShowModalBuyNow(false);
    };

    // function buy now product
    const handleBuyNow = () => {
        console.log('Buy now product', product);
        const totalAmountToPay = quantityProduct * (price - discount);
        dispatch(
            setProductToCheckout({
                productItems: product,
                totalPrice: price * quantityProduct,
                totalDiscountPrice: discount * quantityProduct,
                totalAmountToPay: totalAmountToPay,
                totalQuantity: quantityProduct,
                isBuyNow: true,
            }),
        );
        navigate('/checkout');
    };

    return (
        <div className='min-h-screen bg-[#f8f9fb] dark:bg-gray-900'>
            {/* Hero section with breadcrumb */}
            <div className='px-20 pt-1'>
                <Breadcrumb_Component displayName={productName} />
            </div>

            <div className='px-10 mt-1 lg:max-w-7xl max-w-4xl mx-auto'>
                {/* Product main section */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 mb-8'>
                    <div className='grid items-start grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8'>
                        {/* Left: Image gallery */}
                        <div className='space-y-6'>
                            <Swiper
                                loop={true}
                                spaceBetween={0}
                                modules={[Navigation, Autoplay]}
                                autoplay={{ delay: 4000 }}
                                navigation
                                className='aspect-square rounded-xl overflow-hidden bg-gray-50'
                            >
                                {img.map((item, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={item} alt='Image' className='w-full h-full object-contain' />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            <div className='grid grid-cols-5 gap-3'>
                                {img.slice(0, 5).map((item, index) => (
                                    <div
                                        key={index}
                                        className='aspect-square rounded-lg overflow-hidden cursor-pointer
                                        border hover:border-blue-500 transition-all bg-gray-50'
                                    >
                                        <img src={item} alt='Thumbnail' className='w-full h-full object-contain p-2' />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Product info */}
                        <div className='space-y-8'>
                            {/* Brand & Name */}
                            <div className='space-y-2'>
                                <h3 className='text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wide uppercase'>
                                    {brand}
                                </h3>
                                <h1 className='text-3xl font-bold text-gray-900 dark:text-white tracking-tight'>
                                    {productName}
                                </h1>
                            </div>

                            {/* Price */}
                            <div className='p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-2'>
                                {prices.discount !== 0 ? (
                                    <>
                                        <div className='flex items-baseline gap-x-3'>
                                            <p className='text-3xl font-bold text-blue-600'>{prices.discountPrice}</p>
                                            <p className='text-xl text-gray-400 line-through'>{prices.priceFormat}</p>
                                        </div>
                                        <div className='inline-block px-3 py-1 text-sm font-semibold text-red-600 bg-red-50 rounded-full'>
                                            Tiết kiệm {prices.percentDiscount}%
                                        </div>
                                    </>
                                ) : (
                                    <p className='text-3xl font-bold text-blue-600'>{prices.priceFormat}</p>
                                )}
                            </div>

                            {/* Color selection */}
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-base font-medium text-gray-900 dark:text-white'>Màu sắc</h3>
                                    {selectedOption && (
                                        <span className='text-sm text-gray-600 dark:text-gray-400 font-semibold'>
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
                            <div className='space-y-4'>
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
                            <div className='grid grid-cols-2 gap-4 pt-4'>
                                <Button
                                    onClick={handleAddProductToCart}
                                    className='w-full font-medium text-base py-2.5 !ring-0'
                                >
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button
                                    onClick={handleVerifyUser}
                                    className='w-full font-medium text-base py-2.5 !ring-0'
                                >
                                    Mua ngay
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product details tabs */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 mb-8'>
                    <Tabs>
                        <Tabs.Item title='Mô tả sản phẩm'>
                            <div className='prose dark:prose-invert max-w-none py-6'>
                                <p className='text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line'>
                                    {description}
                                </p>
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

                {/* Features section with new design */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8 mb-8'>
                    <h2 className='text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white'>
                        Tính năng nổi bật
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {prProduct.map((item) => (
                            <div
                                key={item.id}
                                className='group p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 
                                dark:from-gray-700 dark:to-gray-800
                                hover:shadow-lg transition-all duration-300
                                transform hover:-translate-y-1'
                            >
                                <div className='flex flex-col items-center text-center'>
                                    <div
                                        className='w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30
                                        flex items-center justify-center group-hover:scale-110 transition-transform'
                                    >
                                        <img src={item.url} alt={item.title} className='w-10 h-10 object-contain' />
                                    </div>
                                    <h3 className='text-lg font-semibold mb-3 text-gray-900 dark:text-white'>
                                        {item.title}
                                    </h3>
                                    <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related products with enhanced design */}
                <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 p-8'>
                    <h2 className='text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white'>
                        Sản phẩm liên quan
                    </h2>
                    <Swiper
                        spaceBetween={24}
                        slidesPerView={1}
                        navigation
                        autoplay={{ delay: 4000 }}
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
                                        group-hover:text-blue-600 transition-colors line-clamp-2'
                                    >
                                        {product.productName}
                                    </h3>
                                    <p className='text-sm text-gray-500 mb-2'>{product.brand}</p>
                                    <p className='font-bold text-blue-600'>{formatPrice(product.price)}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <Modal show={showModalBuyNow} size='md' popup>
                    <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                        <CiWarning size='70px' color={'#FFE31A'} />
                        <span className='text-lg font-medium text-black'>Bạn cần đăng nhập để mua hàng</span>
                        <div className='w-full flex justify-between items-center gap-x-5'>
                            <Button outline className='w-full focus:!ring-0' onClick={() => setShowModalBuyNow(false)}>
                                Hủy
                            </Button>
                            <Button className='w-full focus:!ring-0' onClick={handleNavigateToLoginPage}>
                                Đăng nhập
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}
