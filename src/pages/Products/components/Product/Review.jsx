import { useState, useCallback } from 'react';
import { Button, Textarea, Modal } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Spinner } from 'flowbite-react';
import { MdRateReview } from 'react-icons/md';
import { Upload, Rate } from 'antd';
import { FiUpload } from 'react-icons/fi';

export default function Review({ order, onClose, onReviewAdded }) {
    const [openModal, setOpenModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewImages, setReviewImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { id: productId } = useParams();
    const { access_token: token } = useSelector((state) => state.user);

    const handleUploadImageCloudinary = useCallback(async (file) => {
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
    }, []);

    const resetForm = () => {
        setRating(0);
        setReviewText('');
        setReviewImages([]);
    };

    const handleSubmitReview = async () => {
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
                productId,
                reviewImages: successfulUrls,
            };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/review/create-review`, reviewData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res?.status === 200) {
                const formattedReview = {
                    id: res.data.id,
                    createdAt: res.data.createdAt,
                    delete: false,
                    productId: productId,
                    rating: rating,
                    reviewImages: successfulUrls,
                    reviewText: reviewText,
                    user: res.data.user,
                };
                onReviewAdded(formattedReview);
                toast.success('Đánh giá sản phẩm thành công');
                resetForm();
                setOpenModal(false);
            }
        } catch (error) {
            console.error(error);
            toast.error('Đã xảy ra lỗi khi gửi đánh giá');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button
                color='blue'
                onClick={() => setOpenModal(true)}
                className='w-full md:w-auto px-5 py-1 font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center !ring-0 justify-center'
            >
                <MdRateReview className='w-5 h-5' />
                <span className='ml-2'>Viết đánh giá</span>
            </Button>

            <Modal
                show={openModal}
                size='lg'
                onClose={() => {
                    setOpenModal(false);
                    resetForm();
                }}
                className='backdrop-blur-sm'
            >
                <Modal.Header className='border-b border-gray-200 dark:border-gray-700'>
                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>Đánh giá sản phẩm</h3>
                </Modal.Header>
                <Modal.Body>
                    <div className='flex flex-col items-center mb-6'>
                        <Rate
                            className='text-3xl'
                            value={rating}
                            onChange={(value) => setRating(value)}
                            allowHalf
                            allowClear
                        />
                        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                            {rating === 0 ? 'Chọn số sao đánh giá' : `Bạn đã chọn ${rating} sao`}
                        </p>
                    </div>

                    <div className='mb-6'>
                        <Textarea
                            rows={4}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder='Chia sẻ trải nghiệm của bạn về sản phẩm...'
                            className='block w-full rounded-xl border-gray-200 focus:!border-blue-500 !ring-0'
                        />
                    </div>

                    <div className='mb-6'>
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
                                    <div className='mt-2'>Tải ảnh</div>
                                </div>
                            )}
                        </Upload>
                    </div>

                    <div className='w-full flex justify-end gap-4'>
                        <Button
                            color='gray'
                            onClick={() => {
                                setOpenModal(false);
                                resetForm();
                            }}
                        >
                            Hủy
                        </Button>
                        <Button color={'blue'} onClick={handleSubmitReview} disabled={isSubmitting} className='!ring-0'>
                            {isSubmitting ? (
                                <div className='flex items-center justify-center gap-2'>
                                    <Spinner size='sm' />
                                    <span>Đang gửi...</span>
                                </div>
                            ) : (
                                'Gửi đánh giá'
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
