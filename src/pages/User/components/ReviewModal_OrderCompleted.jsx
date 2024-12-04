import { useState } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { Rate, Select, Tooltip } from 'antd';
import { Upload } from 'antd';
import { FiUpload } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const handleUploadImageCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'images_service');

        const response = await axios.post(`https://api.cloudinary.com/v1_1/dajzl4hdt/image/upload`, formData);

        if (response.data?.secure_url) {
            return response.data.secure_url;
        }
    } catch (error) {
        console.error('Upload failed:', error);
        toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
        return null;
    }
};

const selectStyles = {
    '.ant-select-selector': {
        height: 'auto !important',
        padding: '8px 12px !important',
    },
    '.ant-select-selection-item': {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '4px 0 !important',
    },
};

export default function ReviewModal_OrderCompleted({ order, onClose }) {
    const navigate = useNavigate();
    const { access_token: token } = useSelector((state) => state.user);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitReview = async () => {
        if (!selectedProduct) {
            toast.error('Vui lòng chọn sản phẩm cần đánh giá');
            return;
        }

        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!reviewText.trim()) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            setIsSubmitting(true);
            const uploadPromises = reviewImages.map((file) => handleUploadImageCloudinary(file.originFileObj));
            const uploadedUrls = await Promise.all(uploadPromises);
            const successfulUrls = uploadedUrls.filter((url) => url !== null);

            const reviewData = {
                rating,
                reviewText,
                productId: selectedProduct,
                reviewImages: successfulUrls,
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/review/create-review`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res?.status === 200) {
                toast.success('Đánh giá sản phẩm thành công');
                onClose();
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi gửi đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    const productSelect = () => (
        <div className='relative' style={selectStyles}>
            <Select
                style={{ width: '100%' }}
                className='product-select'
                placeholder='Chọn sản phẩm'
                onChange={(value) => setSelectedProduct(value)}
                options={order?.products?.map((item) => ({
                    value: item.product.id,
                    label: (
                        <div className='flex items-center gap-4 py-2'>
                            <img
                                src={item.product.img[0]}
                                alt={item.product.productName}
                                className='w-16 h-16 object-cover rounded-lg border border-gray-200'
                            />
                            <div>
                                <p className='font-medium text-gray-800'>{item.product.productName}</p>
                                <div className='flex items-center gap-x-5'>
                                    <p className='text-sm text-gray-500'>Màu sắc: {item.product.option.value.color}</p>
                                    <span
                                        className='w-5 h-5 rounded-full border border-gray-200'
                                        style={{ backgroundColor: `#${item.product.option.key}` }}
                                    />
                                </div>
                                <p className='text-sm text-gray-500'>Số lượng: {item.quantity}</p>
                            </div>
                        </div>
                    ),
                }))}
            />
        </div>
    );

    const selectedOptionProduct = () => {
        const selectedProductData = order?.products?.find((item) => item.product.id === selectedProduct);
        if (!selectedProductData) return null;

        return (
            <div className='relative bg-white rounded-xl border border-gray-200 p-4'>
                <div className='flex gap-4'>
                    <img
                        src={selectedProductData.product.img[0]}
                        alt={selectedProductData.product.productName}
                        className='w-24 h-24 object-cover rounded-lg border border-gray-100'
                    />
                    <div className='flex-1'>
                        <Tooltip title='Xem chi tiết sản phẩm'>
                            <h4
                                onClick={() => navigate(`/product-detail/${selectedProductData.product.id}`)}
                                className='font-medium text-gray-900 mb-2 cursor-pointer'
                            >
                                {selectedProductData.product.productName}
                            </h4>
                        </Tooltip>
                        <div className='space-y-1'>
                            <div className='flex items-center gap-x-3'>
                                <span className='text-sm text-gray-500'>Màu sắc:</span>
                                <div className='flex items-center gap-x-2'>
                                    <span className='text-sm font-medium'>
                                        {selectedProductData.product.option.value.color}
                                    </span>
                                    <span
                                        className='w-5 h-5 rounded-full border border-gray-200'
                                        style={{ backgroundColor: `#${selectedProductData.product.option.key}` }}
                                    />
                                </div>
                            </div>
                            <p className='text-sm text-gray-500'>
                                Số lượng: <span className='font-medium'>{selectedProductData.quantity}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className='absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-5 w-5'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                        >
                            <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='px-6 py-4'>
            <div className='bg-white rounded-xl'>
                <div className='mb-8 text-center'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-3'>Xin hãy chia sẻ trải nghiệm của bạn</h2>
                    <p className='text-gray-600 text-sm'>
                        Đánh giá của bạn sẽ giúp chúng tôi cải thiện chất lượng sản phẩm tốt hơn
                    </p>
                    <p className='text-gray-500 text-xs font-semibold mt-2'>Mã đơn hàng: {order?.id}</p>
                </div>

                <div className='space-y-8'>
                    <div className='bg-gray-50 p-6 rounded-xl'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                            Chọn sản phẩm cần đánh giá
                        </label>
                        {selectedProduct ? selectedOptionProduct() : productSelect()}
                    </div>

                    <div className='bg-gray-50 p-6 rounded-xl'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>Đánh giá của bạn</label>
                        <div className='flex flex-col items-center'>
                            <Rate
                                className='text-4xl'
                                value={rating}
                                onChange={(value) => setRating(value)}
                                character={<FaStar />}
                                allowHalf
                                allowClear
                            />
                            <p className='mt-3 text-sm text-gray-600'>
                                {rating === 0 ? 'Chọn số sao đánh giá' : `Bạn đã chọn ${rating} sao`}
                            </p>
                        </div>
                    </div>

                    <div className='bg-gray-50 p-6 rounded-xl'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>Nhận xét chi tiết</label>
                        <Textarea
                            rows={4}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder='Hãy chia sẻ những điều bạn thích về sản phẩm...'
                            className='block w-full rounded-xl border-gray-200 focus:border-blue-500 focus:ring-0'
                        />
                    </div>

                    <div className='bg-gray-50 p-6 rounded-xl'>
                        <label className='block text-sm font-medium text-gray-700 mb-3'>
                            Thêm hình ảnh (tối đa 5 ảnh)
                        </label>
                        <Upload
                            listType='picture-card'
                            fileList={reviewImages}
                            onChange={({ fileList }) => setReviewImages(fileList)}
                            beforeUpload={() => false}
                            maxCount={5}
                            multiple
                            accept='image/*'
                        >
                            {reviewImages.length >= 5 ? null : (
                                <div className='flex flex-col items-center'>
                                    <FiUpload className='w-5 h-5' />
                                    <div className='mt-2 text-sm'>Tải ảnh</div>
                                </div>
                            )}
                        </Upload>
                    </div>

                    <div className='flex justify-end gap-4 pt-4'>
                        <Button color='gray' onClick={onClose} className='px-6 hover:bg-gray-100 transition-colors'>
                            Đóng
                        </Button>
                        <Button
                            color='blue'
                            onClick={handleSubmitReview}
                            disabled={isSubmitting}
                            className='px-6 !ring-0 bg-blue-600 hover:bg-blue-700 transition-colors'
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
