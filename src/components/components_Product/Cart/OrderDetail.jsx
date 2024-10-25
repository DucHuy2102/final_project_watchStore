import { useState } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function OrderDetail({ orderData, onBack }) {
    const tokenUser = useSelector((state) => state.user.access_token);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const formatDate = (dateStr) => {
        return dateStr
            ? new Date(dateStr).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : 'Chưa cập nhật';
    };

    const handleCancelOrder = async () => {
        console.log('Cancel order', orderData);
        try {
            setLoading(true);
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/order/cancel`,
                {
                    id: orderData.id,
                    message: message.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                setOpenModal(false);
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-semibold'>Chi tiết đơn hàng: {orderData.id}</h2>
                <Button color='gray' onClick={onBack}>
                    Quay lại
                </Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                    <h3 className='text-lg font-semibold mb-4'>Thông tin đơn hàng</h3>
                    <div className='space-y-3'>
                        <p>
                            <span className='font-medium'>Ngày đặt:</span> {formatDate(orderData.createdAt)}
                        </p>
                        <p>
                            <span className='font-bold'>Trạng thái:</span>{' '}
                            <span
                                className={`font-bold ${
                                    orderData.state === 'processing'
                                        ? 'text-blue-500'
                                        : orderData.state === 'delivered'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }`}
                            >
                                {orderData.state === 'processing'
                                    ? 'Đang xử lý'
                                    : orderData.state === 'delivered'
                                    ? 'Đã giao'
                                    : 'Đơn đã bị hủy'}
                            </span>
                        </p>
                        <p>
                            <span className='font-medium'>Phương thức thanh toán:</span>{' '}
                            {orderData.paymentMethod === 'cash' ? 'Tiền mặt' : 'Online'}
                        </p>
                        <p>
                            <span className='font-medium'>Đã thanh toán:</span> {orderData.paid ? 'Rồi' : 'Chưa'}
                        </p>
                        {orderData.paidAt && (
                            <p>
                                <span className='font-medium'>Ngày thanh toán:</span> {formatDate(orderData.paidAt)}
                            </p>
                        )}
                        <p>
                            <span className='font-medium'>Đã giao hàng:</span> {orderData.delivered ? 'Rồi' : 'Chưa'}
                        </p>
                        {orderData.deliveredAt && (
                            <p>
                                <span className='font-medium'>Ngày giao hàng:</span> {formatDate(orderData.deliveredAt)}
                            </p>
                        )}
                    </div>
                </Card>

                <Card>
                    <h3 className='text-lg font-semibold mb-4'>Thông tin người nhận</h3>
                    <div className='space-y-3'>
                        <p>
                            <span className='font-medium'>Họ tên:</span> {orderData.user.name}
                        </p>
                        <p>
                            <span className='font-medium'>Email:</span> {orderData.user.email}
                        </p>
                        <p>
                            <span className='font-medium'>Số điện thoại:</span> {orderData.user.phone}
                        </p>
                        <p>
                            <span className='font-medium'>Địa chỉ:</span> {orderData.user.address.fullAddress}
                        </p>
                    </div>
                </Card>

                <Card className='md:col-span-2'>
                    <h3 className='text-lg font-semibold border-b pb-2 border-gray-300 dark:border-gray-600'>
                        Chi tiết sản phẩm
                    </h3>
                    <div className='space-y-4'>
                        {orderData.products.map((item) => (
                            <div key={item.id} className='flex items-start gap-4 p-4 rounded-lg'>
                                <img
                                    src={item.product.img[0]}
                                    alt={item.product.productName}
                                    className='w-24 h-24 object-cover rounded-lg'
                                />
                                <div className='flex-1'>
                                    <h4 className='font-medium'>{item.product.productName}</h4>
                                    <p className='text-sm text-gray-600'>Số lượng: {item.quantity}</p>
                                    <p className='text-sm text-gray-600'>
                                        Đơn giá: {(item.product.price - item.product.discount).toLocaleString()}đ
                                    </p>
                                    <p className='font-medium'>
                                        Thành tiền:{' '}
                                        {(
                                            (item.product.price - item.product.discount) *
                                            item.quantity
                                        ).toLocaleString()}
                                        đ
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className='md:col-span-2'>
                    <h3 className='text-lg font-semibold mb-4'>Tổng thanh toán</h3>
                    <div className='space-y-2'>
                        <div className='flex justify-between'>
                            <span>Tổng tiền hàng:</span>
                            <span>{orderData.itemsPrice.toLocaleString()}đ</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Phí vận chuyển:</span>
                            <span>{orderData.shippingPrice.toLocaleString()}đ</span>
                        </div>
                        {orderData.coupon && (
                            <div className='flex justify-between'>
                                <span>Giảm giá:</span>
                                <span>-{orderData.coupon.discount.toLocaleString()}đ</span>
                            </div>
                        )}
                        <div
                            className={`flex justify-between font-bold text-blue-500 text-lg pt-2 border-t ${
                                orderData.state === 'processing'
                                    ? 'text-blue-500'
                                    : orderData.state === 'delivered'
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}
                        >
                            <span>Tổng thanh toán:</span>
                            <span>{orderData.totalPrice.toLocaleString()}đ</span>
                        </div>
                    </div>
                </Card>
            </div>

            {orderData.state === 'processing' && (
                <div className='flex justify-center'>
                    <Button color='failure' onClick={() => setOpenModal(true)}>
                        Hủy đơn hàng
                    </Button>
                </div>
            )}

            <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-yellow-300' />
                        <h3 className='mb-2 text-lg font-normal text-gray-500'>
                            Bạn có chắc chắn muốn hủy đơn hàng này?
                        </h3>
                        <div className='mb-4'>
                            <textarea
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg'
                                rows={3}
                                placeholder='Vui lòng nhập lý do hủy đơn hàng...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleCancelOrder} isProcessing={loading}>
                                Xác nhận
                            </Button>
                            <Button color='gray' onClick={() => setOpenModal(false)}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
