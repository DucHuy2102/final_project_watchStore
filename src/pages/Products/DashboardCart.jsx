import {
    Table,
    InputNumber,
    Button,
    Card,
    Badge,
    Typography,
    Space,
    Popconfirm,
    Image,
    Select,
    Tag,
    Modal,
    Input,
} from 'antd';
import {
    DeleteOutlined,
    ShoppingCartOutlined,
    WarningOutlined,
    MinusOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    changeColorProduct,
    changeProductQuantity,
    deleteProductFromCart,
    resetCart,
} from '../../services/redux/slices/cartSlice';
import { FaClock } from 'react-icons/fa';
import axios from 'axios';
import { setProductToCheckout } from '../../services/redux/slices/checkoutSlice';
import { toast } from 'react-toastify';
import EmptyCart from './components/EmptyCart';
import { UserOutlined, EditOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';

const { Text } = Typography;

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function DashboardCart() {
    const { access_token: tokenUser, user } = useSelector((state) => state.user);
    const { cartItem, cartTotalQuantity } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
                    <Input
                        readOnly
                        value={item.quantity}
                        className='text-center font-semibold rounded-lg border-gray-300 h-8 w-14'
                        controls={false}
                    />
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
                    onConfirm={() => handleDeleteProductFromCart(item.idCart)}
                    okText='Xóa'
                    cancelText='Hủy'
                    icon={<WarningOutlined className='text-red-500' />}
                >
                    <Button type='text' danger icon={<DeleteOutlined />} className='hover:bg-red-50' />
                </Popconfirm>
            ),
        },
    ];

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

    const handleDeleteProductFromCart = async (idCart) => {
        try {
            setLoading(true);
            const itemIndex = cartItem.findIndex((item) => item.idCart === idCart);
            if (itemIndex === -1) return;
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/delete-item`, {
                params: {
                    id: idCart,
                },
                headers: {
                    Authorization: `Bearer ${tokenUser}`,
                },
            });
            if (res?.status === 200) {
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                dispatch(deleteProductFromCart(idCart));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const showDeleteConfirm = () => {
        Modal.confirm({
            title: 'Xóa tất cả sản phẩm',
            icon: <ExclamationCircleOutlined className='text-red-500' />,
            content: 'Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?',
            okText: 'Xóa tất cả',
            cancelText: 'Hủy',
            okButtonProps: {
                className: 'bg-red-500 hover:!bg-red-600',
            },
            onOk: handleDeleteAllProducts,
        });
    };

    const handleDeleteAllProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/delete-all`, {
                headers: {
                    Authorization: `Bearer ${tokenUser}`,
                },
            });
            if (res?.status === 200) {
                toast.success('Đã xóa tất cả sản phẩm khỏi giỏ hàng');
                dispatch(resetCart());
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi xóa giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToCheckoutPage = () => {
        dispatch(
            setProductToCheckout({
                productItems: productCartItem,
                totalQuantity: cartTotalQuantity,
                isBuyNow: false,
            }),
        );
        navigate('/checkout');
    };

    const handleEditUserInfo = () => {
        navigate('/dashboard?tab=profile');
    };

    return (
        <>
            {cartTotalQuantity === 0 ? (
                <EmptyCart />
            ) : (
                <div className='px-20 mx-auto py-8 min-h-screen'>
                    <div className='mb-5 text-center'>
                        <h1 className='font-serif text-3xl md:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-200 animate-shimmer'>
                            Giỏ Hàng Của Bạn
                        </h1>
                        <div className='w-16 h-0.5 mx-auto bg-gradient-to-r from-amber-400 to-amber-600 dark:from-amber-200 dark:to-amber-400'></div>
                    </div>

                    <div className='flex justify-between items-center mb-4'>
                        <div className='flex items-center gap-2'>
                            <ShoppingCartOutlined className='text-xl text-amber-600' />
                            <span className='text-lg font-medium'>{cartTotalQuantity} sản phẩm trong giỏ hàng</span>
                        </div>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={showDeleteConfirm}
                            className='hover:bg-red-50'
                        >
                            Xóa tất cả
                        </Button>
                    </div>

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

                        <div className='lg:w-1/4 space-y-4'>
                            <Card
                                className='relative border-none rounded-2xl overflow-hidden
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50
        shadow-[0_8px_40px_rgb(0,0,0,0.12)] backdrop-blur-sm'
                            >
                                <div className='relative'>
                                    <div className='relative space-y-4'>
                                        <div className='text-center'>
                                            <h3
                                                className='font-serif text-xl text-transparent bg-clip-text bg-gradient-to-r 
                        from-amber-700 via-yellow-600 to-amber-700 animate-shimmer flex items-center justify-center gap-2'
                                            >
                                                <UserOutlined />
                                                Thông Tin Giao Hàng
                                            </h3>
                                            <div className='w-20 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
                                        </div>

                                        <div className='space-y-2 px-3'>
                                            <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors'>
                                                <UserOutlined className='text-amber-600' />
                                                <div>
                                                    <Text strong className='text-gray-600 block'>
                                                        Họ và tên:
                                                    </Text>
                                                    <Text>{user?.fullName || 'Chưa cập nhật'}</Text>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors'>
                                                <PhoneOutlined className='text-amber-600' />
                                                <div>
                                                    <Text strong className='text-gray-600 block'>
                                                        Số điện thoại:
                                                    </Text>
                                                    <Text>{user?.phone || 'Chưa cập nhật'}</Text>
                                                </div>
                                            </div>

                                            <div className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50/80 transition-colors'>
                                                <HomeOutlined className='text-amber-600' />
                                                <div>
                                                    <Text strong className='text-gray-600 block'>
                                                        Địa chỉ:
                                                    </Text>
                                                    <Text>{user?.address?.fullAddress || 'Chưa cập nhật'}</Text>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={handleEditUserInfo}
                                            className='w-full h-12 border-none rounded-xl font-medium
                                            bg-amber-600 hover:!bg-amber-500
                                            transition-all duration-300
                                            relative overflow-hidden group'
                                        >
                                            <span className='relative z-10 flex items-center justify-center text-white'>
                                                <EditOutlined className='pr-1' />
                                                Cập nhật thông tin
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card
                                className='relative border-none rounded-2xl overflow-hidden
        bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-50 via-white to-gray-50
        shadow-[0_8px_40px_rgb(0,0,0,0.12)] backdrop-blur-sm z-10'
                            >
                                <div className='relative'>
                                    <div
                                        className='absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-200/20 via-yellow-100/10 to-transparent 
                rounded-full blur-3xl transform translate-x-20 -translate-y-20'
                                    />
                                    <div
                                        className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/20 via-amber-100/10 to-transparent 
                rounded-full blur-3xl transform -translate-x-20 translate-y-20'
                                    />
                                    <div className='absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl' />
                                    <div className='absolute inset-0 border border-amber-200/20 rounded-2xl' />
                                    <div className='absolute -inset-[1px] border border-amber-100/20 rounded-2xl blur-sm' />

                                    <div className='relative space-y-6 p-2'>
                                        <div className='text-center'>
                                            <h3
                                                className='font-serif text-xl text-transparent bg-clip-text bg-gradient-to-r 
                        from-amber-700 via-yellow-600 to-amber-700 animate-shimmer'
                                            >
                                                Giá Trị Đơn Hàng
                                            </h3>
                                            <div className='w-20 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
                                        </div>

                                        <div className='space-y-2 px-2'>
                                            <div className='flex justify-between items-center p-2 rounded-lg hover:bg-gray-50/80 transition-colors'>
                                                <Text className='text-gray-600 font-medium'>Tạm tính</Text>
                                                <Text delete className='text-gray-400 font-light'>
                                                    {formatPrice(totalPrice)}
                                                </Text>
                                            </div>

                                            <div className='flex justify-between items-center p-2 rounded-lg hover:bg-gray-50/80 transition-colors'>
                                                <Text className='text-gray-600 font-medium'>Giảm giá</Text>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <Tag className='border-none bg-emerald-50 text-emerald-600'>
                                                        -{Math.round((totalDiscountPrice / totalPrice) * 100)}%
                                                    </Tag>
                                                    <Text className='text-emerald-600 font-medium'>
                                                        -{formatPrice(totalDiscountPrice)}
                                                    </Text>
                                                </div>
                                            </div>

                                            <div
                                                className='w-full h-0.5 mt-1
                                                bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-shimmer'
                                            />

                                            <div className='flex flex-col items-center p-3'>
                                                <div
                                                    className='font-serif text-xl font-medium tracking-wide text-gray-700 
                                                bg-gradient-to-r from-transparent via-gray-800 to-transparent bg-clip-text'
                                                >
                                                    Tổng cộng
                                                </div>

                                                <div className='flex flex-col items-center'>
                                                    <span
                                                        className='font-cormorant text-4xl font-semibold bg-gradient-to-br from-amber-800 via-yellow-700 to-amber-900
                                                    bg-clip-text text-transparent drop-shadow-lg'
                                                    >
                                                        {formatPrice(totalAmountToPay)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type='primary'
                                            size='large'
                                            block
                                            onClick={handleNavigateToCheckoutPage}
                                            className='h-16 border-none rounded-xl font-medium tracking-wide
                                            bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 
                                            hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700
                                            shadow-lg hover:shadow-amber-200/50 transition-all duration-300
                                            relative overflow-hidden group'
                                        >
                                            <div
                                                className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] 
                                                bg-[length:250%_250%,100%_100%] animate-shine'
                                            />
                                            <span className='relative z-10 flex items-center justify-center gap-2 text-base'>
                                                <ShoppingCartOutlined className='text-xl pr-2' />
                                                Tiến hành thanh toán
                                            </span>
                                        </Button>

                                        <div className='flex items-center justify-center gap-2 text-gray-400'>
                                            <div className='flex items-center gap-1.5 px-3 py-1.5'>
                                                <FaClock className='text-amber-600' />
                                                <span className='text-sm font-medium'>
                                                    Thanh toán an toàn & bảo mật
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
