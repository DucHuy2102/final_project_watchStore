import { Rate, Modal } from 'antd';
import { Image } from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

const ReviewItem = ({ review }) => (
    <div
        className='bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 
        border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow'
    >
        <div className='flex items-start gap-4'>
            <div className='flex-shrink-0'>
                <div
                    className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 
                    dark:from-blue-900 dark:to-blue-800 flex items-center justify-center
                    shadow-inner border-2 border-white dark:border-gray-700'
                >
                    <span
                        className='text-xl font-semibold text-blue-600 dark:text-blue-300
                        bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-blue-800
                        dark:from-blue-300 dark:to-blue-500'
                    >
                        {review?.user?.name?.charAt(0).toUpperCase()}
                    </span>
                </div>
            </div>

            <div className='flex-1'>
                <div className='flex items-start justify-between'>
                    <div>
                        <h4 className='font-medium text-gray-900 dark:text-white'>{review?.user?.name}</h4>
                        <div className='flex items-center gap-2 mt-1'>
                            <Rate disabled value={review?.rating} className='text-sm' />
                            <span className='text-sm text-gray-500'>{review.rating} sao</span>
                        </div>
                        <p className='text-sm text-gray-500 mt-1'>
                            {format(new Date(review?.createdAt), 'dd MMMM yyyy, HH:mm', {
                                locale: vi,
                            })}
                        </p>
                    </div>
                    {review?.user?.address?.fullAddress && (
                        <span className='text-sm text-gray-500'>{review?.user?.address?.fullAddress}</span>
                    )}
                </div>

                <p className='text-gray-600 dark:text-gray-300 mt-3 leading-relaxed'>{review.reviewText}</p>

                {review?.reviewImages && review?.reviewImages?.length > 0 && (
                    <div className='mt-4'>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                            {review?.reviewImages?.map((image, index) => (
                                <div
                                    key={index}
                                    className='group relative aspect-square overflow-hidden 
                                    rounded-xl border border-gray-200 dark:border-gray-700
                                    bg-gray-50 dark:bg-gray-900/50 shadow-sm hover:shadow-md 
                                    transition-all duration-300 ease-in-out'
                                >
                                    <Image
                                        src={image}
                                        alt={`Review image ${index + 1}`}
                                        className='w-full h-full object-cover transform group-hover:scale-110 
                                            transition-transform duration-500 ease-in-out'
                                        preview={{
                                            mask: (
                                                <div
                                                    className='absolute inset-0 bg-black/40 backdrop-blur-[2px]
                                                    opacity-0 group-hover:opacity-100 transition-opacity
                                                    duration-300 flex items-center justify-center'
                                                >
                                                    <span
                                                        className='px-4 py-2 bg-white/90 dark:bg-gray-800/90
                                                        rounded-full text-sm font-medium text-gray-900
                                                        dark:text-white shadow-lg transform translate-y-2
                                                        group-hover:translate-y-0 transition-transform
                                                        duration-300'
                                                    >
                                                        Xem ảnh
                                                    </span>
                                                </div>
                                            ),
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default function ListReview({ reviews = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (reviews.length === 0) {
        return <div className='text-center py-8 text-gray-500 font-serif'>Chưa có đánh giá nào cho sản phẩm này</div>;
    }

    return (
        <div className='w-full max-w-4xl mx-auto mt-5'>
            <div className='space-y-6'>
                {reviews.slice(0, 3).map((review) => (
                    <ReviewItem key={review.id} review={review} />
                ))}
            </div>

            {reviews.length > 3 && (
                <div className='text-center mt-8'>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 
                            dark:border-gray-700 rounded-full shadow-sm hover:shadow-md
                            transition-all duration-300 transform hover:scale-105
                            text-gray-700 dark:text-gray-300 font-medium
                            hover:border-blue-500 dark:hover:border-blue-400'
                    >
                        Xem tất cả {reviews.length} đánh giá
                    </button>
                </div>
            )}

            <Modal
                title={
                    <div className='text-xl font-serif text-center pb-4 border-b dark:border-gray-700'>
                        Toàn bộ đánh giá của khách hàng ({reviews.length})
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
                className='review-modal'
            >
                <div className='max-h-[70vh] overflow-y-auto space-y-6 py-4'>
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} />
                    ))}
                </div>
            </Modal>
        </div>
    );
}
