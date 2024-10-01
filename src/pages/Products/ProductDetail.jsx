import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Button, Modal, Spinner } from 'flowbite-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CiWarning } from 'react-icons/ci';
import { addProductToCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumb_Component } from '../../components/exportComponent';

// format price to VND
const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// PR product
const prProduct = [
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
];

export default function ProductDetail() {
    // redux
    const tokenUser = useSelector((state) => state.user.access_token);

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
        thickness,
        size,
        wireMaterial,
        shellMaterial,
        style,
        feature,
        shape,
        waterproof,
        weight,
        color,
        genderUser,
    } = product;

    // loading
    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>
                        Vui lòng chờ trong giây lát...
                    </p>
                </div>
            </div>
        );
    }

    // specifications of product detail
    const specifications = [
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
            value: thickness,
        },
        {
            id: 4,
            title: 'Kích thước mặt',
            value: size,
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
            value: weight,
        },
        {
            id: 12,
            title: 'Màu sắc',
            value: color,
        },
        {
            id: 13,
            title: 'Đối tượng sử dụng',
            value: genderUser,
        },
    ];

    // toggle description
    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    // format price & discountPrice to VND
    const priceFormat = formatPrice(price);
    const discountPrice = formatPrice(price - discount);
    const percentDiscount =
        discount !== 0 && !isNaN(discount) ? Math.floor((discount / price) * 100) : 0;

    // more product of the same brand

    // navgigate to another product detail page
    // const handleNavigateToProductDetail = (productId) => {
    //     const navigateProduct = moreProduct.find((item) => item.id === productId);
    //     navigate(`/product-detail/${productId}`);
    // };

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

    // function add product to cart
    const handleAddProductToCart = async () => {
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
                }
            );
            if (res?.status === 200) {
                const data = res.data;
                dispatch(
                    addProductToCart({
                        idCart: data.id,
                        idProduct: product.id,
                        productItem: product,
                        quantity: quantityProduct,
                    })
                );
                toast.success('Đã thêm sản phẩm vào giỏ hàng');
            }
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setQuantityProduct(0);
        }
    };

    // function buy now product
    const handleBuyNow = () => {
        console.log('Buy now');
    };

    return (
        <div className='p-6 lg:max-w-7xl max-w-4xl mx-auto'>
            <Breadcrumb_Component />

            {/* top: images, info product & 2 buttons */}
            <div
                className='mt-1 grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-5
    gap-x-5 gap-y-5 rounded-lg shadow-md sm:shadow-lg sm:shadow-gray-200 dark:shadow-gray-800 sm:px-5 sm:py-3'
            >
                {/* image product */}
                <div className='w-full md:col-span-1 lg:col-span-3 lg:sticky top-0 text-center'>
                    <Swiper
                        loop={true}
                        spaceBetween={0}
                        modules={[Navigation, Autoplay]}
                        autoplay={{ delay: 4000 }}
                        navigation
                        className='w-full h-auto md:w-[300px] lg:w-[600px] rounded-xl'
                    >
                        {img.map((item, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={item}
                                    alt='Image'
                                    className='w-full h-auto object-cover rounded-xl'
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* info product & button: buy now and add to cart */}
                <div className='md:col-span-1 lg:col-span-2'>
                    {/* name product */}
                    <h2 className='text-xl sm:text-2xl font-extrabold text-black dark:text-white'>
                        {productName}
                    </h2>

                    {/* price product */}
                    <div className='flex flex-wrap justify-start items-center gap-x-5 mt-5'>
                        {discount !== 0 ? (
                            <>
                                <p className='text-blue-500 text-2xl sm:text-4xl font-bold'>
                                    {discountPrice}
                                </p>
                                <p className='text-gray-400 text-xl flex justify-start items-center'>
                                    <strike>{priceFormat}</strike>
                                    <span className='text-sm bg-red-500 text-white px-2 py-1 rounded-lg ml-3'>
                                        -{percentDiscount !== 0 ? percentDiscount : 0}%
                                    </span>
                                </p>
                            </>
                        ) : (
                            <div className='flex items-center'>
                                <span className='text-blue-500 text-xl font-medium'>
                                    Giá đang bán:{' '}
                                    <span className='text-3xl text-red-500 font-bold'>
                                        {priceFormat}
                                    </span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* description */}
                    <div className='text-gray-600 dark:text-gray-200 mt-5'>
                        <p>
                            {isDescriptionExpanded
                                ? description
                                : `${description.substring(0, 100)}...`}
                        </p>
                        <button
                            onClick={toggleDescription}
                            className='text-gray-800 hover:text-blue-500 dark:text-blue-500 underline'
                        >
                            {isDescriptionExpanded ? 'Thu gọn' : 'Đọc thêm'}
                        </button>
                    </div>

                    {/* specifications */}
                    <ul className='mt-5'>
                        {specifications.map((spec) => (
                            <li
                                key={spec.id}
                                className='w-full flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700'
                            >
                                <span className='text-gray-800 dark:text-gray-200'>
                                    {spec.title}
                                </span>
                                <span className='text-gray-800 dark:text-gray-200 font-medium w-[50%]'>
                                    {spec.value}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* quantity */}
                    <div className='flex justify-start items-center mt-5 gap-x-5'>
                        <p className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                            Số lượng đặt mua:
                        </p>
                        <div className='flex items-center justify-center'>
                            <Button
                                outline
                                onClick={() => setQuantityProduct(quantityProduct - 1)}
                                disabled={quantityProduct === 0}
                            >
                                -
                            </Button>
                            <span className='text-lg text-center w-8 md:w-12'>
                                {quantityProduct}
                            </span>
                            <Button
                                outline
                                onClick={() => setQuantityProduct(quantityProduct + 1)}
                                disabled={!tokenUser}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* buttons */}
                    <div
                        className={`w-full flex flex-col md:flex-row ${
                            tokenUser ? 'justify-between' : 'justify-center'
                        } items-center mt-5 gap-4`}
                    >
                        {tokenUser && (
                            <Button
                                onClick={handleAddProductToCart}
                                outline
                                className='w-full md:w-48 lg:w-52'
                            >
                                Thêm vào giỏ hàng
                            </Button>
                        )}
                        <Button
                            onClick={handleVerifyUser}
                            className={`w-full ${tokenUser && 'md:w-48 lg:w-52'}`}
                        >
                            Mua ngay
                        </Button>
                    </div>
                </div>
            </div>

            {/* related products */}
            <div className='mt-5 bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center rounded-lg'>
                <div className='relative mt-5 w-full text-center'>
                    <span
                        className='text-2xl uppercase font-semibold sm:font-bold relative z-10 inline-block 
                    bg-gray-100 dark:bg-gray-900 px-4'
                    >
                        các sản phẩm cùng thương hiệu
                    </span>
                    <div className='max-w-5xl dark:max-w-7xl mx-auto bg-black dark:bg-gray-200 h-[1px] absolute inset-x-0 top-1/2 transform -translate-y-1/2' />
                </div>

                {/* <Swiper
                    className='mt-2 w-full flex items-center px-4 py-4 sm:py-2 bg-gray-100 dark:bg-gray-900'
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 4000 }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                >
                    {moreProduct?.map((product) => (
                        <SwiperSlide key={product.id}>
                            <div
                                className='bg-white p-4 min-h-[60vh] rounded-lg 
                                shadow-md hover:shadow-lg transition-shadow cursor-pointer'
                                onClick={() => handleNavigateToProductDetail(product.id)}
                            >
                                <img
                                    src={product.img[0]}
                                    alt={product.productName}
                                    className='w-full h-[40vh] object-cover rounded-lg'
                                />
                                <h4 className='mt-5 w-full text-gray-800 text-lg font-semibold'>
                                    {product.productName}
                                </h4>
                                <p className='text-gray-500 text-sm'>{product.brand}</p>
                                <p className='text-blue-500 text-xl font-bold'>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(product.price)}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper> */}

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 p-4 dark:bg-gray-900'>
                    {prProduct.map((item) => (
                        <div
                            key={item.id}
                            className='flex flex-col justify-start items-center bg-white rounded-lg p-6'
                        >
                            <img
                                src={item.url}
                                alt={item.title}
                                className='object-fit h-[10vh] w-[8vw] mb-4 p-4'
                            />
                            <h4 className='text-lg font-semibold mb-2 dark:text-gray-800'>
                                {item.title}
                            </h4>
                            <p className='text-gray-600 text-center'>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* if user not login */}
            <Modal show={showModalBuyNow} size='md' popup>
                <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                    <CiWarning size='70px' color={'#0e7490'} />
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
        </div>
    );
}

{
    /* <div className='mt-12'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>Nhận xét sản phẩm</h3>
        <Comment idProduct={product_Redux.id} />
    </div> */
}
