import { Image } from 'antd';
import { useCallback } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {
    const { orderDetail: orderData } = useSelector((state) => state.checkout);
    console.log(orderData);
    const navigate = useNavigate();

    const formatPrice = useCallback((price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }, []);

    const formatDate = useCallback((dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    }, []);

    const calculateProductPrice = useCallback((product) => {
        const basePrice = product.product.option.value.price;
        const discount = product.product.option.value.discount;
        const quantity = product.quantity;
        return (basePrice - discount) * quantity;
    }, []);

    const calculateTotalDiscount = useCallback((product) => {
        return product.product.option.value.discount * product.quantity;
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4'>
            <div className='max-w-7xl mx-auto'>
                {/* Main Content */}
                <div className='bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100'>
                    {/* Order Header */}
                    <div className='bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-6'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h1 className='text-2xl font-bold tracking-tight'>Chi tiết đơn hàng</h1>
                                <p className='text-gray-300 mt-1'>
                                    Mã đơn: <span className='font-medium'>{orderData.id}</span>
                                </p>
                            </div>
                            <div className='flex gap-4'>
                                <button
                                    onClick={() => navigate('/dashboard?tab=order')}
                                    className='flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition duration-200'
                                >
                                    <FaShoppingCart size={18} />
                                    <span className='font-medium'>Đơn hàng của tôi</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Two Columns Layout */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
                        {/* Left Column - Products */}

                        <div className='space-y-6'>
                            <div className='flex items-center justify-between'>
                                <h2 className='text-2xl font-semibold text-gray-800'>Sản phẩm đã đặt</h2>
                                <span className='text-gray-500'>{orderData?.products?.length} sản phẩm</span>
                            </div>

                            <div className='space-y-4'>
                                {orderData?.products?.map((product, index) => (
                                    <div
                                        key={index}
                                        className='bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300'
                                    >
                                        <div className='flex gap-4'>
                                            {/* Product Image */}
                                            <div className='w-32 h-32 rounded-lg overflow-hidden bg-gray-50'>
                                                <Image
                                                    src={product.product.img[0]}
                                                    alt={product.product.productName}
                                                    preview={{
                                                        mask: <div className='text-xs font-medium'>Xem</div>,
                                                    }}
                                                    className='w-full h-full object-cover hover:scale-105 transition duration-300'
                                                />
                                            </div>

                                            {/* Product Details */}
                                            <div className='flex-1 flex flex-col justify-center gap-y-2'>
                                                <div>
                                                    <h3
                                                        className='text-lg font-bold text-gray-800 mb-1 cursor-pointer hover:text-blue-500 transition-colors duration-200'
                                                        onClick={() =>
                                                            navigate(`/product-detail/${product.product.id}`)
                                                        }
                                                    >
                                                        {product.product.productName}
                                                    </h3>
                                                    <div className='flex items-center gap-4 text-sm text-gray-500'>
                                                        <span>{product.product.brand}</span>
                                                        <span>•</span>
                                                        <span>Màu: {product.product.option.value.color}</span>
                                                    </div>
                                                </div>

                                                <div className='flex items-end justify-between'>
                                                    <div className='space-y-1'>
                                                        <div className='flex items-center gap-2'>
                                                            <span className='text-gray-400 line-through text-sm'>
                                                                {formatPrice(
                                                                    product.product.option.value.price *
                                                                        product.quantity,
                                                                )}
                                                            </span>
                                                            <span className='text-red-500 text-sm'>
                                                                -{formatPrice(calculateTotalDiscount(product))}
                                                            </span>
                                                        </div>
                                                        <div className='text-xl font-bold text-blue-600'>
                                                            {formatPrice(calculateProductPrice(product))}
                                                        </div>
                                                    </div>

                                                    <div className='flex items-center gap-x-1'>
                                                        <p className='text-gray-500 text-sm'>Số lượng:</p>
                                                        <p className='text-lg font-medium'>{product.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Order Info */}
                        <div className='space-y-6'>
                            {/* Customer Info */}
                            <div className='bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition duration-200'>
                                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Thông tin khách hàng</h2>
                                <div className='grid gap-4'>
                                    <div>
                                        <p className='text-gray-600'>Họ và tên</p>
                                        <p className='font-medium'>{orderData.user.name}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600'>Số điện thoại</p>
                                        <p className='font-medium'>{orderData.user.phone}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600'>Email</p>
                                        <p className='font-medium'>{orderData.user.email}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600'>Địa chỉ</p>
                                        <p className='font-medium'>{orderData.user.address.fullAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className='bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition duration-200'>
                                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Thông tin thanh toán</h2>
                                <div className='space-y-3'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Phương thức thanh toán</span>
                                        <span className='font-medium capitalize'>
                                            {orderData.paymentMethod === 'cash'
                                                ? 'Thanh toán khi nhận hàng'
                                                : 'Thanh toán online'}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Trạng thái</span>
                                        <span className='font-medium'>
                                            {orderData.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Thời gian đặt hàng</span>
                                        <span className='font-medium'>{formatDate(orderData.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className='bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition duration-200'>
                                <h2 className='text-xl font-semibold text-gray-800 mb-4'>Tổng quan đơn hàng</h2>
                                <div className='space-y-3'>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Tổng tiền hàng</span>
                                        <span className='font-medium'>{formatPrice(orderData.itemsPrice)}</span>
                                    </div>
                                    <div className='flex justify-between text-gray-600'>
                                        <span>Phí vận chuyển</span>
                                        <span className='font-medium'>{formatPrice(orderData.shippingPrice)}</span>
                                    </div>
                                    <div className='border-t border-gray-200 mt-4 pt-4'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-xl font-bold text-gray-900'>Tổng cộng</span>
                                            <span className='text-xl font-bold text-blue-600'>
                                                {formatPrice(orderData.totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
