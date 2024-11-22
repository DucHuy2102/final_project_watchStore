import {
    Table,
    InputNumber,
    Button,
    Card,
    Divider,
    Badge,
    Typography,
    Space,
    Popconfirm,
    Image,
    Select,
    Tag,
} from 'antd';
import { DeleteOutlined, ShoppingCartOutlined, WarningOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    changeColorProduct,
    changeProductQuantity,
    deleteProductFromCart,
} from '../../services/redux/slices/cartSlice';
import { FaClock } from 'react-icons/fa';
import axios from 'axios';

const { Title, Text } = Typography;

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function DashboardCart() {
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const { cartItem, cartTotalQuantity } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [loading, setLoading] = useState(false);

    // Calculate cart summary
    const cartSummary = useMemo(() => {
        return cartItem.reduce(
            (acc, item) => {
                const selectedOption = item.productItem.option.find((opt) => opt.key === item.option);
                const price = selectedOption.value.price;
                const discount = selectedOption.value.discount;
                const quantity = item.quantity;

                acc.totalPrice += price * quantity;
                acc.totalDiscount += discount * quantity;
                acc.finalTotal = acc.totalPrice - acc.totalDiscount;

                return acc;
            },
            { totalPrice: 0, totalDiscount: 0, finalTotal: 0 },
        );
    }, [cartItem]);

    const sizeProduct = useCallback((height, width) => {
        return height === width ? `${height}mm` : `${height} x ${width}mm`;
    }, []);

    const { totalPrice, totalDiscount, finalTotal } = cartSummary;
    const productCartItem = cartItem;
    const totalAmountToPay = finalTotal;
    const totalDiscountPrice = totalDiscount;

    // Table columns configuration
    const columns = [
        {
            title: 'Sản phẩm',
            key: 'product',
            width: '40%',
            render: (_, item) => (
                <Space className='cursor-pointer'>
                    <Image
                        preview={{
                            mask: <div className='text-xs font-medium'>Xem</div>,
                        }}
                        src={item.productItem.img[0]}
                        alt={item.productItem.productName}
                        className='!w-36 !h-auto object-cover'
                    />
                    <Space direction='vertical' size={2}>
                        <Text
                            strong
                            className='text-lg hover:text-blue-600 transition-colors'
                            onClick={() => navigate(`/product-detail/${item.productItem.id}`)}
                        >
                            {item.productItem.productName}
                        </Text>
                        <Text type='secondary'>
                            Kích thước: {sizeProduct(item.productItem.height, item.productItem.width)}
                        </Text>
                    </Space>
                </Space>
            ),
        },
        {
            title: 'Màu sắc',
            align: 'center',
            render: (_, item) => (
                <div className='color-selector-container'>
                    <Select
                        value={item.option}
                        onChange={(value) => handleColorChange(item, value)}
                        style={{ width: 70 }}
                        dropdownStyle={{ padding: '8px' }}
                        suffixIcon={null}
                    >
                        {item.productItem.option.map((opt) => (
                            <Select.Option key={opt.key} value={opt.key}>
                                <div
                                    className='w-6 h-6 rounded-full mx-auto border cursor-pointer transition-all duration-200 hover:scale-110'
                                    style={{
                                        backgroundColor: opt.key,
                                    }}
                                />
                            </Select.Option>
                        ))}
                    </Select>
                    <Badge
                        className='color-name-badge'
                        count={item.productItem.option.find((opt) => opt.key === item.option)?.value.color}
                        style={{
                            backgroundColor: '#fff',
                            color: '#333',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            borderRadius: '12px',
                        }}
                    />
                </div>
            ),
        },
        {
            title: 'Đơn giá',
            align: 'center',
            width: '20%',
            render: (_, item) => {
                const selectedOption = item.productItem.option.find((opt) => opt.key === item.option);
                console.log('selectedOption', selectedOption);
                const originalPrice = selectedOption.value.price;
                const discount = selectedOption.value.discount;
                const discountPercent = Math.round((discount / originalPrice) * 100);
                const finalPrice = originalPrice - discount;

                return (
                    <Space direction='vertical' size={0}>
                        <Text delete type='secondary' className='text-sm italic'>
                            {formatPrice(originalPrice)}
                        </Text>
                        <Text strong className='text-lg text-blue-600'>
                            {formatPrice(finalPrice)}
                        </Text>
                        {discount > 0 && (
                            <Tag color='red' className='mt-1 font-semibold'>
                                Giảm {discountPercent}%
                            </Tag>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Số lượng',
            align: 'center',
            width: '10%',
            render: (_, item) => (
                <Space>
                    <Button
                        onClick={() => handleChangeQuantity('decrease', item.idCart)}
                        icon={<MinusOutlined />}
                        className='border-gray-300 hover:border-blue-500 hover:text-blue-500'
                    />
                    <InputNumber value={item.quantity} className='w-10 pl-1' controls={false} />
                    <Button
                        onClick={() => handleChangeQuantity('increase', item.idCart)}
                        icon={<PlusOutlined />}
                        className='border-gray-300 hover:border-blue-500 hover:text-blue-500'
                    />
                </Space>
            ),
        },
        {
            title: 'Thành tiền',
            align: 'center',
            width: '20%',
            render: (_, item) => {
                const selectedOption = item.productItem.option.find((opt) => opt.key === item.option);
                const originalPrice = selectedOption.value.price;
                const discount = selectedOption.value.discount;
                const finalPrice = originalPrice - discount;

                return (
                    <Text strong className='text-lg text-blue-600'>
                        {formatPrice(finalPrice * item.quantity)}
                    </Text>
                );
            },
        },
        {
            title: <DeleteOutlined className='text-red-600' />,
            align: 'center',
            width: '5%',
            render: (_, item) => (
                <Popconfirm
                    title='Xóa sản phẩm'
                    description='Bạn có chắc chắn muốn xóa sản phẩm này?'
                    onConfirm={() => handleDeleteProductFromCart(item.productItem.id)}
                    okText='Xóa'
                    cancelText='Hủy'
                    icon={<WarningOutlined className='text-red-500' />}
                >
                    <Button type='text' danger icon={<DeleteOutlined />} className='hover:bg-red-50' />
                </Popconfirm>
            ),
        },
    ];

    useEffect(() => {
        console.log(cartItem);
    }, [cartItem]);

    const updateCartItem = async (dataToUpdate) => {
        try {
            setLoading(true);
            await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/update-cart`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${tokenUser}`,
                },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedUpdateCart = useRef(
        debounce((updatedCartItem) => {
            updateCartItem(updatedCartItem);
        }, 500),
    ).current;

    // const handleColorChange = (item, newColor) => {
    //     dispatch(changeColorProduct({ productId: item.productItem.id, option: newColor }));

    //     const updateData = cartItem.map((item) => ({
    //         itemId: item.idCart,
    //         quantity: item.quantity,
    //         option: newColor,
    //     }));

    //     debouncedUpdateCart(updateData);
    // };

    const handleChangeQuantity = (type, idCart) => {
        const checkItem = cartItem.find((item) => item.idCart === idCart);
        if (!checkItem) return;
        const quantityCheckItem = checkItem.quantity;

        if (type === 'decrease' && quantityCheckItem === 1) return;
        dispatch(changeProductQuantity({ type, idCart }));

        const updateData = cartItem.map((item) => ({
            itemId: item.idCart,
            quantity: type === 'increase' ? item.quantity + 1 : item.quantity - 1,
            option: item.option,
        }));

        debouncedUpdateCart(updateData);
    };

    useEffect(() => {
        return () => {
            debouncedUpdateCart.cancel();
        };
    }, [debouncedUpdateCart]);

    const handleColorChange = async (item, newColor) => {
        try {
            setLoading(true);
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/cart/update-orderLine`,
                {
                    itemId: item.idCart,
                    quantity: item.quantity,
                    option: newColor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                dispatch(changeColorProduct({ idCart: item.idCart, option: newColor }));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToLoginPage = () => {
        navigate('/login', { state: { from: pathname } });
    };

    const handleDeleteProductFromCart = (idProduct) => {
        dispatch(deleteProductFromCart(idProduct));
    };

    const handleNavigateToCheckoutPage = () => {
        navigate('/checkout');
    };

    return (
        <>
            {cartTotalQuantity === 0 ? (
                <div className='min-h-screen flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300'>
                    <div className='absolute inset-0 bg-[url("/assets/luxuryWatch.jpg")] bg-no-repeat bg-center bg-cover opacity-10 dark:opacity-10' />
                    <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/5 to-rose-500/5 dark:from-amber-500/10 dark:to-rose-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob' />
                    <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 dark:from-blue-500/10 dark:to-emerald-500/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000' />

                    <div className='relative z-10 w-full max-w-5xl'>
                        <div className='mb-5 text-center'>
                            <h1 className='font-serif text-3xl md:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 animate-shimmer'>
                                Giỏ Hàng Của Bạn
                            </h1>
                            <div className='w-16 h-0.5 mx-auto bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-200 dark:to-amber-400'></div>
                        </div>

                        <div className='relative rounded-3xl p-8'>
                            <div className='grid md:grid-cols-2 gap-8 items-center'>
                                <div className='relative group perspective'>
                                    <div className='relative transform transition-all duration-700 group-hover:rotate-y-12'>
                                        <img
                                            src='/assets/watchMiniCart.avif'
                                            alt='Đồng Hồ Cao Cấp'
                                            className='rounded-2xl shadow-2xl w-auto h-[60vh] object-cover'
                                        />
                                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl'></div>
                                    </div>
                                </div>

                                <div className='space-y-6'>
                                    {tokenUser ? (
                                        <div className='space-y-6 animate-fadeIn'>
                                            <h2 className='text-2xl md:text-3xl font-serif text-amber-700 dark:text-amber-300 leading-tight'>
                                                Giỏ Hàng Đang Chờ Kiệt Tác
                                            </h2>
                                            <p className='text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed'>
                                                Khám phá bộ sưu tập đồng hồ tinh tế, nơi hội tụ những thiết kế độc đáo
                                                và đẳng cấp nhất.
                                            </p>
                                            <Link to='/products'>
                                                <button className='group relative w-full'>
                                                    <div className='absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt'></div>
                                                    <div className='relative px-6 py-3 bg-white dark:bg-gray-900 rounded-lg leading-none flex items-center justify-center'>
                                                        <span className='text-amber-700 dark:text-amber-300 group-hover:text-amber-800 dark:group-hover:text-amber-200 transition duration-200 text-sm font-medium'>
                                                            Khám Phá Bộ Sưu Tập
                                                        </span>
                                                    </div>
                                                </button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className='space-y-6 animate-fadeIn'>
                                            <h2 className='text-2xl md:text-3xl font-serif text-amber-700 dark:text-amber-300 leading-tight'>
                                                Trải Nghiệm Giá Trị Vượt Trội
                                            </h2>
                                            <p className='text-base text-gray-600 dark:text-gray-300 font-light leading-relaxed'>
                                                Đăng nhập để bắt đầu hành trình khám phá thế giới đồng hồ cao cấp và
                                                những trải nghiệm xa xỉ được tuyển chọn đặc biệt kỹ lưỡng.
                                            </p>
                                            <button
                                                onClick={handleNavigateToLoginPage}
                                                className='group relative w-full overflow-hidden rounded-lg p-[2px] focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2'
                                            >
                                                <div className='absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-x'></div>

                                                <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000'></div>

                                                <div className='relative px-6 py-3.5 rounded-lg leading-none flex items-center justify-center'>
                                                    <div className='absolute inset-0 bg-black rounded-lg transition-opacity duration-500 group-hover:opacity-0'></div>

                                                    <span className='flex items-center gap-2 text-amber-300 group-hover:text-amber-200 transition-colors duration-200 text-base font-medium relative z-10'>
                                                        <span className='tracking-wide'>ĐĂNG NHẬP NGAY</span>
                                                        <svg
                                                            className='w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200'
                                                            fill='none'
                                                            stroke='currentColor'
                                                            viewBox='0 0 24 24'
                                                        >
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth='2'
                                                                d='M14 5l7 7m0 0l-7 7m7-7H3'
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='px-20 mx-auto py-8'>
                    <Title level={2} className='mb-6 flex items-center justify-center gap-2 dark:text-gray-100'>
                        <ShoppingCartOutlined className='text-blue-600' />
                        Giỏ hàng của bạn
                    </Title>

                    <div className='flex flex-col lg:flex-row gap-x-3'>
                        <div className='lg:w-3/4'>
                            <Table
                                loading={loading}
                                columns={columns}
                                dataSource={productCartItem}
                                rowKey='idCart'
                                pagination={false}
                                scroll={{ x: 1000 }}
                            />
                        </div>

                        <div className='lg:w-1/4'>
                            <Card
                                className='sticky top-4 border border-gray-100 shadow-md hover:shadow-lg transition-shadow'
                                bordered={false}
                            >
                                <Space direction='vertical' className='w-full' size='large'>
                                    <div className='flex justify-between items-center'>
                                        <Text>Tạm tính</Text>
                                        <Text delete type='secondary'>
                                            {formatPrice(totalPrice)}
                                        </Text>
                                    </div>

                                    <div className='flex justify-between items-center'>
                                        <Text>Giảm giá</Text>
                                        <Text type='success'>-{formatPrice(totalDiscountPrice)}</Text>
                                    </div>

                                    <Divider className='my-2' />

                                    <div className='flex justify-between items-center'>
                                        <Title level={4} className='!mb-0'>
                                            Tổng cộng
                                        </Title>
                                        <Title level={4} className='!mb-0 text-blue-600'>
                                            {formatPrice(totalAmountToPay)}
                                        </Title>
                                    </div>

                                    <Button
                                        type='primary'
                                        size='large'
                                        block
                                        onClick={handleNavigateToCheckoutPage}
                                        className='h-12 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 
                                    hover:from-blue-600 hover:to-blue-700 border-none shadow-md'
                                    >
                                        Tiến hành thanh toán
                                    </Button>
                                </Space>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
