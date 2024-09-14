import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { reset_Product_Detail } from '../../redux/slices/productSlice';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Button } from 'flowbite-react';

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function ProductDetail() {
    const product = useSelector((state) => state.product.productDetail);
    // destructuring product detail
    const {
        id,
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

    // state
    const dispatch = useDispatch();
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [quantityProduct, setQuantityProduct] = useState(0);

    // toggle description
    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    // reset product detail when unmount
    // useEffect(() => {
    //     return () => {
    //         dispatch(reset_Product_Detail());
    //     };
    // }, [dispatch]);

    // format price to VND
    const priceFormat = formatPrice(price);
    const discountPrice = discount !== 0 && !isNaN(discount) ? price * ((100 - discount) / 100) : 0;
    console.log(discountPrice);
    const discountPriceFormat = formatPrice(discountPrice);

    return (
        <div className='p-6 lg:max-w-7xl max-w-4xl mx-auto'>
            {/* top: images & info product */}
            <div
                className='grid items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-5 
            gap-12 shadow-lg p-6'
            >
                {/* image product */}
                <div className='lg:col-span-3 w-full lg:sticky top-0 text-center'>
                    <Swiper
                        loop={true}
                        spaceBetween={0}
                        modules={[Navigation, Autoplay]}
                        autoplay={{ delay: 4000 }}
                        navigation
                        className='w-full h-auto lg:w-[500px] lg:h-[500px] rounded-xl relative'
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
                <div className='lg:col-span-2'>
                    {/* name product */}
                    <h2 className='text-xl md:text-2xl font-extrabold text-black dark:text-white'>
                        {productName}
                    </h2>

                    {/* price product */}
                    <div className='flex flex-wrap justify-start items-center gap-x-5 mt-5'>
                        <p className='text-blue-500 text-4xl font-bold'>{discountPriceFormat}</p>
                        <p className='text-gray-400 text-xl flex justify-start items-center'>
                            <strike>{priceFormat}</strike>
                            <span className='text-sm bg-red-500 text-white px-2 py-1 rounded-lg ml-3'>
                                -{discount !== 0 && !isNaN(discount) ? discount : 0}%
                            </span>
                        </p>
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
                        <p className='text-lg font-semibold text-gray-800'>Số lượng đặt mua:</p>
                        <div className='flex items-center justify-center'>
                            <Button
                                outline
                                // onClick={decreaseQuantity}
                                disabled={quantityProduct === 0}
                            >
                                -
                            </Button>
                            <span className='text-lg text-center w-8 md:w-12 border-l border-r border-gray-300'>
                                {quantityProduct}
                            </span>
                            <Button
                                outline
                                // onClick={increaseQuantity}
                            >
                                +
                            </Button>
                        </div>
                    </div>

                    {/* buttons */}
                    <div className='flex justify-between items-center mt-5'>
                        <Button outline>Thêm vào giỏ hàng</Button>
                        <Button className='w-40'>Mua ngay</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

{
    /* related products */
}
{
    /* <div className='mt-12'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>
            Sản phẩm cùng thương hiệu
        </h3>
        <Swiper
            className='flex items-center px-4 py-2 bg-gray-100'
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
            {moreProduct.map((product) => (
                <SwiperSlide key={product.id}>
                    <div
                        className='bg-white p-4 h-[60vh] rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer'
                        onClick={() => go_ProductDetail_Page(product.id, product)}
                    >
                        <img
                            src={product.img[0]}
                            alt={product.productName}
                            className='w-full h-[40vh] object-cover rounded-lg'
                        />
                        <h4 className='mt-4 w-full text-gray-800 text-lg font-semibold'>
                            {product.productName}
                        </h4>
                        <p className='text-gray-500 text-sm'>{product.brand}</p>
                        <p className='mt-2 text-blue-500 text-xl font-bold'>
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(product.price)}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    </div> */
}

{
    /* pr product */
}
{
    /* <div className='mt-10 w-full grid grid-cols-1 lg:grid-cols-3 gap-5 bg-gray-100 rounded-lg shadow-md p-6'>
        {prProduct.map((item) => (
            <div
                key={item.id}
                className='flex flex-col justify-center items-center bg-white rounded-lg p-6'
            >
                <img
                    src={item.url}
                    alt={item.title}
                    className='object-fit h-[10vh] w-[8vw] mb-4 p-2'
                />
                <h4 className='text-lg font-semibold mb-2'>{item.title}</h4>
                <p className='text-gray-600 text-center'>{item.description}</p>
            </div>
        ))}
    </div> */
}

{
    /* comments */
}
{
    /* <div className='mt-12'>
        <h3 className='text-xl font-bold text-gray-900 mb-4'>Nhận xét sản phẩm</h3>
        <Comment idProduct={product_Redux.id} />
    </div> */
}
