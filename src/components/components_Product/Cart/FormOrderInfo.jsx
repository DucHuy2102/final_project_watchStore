import { useMemo } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrderDetails = () => {
    const orderData = useSelector((state) => state.checkout.orderDetail);
    console.log(orderData);
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
    };

    const priceProduct = useMemo(() => {
        return orderData.products.reduce((total, product) => {
            return total + (product.product.price - product.product.discount) * product.quantity;
        }, 0);
    }, [orderData.products]);

    return (
        <div className='min-h-screen bg-gray-50 py-8 px-4'>
            <div className='max-w-7xl mx-auto'>
                {/* Main Content */}
                <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
                    {/* Order Header */}
                    <div className='bg-gray-800 text-white px-6 py-4'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <h1 className='text-xl font-semibold'>Chi tiết đơn hàng</h1>
                                <p className='text-gray-300 text-sm'>Mã đơn: {orderData.id}</p>
                            </div>
                            <div className='flex gap-4'>
                                <button
                                    onClick={() => navigate('/dashboard?tab=order')}
                                    className='flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition'
                                >
                                    <FaShoppingCart size={20} />
                                    <span>Giỏ hàng của tôi</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Two Columns Layout */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'>
                        {/* Left Column - Products */}
                        <div className='space-y-6'>
                            <h2 className='text-lg font-semibold'>Sản phẩm đã đặt</h2>
                            <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
                                {orderData?.products?.map((product, index) => (
                                    <div
                                        key={index}
                                        className='flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm'
                                    >
                                        <div className='w-20 h-20 bg-gray-200 rounded-lg'>
                                            <img
                                                src={product.product.img[0]}
                                                alt={product.product.productName}
                                                className='w-full h-full object-cover rounded-lg'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='font-medium'>{product.product.productName}</h3>
                                            <p className='text-gray-500'>Số lượng: {product.quantity}</p>
                                            <p className='font-medium text-gray-800'>{formatPrice(priceProduct)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Order Info */}
                        <div className='space-y-6'>
                            {/* Customer Info */}
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <h2 className='text-lg font-semibold mb-3'>Thông tin khách hàng</h2>
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
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <h2 className='text-lg font-semibold mb-3'>Thông tin thanh toán</h2>
                                <div className='space-y-2'>
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
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <h2 className='text-lg font-semibold mb-3'>Tổng quan đơn hàng</h2>
                                <div className='space-y-2'>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Tổng tiền hàng</span>
                                        <span>{formatPrice(orderData.itemsPrice)}</span>
                                    </div>
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600'>Phí vận chuyển</span>
                                        <span>{formatPrice(orderData.shippingPrice)}</span>
                                    </div>
                                    <div className='border-t mt-2 pt-2 flex justify-between text-xl font-bold'>
                                        <span>Tổng cộng</span>
                                        <span className='text-blue-500'>{formatPrice(orderData.totalPrice)}</span>
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
