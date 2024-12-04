import { useCallback, useEffect, useState } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Image, Input, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BsSend } from 'react-icons/bs';
import { Rate } from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

const DisplayUserInfo = ({ title, value }) => (
    <div className='flex justify-between items-center'>
        <span className='text-gray-600 dark:text-gray-400'>{title}</span>
        <span className='font-medium max-w-[25vw] truncate hover:cursor-help' title={value}>
            {value}
        </span>
    </div>
);

export default function OrderDetail({ orderData, onBack }) {
    const navigate = useNavigate();
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [openModalReview, setOpenModalReview] = useState(false);
    const [rating, setRating] = useState(1);
    const [reviewText, setReviewText] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(orderData.state === 'processing');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const formatDate = useCallback((dateStr) => {
        return dateStr
            ? new Date(dateStr).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : 'Chưa cập nhật';
    }, []);

    const handleCancelOrder = async () => {
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
                setMessage('');
                setIsDeleted(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteOrder = async () => {
        try {
            setLoading(true);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/order/is-delivered`,
                {
                    orderId: orderData.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                setOpenModalReview(true);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div
            className='h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 
                      rounded-lg hover:border-blue-500 transition-colors duration-200'
        >
            {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
            <div className='mt-2'>Tải ảnh</div>
        </div>
    );

    const handleUploadImageCloudinary = useCallback(async (file) => {
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'review_image');

            const response = await axios.post(`https://api.cloudinary.com/v1_1/dajzl4hdt/image/upload`, formData);

            if (response.data?.secure_url) {
                setReviewImages((prev) => [...prev, response.data.secure_url]);
                return response.data.secure_url;
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
        } finally {
            setUploadLoading(false);
        }
    }, []);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Vui lòng đánh giá sao cho sản phẩm!');
            return;
        }

        if (reviewText === '') {
            toast.error('Vui lòng đánh giá sản phẩm!');
            return;
        }

        try {
            setSubmitting(true);
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/review/create-review`,
                {
                    orderId: orderData.id,
                    rating,
                    reviewText: reviewText.trim(),
                    reviewImages: reviewImages,
                    productId: orderData.products[0].product.id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );

            if (response.status === 200) {
                toast.success('Đánh giá của bạn đã được gửi thành công!');
                setOpenModalReview(false);
                setRating(0);
                setReviewText('');
                setReviewImages([]);
                setFileList([]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại!');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className='space-y-8 max-w-7xl mx-auto py-6'>
            {/* Header */}
            <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4'>
                <div>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Chi tiết đơn hàng</h2>
                    <p className='text-gray-600 dark:text-gray-400 mt-1'>
                        Mã đơn hàng: <span className='font-medium'>{orderData.id}</span>
                    </p>
                </div>
                <Button
                    color='gray'
                    className='focus:!ring-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                    onClick={onBack}
                >
                    ← Quay lại
                </Button>
            </div>

            {/* Body */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Order info */}
                <Card className='shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-3'>
                        Thông tin đơn hàng
                    </h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center'>
                            <span className='text-gray-600 dark:text-gray-400'>Ngày đặt</span>
                            <span className='font-medium'>{formatDate(orderData.createdAt)}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-gray-600 dark:text-gray-400'>Trạng thái đơn hàng</span>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    isDeleted
                                        ? 'bg-blue-100 text-blue-700'
                                        : orderData.state === 'delivery'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : orderData.state === 'complete'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {isDeleted
                                    ? 'Đang chờ xử lý'
                                    : orderData.state === 'delivery'
                                    ? 'Đang giao hàng'
                                    : orderData.state === 'complete'
                                    ? 'Đơn hàng đã giao'
                                    : 'Đơn hàng đã bị hủy'}
                            </span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-gray-600 dark:text-gray-400'>Phương thức thanh toán</span>
                            <span className='font-medium'>
                                {orderData.paymentMethod === 'cash' ? 'Thanh toán khi nhận hàng' : 'Thanh toán online'}
                            </span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-gray-600 dark:text-gray-400'>Trạng thái thanh toán</span>
                            <span className='font-medium'>{orderData.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                        </div>
                        {orderData.paidAt && (
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-600 dark:text-gray-400'>Ngày thanh toán</span>
                                <span className='font-medium'>{formatDate(orderData.paidAt)}</span>
                            </div>
                        )}
                        {orderData.deliveredAt && (
                            <div className='flex justify-between items-center'>
                                <span className='text-gray-600 dark:text-gray-400'>Ngày giao hàng</span>
                                <span className='font-medium'>{formatDate(orderData.deliveredAt)}</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* User info */}
                <Card className='shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-xl font-semibold mb-6 text-gray-900 dark:text-white border-b pb-3'>
                        Thông tin người nhận
                    </h3>
                    <div className='space-y-4'>
                        <DisplayUserInfo title='Họ và tên' value={orderData.user.name} />
                        <DisplayUserInfo title='Email liên hệ' value={orderData.user.email} />
                        <DisplayUserInfo title='Số điện thoại' value={orderData.user.phone} />
                        <DisplayUserInfo title='Địa chỉ' value={orderData.user.address.fullAddress} />
                    </div>
                </Card>

                {/* Product info */}
                <Card className='md:col-span-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 overflow-hidden'>
                    <div className='flex justify-between items-center border-b pb-3'>
                        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Chi tiết sản phẩm</h3>
                        <span className='px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium'>
                            {orderData.products.length} sản phẩm
                        </span>
                    </div>

                    <div className='divide-y divide-gray-100 dark:divide-gray-700'>
                        {orderData.products.map((item) => (
                            <div
                                key={item.id}
                                className='flex items-start gap-8 py-6 first:pt-4 last:pb-4 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 
                                transition-all duration-300 rounded-xl p-4 group'
                            >
                                <div className='relative'>
                                    <Image
                                        src={item.product.img[0]}
                                        alt={item.product.productName}
                                        preview={{
                                            mask: (
                                                <div
                                                    className='absolute inset-0 bg-black/30 backdrop-blur-[2px] flex items-center 
                                                justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                                >
                                                    <span
                                                        className='text-white text-sm font-medium px-4 py-2 rounded-full 
                                                    bg-black/50 backdrop-blur-sm'
                                                    >
                                                        Xem ảnh
                                                    </span>
                                                </div>
                                            ),
                                        }}
                                        className='!w-36 !h-36 object-cover rounded-lg shadow-md group-hover:shadow-xl 
                                        transition-all duration-300 group-hover:scale-105'
                                    />
                                </div>
                                <div className='flex-1 space-y-4'>
                                    <div className='flex justify-between items-start gap-4'>
                                        <h4
                                            onClick={() => navigate(`/product-detail/${item.product.id}`)}
                                            className='font-bold text-xl text-gray-900 dark:text-white hover:text-blue-600 
                                            transition-colors duration-200 cursor-pointer max-w-xl line-clamp-2 group-hover:text-blue-600'
                                        >
                                            {item.product.productName}
                                        </h4>
                                        <div className='text-right'>
                                            <div className='font-bold text-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300'>
                                                {(
                                                    (item.product.option.value.price -
                                                        item.product.option.value.discount) *
                                                    item.quantity
                                                ).toLocaleString()}
                                                <span className='text-lg ml-1'>đ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-6 text-sm'>
                                        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full'>
                                            <span className='text-gray-500 dark:text-gray-400'>Số lượng:</span>
                                            <span className='font-semibold text-gray-900 dark:text-white'>
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full'>
                                            <span className='text-gray-500 dark:text-gray-400'>Đơn giá:</span>
                                            <span className='font-semibold text-gray-900 dark:text-white'>
                                                {(
                                                    item.product.option.value.price - item.product.option.value.discount
                                                ).toLocaleString()}
                                                <span className='text-xs ml-1'>đ</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-6 text-sm'>
                                        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full'>
                                            <span className='text-gray-500 dark:text-gray-400'>Màu sắc:</span>
                                            <span className='font-semibold text-gray-900 dark:text-white'>
                                                {item.product.option.value.color}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-full'>
                                            <span className='text-gray-500 dark:text-gray-400'>Thương hiệu:</span>
                                            <span className='font-semibold text-gray-900 dark:text-white'>
                                                {item.product.brand}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Total price */}
                <Card className='md:col-span-2 shadow-md hover:shadow-lg transition-shadow'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white border-b pb-3'>
                        Thông tin thanh toán
                    </h3>
                    <div className='space-y-4'>
                        <div className='flex justify-between items-center text-gray-600 dark:text-gray-400'>
                            <span>Tổng tiền hàng</span>
                            <span>{orderData.itemsPrice.toLocaleString()}đ</span>
                        </div>
                        <div className='flex justify-between items-center text-gray-600 dark:text-gray-400'>
                            <span>Phí vận chuyển</span>
                            <span>{orderData.shippingPrice.toLocaleString()}đ</span>
                        </div>
                        {orderData.coupon && (
                            <div className='flex justify-between items-center text-green-600'>
                                <span>Giảm giá</span>
                                <span>-{orderData.coupon.discount.toLocaleString()}đ</span>
                            </div>
                        )}
                        <div className='flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700'>
                            <span className='text-lg font-semibold text-gray-900 dark:text-white'>Tổng thanh toán</span>
                            <span
                                className={`text-xl font-bold ${
                                    orderData.state === 'processing'
                                        ? 'text-blue-600'
                                        : orderData.state === 'delivered'
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }`}
                            >
                                {orderData.totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Button cancel order */}
            {isDeleted && (
                <div className='flex justify-center'>
                    <Button
                        color='failure'
                        className='focus:!ring-0 hover:bg-red-700 transition-colors px-6'
                        onClick={() => setOpenModal(true)}
                    >
                        Hủy Đơn Hàng
                    </Button>
                </div>
            )}

            {/* Button complete order */}
            {orderData.state === 'delivery' && (
                <div className='flex justify-center'>
                    <Button
                        color='success'
                        className='focus:!ring-0 hover:bg-green-700 transition-colors px-6'
                        onClick={handleCompleteOrder}
                    >
                        Đã Nhận Hàng
                    </Button>
                </div>
            )}

            {/* Modal cancel order */}
            <Modal className='backdrop-blur-md' show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center p-4'>
                        <HiOutlineExclamationCircle className='mx-auto mb-6 h-16 w-16 text-yellow-400' />
                        <h3 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                            Xác nhận hủy đơn hàng
                        </h3>
                        <p className='mb-6 text-gray-500 dark:text-gray-400'>Bạn có chắc chắn muốn hủy đơn hàng này?</p>
                        <div className='mb-6'>
                            <textarea
                                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:!ring-0 focus:border-gray-400'
                                rows={3}
                                placeholder='Vui lòng nhập lý do hủy đơn hàng...'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-center gap-4'>
                            <Button
                                color='failure'
                                className='focus:!ring-0 hover:bg-red-700 transition-colors px-6'
                                onClick={handleCancelOrder}
                                isProcessing={loading}
                            >
                                Xác nhận hủy
                            </Button>
                            <Button
                                color='gray'
                                className='focus:!ring-0 hover:bg-gray-700 transition-colors px-6'
                                onClick={() => setOpenModal(false)}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal review order */}
            <Modal show={openModalReview} size='md' onClose={() => setOpenModalReview(false)} popup>
                <Modal.Body className='pt-5'>
                    <div className='space-y-6 p-2'>
                        {/* Rating Stars */}
                        <div className='flex flex-col items-center gap-2'>
                            <span className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                                Đánh giá của bạn về chất lượng sản phẩm
                            </span>
                            <Rate value={rating} onChange={(value) => setRating(value)} />
                        </div>
                        {/* Review Text */}
                        <Input.TextArea
                            rows={4}
                            maxLength={700}
                            showCount
                            className='w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 
                        focus:ring-blue-500 focus:border-blue-500 transition-all duration-200
                        bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
                            placeholder='Cửa hàng xin những đánh giá của bạn để cải thiện chất lượng dịch vụ và sản phẩm'
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />
                        {/* Image Upload */}
                        <div className='space-y-1'>
                            <span className='text-sm text-gray-600 dark:text-gray-400'>
                                Thêm hình ảnh (tối đa 4 ảnh)
                            </span>
                            <Upload
                                listType='picture-card'
                                fileList={fileList}
                                onPreview={(file) => {
                                    window.open(file.url || file.preview);
                                }}
                                beforeUpload={async (file) => {
                                    const isImage = file.type.startsWith('image/');
                                    if (!isImage) {
                                        message.error('Chỉ có thể tải lên file ảnh!');
                                        return false;
                                    }

                                    const isLt5M = file.size / 1024 / 1024 < 5;
                                    if (!isLt5M) {
                                        message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
                                        return false;
                                    }

                                    if (fileList.length >= 4) {
                                        message.error('Chỉ có thể tải lên tối đa 4 ảnh!');
                                        return false;
                                    }

                                    // Upload to Cloudinary
                                    const url = await handleUploadImageCloudinary(file);
                                    if (url) {
                                        setFileList((prev) => [
                                            ...prev,
                                            {
                                                uid: file.uid,
                                                name: file.name,
                                                status: 'done',
                                                url: url,
                                            },
                                        ]);
                                    }
                                    return false;
                                }}
                                onRemove={(file) => {
                                    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
                                    setReviewImages((prev) => prev.filter((url) => url !== file.url));
                                }}
                            >
                                {fileList.length >= 4 ? null : uploadButton}
                            </Upload>
                        </div>

                        {/* Buttons */}
                        <div className='flex justify-between items-center'>
                            <Button
                                color='gray'
                                className='focus:!ring-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-2'
                                onClick={() => setOpenModalReview(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                color='blue'
                                className='focus:!ring-0 bg-blue-600 hover:bg-blue-700 transition-colors px-2'
                                onClick={handleSubmitReview}
                                isProcessing={submitting}
                            >
                                <div className='flex items-center justify-center gap-x-1 group'>
                                    <BsSend className='group-hover:scale-x-125 transition-transform duration-200' />
                                    <span>Gửi</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
