import React, { useState, useMemo, useCallback } from 'react';
import { Modal, TextInput } from 'flowbite-react';
import { FiSearch, FiGift, FiClock, FiPercent } from 'react-icons/fi';
import SelectedVoucher from './SelectedVoucher';
import { motion, AnimatePresence } from 'framer-motion';

const VoucherCard = React.memo(({ voucher, onApplyVoucher, totalAmount, userProvince }) => {
    const { isValidDate, hasRemainingTimes, isMinPriceReached, isApplicable, remainingAmount, formattedExpiryDate, isValidProvince } =
        useMemo(() => {
            const now = new Date();
            const createdDate = new Date(voucher.createdDate);
            const expiryDate = new Date(voucher.expiryDate);
            
            const isValidProvince = !voucher.province || voucher.province.value === userProvince.value;

            return {
                isValidDate: now >= createdDate && now <= expiryDate,
                hasRemainingTimes: voucher.times > 0,
                isMinPriceReached: totalAmount >= voucher.minPrice,
                isApplicable:
                    now >= createdDate && 
                    now <= expiryDate && 
                    voucher.times > 0 && 
                    totalAmount >= voucher.minPrice &&
                    isValidProvince,
                remainingAmount: voucher.minPrice - totalAmount,
                formattedExpiryDate: expiryDate.toLocaleDateString('vi-VN'),
                isValidProvince,
            };
        }, [voucher.createdDate, voucher.expiryDate, voucher.times, voucher.minPrice, totalAmount, voucher.province, userProvince]);

    return (
        <div className='relative group'>
            <div className='absolute inset-0 bg-gradient-to-r from-amber-50 to-purple-50 dark:from-amber-900/20 dark:to-purple-900/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

            <div className='relative bg-white dark:bg-gray-800/90 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-amber-100/50 dark:border-amber-800/50'>
                <div className='flex items-center gap-3'>
                    <div className='w-16 h-16 flex-shrink-0 overflow-hidden rounded-md shadow-sm'>
                        <img
                            src={
                                voucher.image ||
                                'https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                            }
                            alt='Voucher'
                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                        />
                    </div>

                    <div className='flex-grow min-w-0'>
                        <h4 className='text-base font-medium bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent truncate'>
                            {voucher.couponName}
                        </h4>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1'>
                            {voucher.description}
                        </p>

                        <div className='flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400'>
                            <div className='flex items-center gap-1'>
                                <FiPercent className='w-3.5 h-3.5 text-amber-500' />
                                <span>{voucher.discount}%</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <FiClock className='w-3.5 h-3.5 text-amber-500' />
                                <span>{formattedExpiryDate}</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex-shrink-0 ml-2'>
                        {isApplicable ? (
                            <button
                                onClick={onApplyVoucher}
                                className='px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
                                text-white text-xs font-medium rounded-md transition-all duration-300 hover:shadow-md
                                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1'
                            >
                                Áp dụng
                            </button>
                        ) : (
                            <div className='text-center'>
                                <span className='text-xs font-medium text-orange-500 dark:text-orange-400 whitespace-nowrap'>
                                    {!isValidDate
                                        ? 'Hết hạn'
                                        : !hasRemainingTimes
                                        ? 'Hết lượt'
                                        : !isMinPriceReached
                                        ? `Thiếu ${remainingAmount.toLocaleString('vi-VN')}₫`
                                        : !isValidProvince
                                        ? 'Không áp dụng cho khu vực này'
                                        : 'Khả dụng'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

VoucherCard.displayName = 'VoucherCard';

const EmptyState = () => (
    <div className='flex flex-col items-center justify-center py-8 space-y-3'>
        <div className='p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full'>
            <FiGift className='w-6 h-6 text-amber-500/70' />
        </div>
        <div className='text-center'>
            <h3 className='text-sm font-medium text-gray-600 dark:text-gray-300'>Không tìm thấy voucher!</h3>
            <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Vui lòng thử tìm kiếm khác</p>
        </div>
    </div>
);

const VoucherModal_Component = ({ vouchers, isOpen, onClose, onApplyVoucher, totalAmount, selectedVoucher, userProvince }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = useMemo(() => {
        const searchLower = searchTerm.toLowerCase();
        return (
            vouchers?.filter(
                (voucher) =>
                    voucher.couponName.toLowerCase().includes(searchLower) ||
                    voucher.description.toLowerCase().includes(searchLower),
            ) || []
        );
    }, [vouchers, searchTerm]);

    const handleVoucherApply = useCallback(
        (voucher) => {
            onApplyVoucher(voucher);
            onClose();
        },
        [onApplyVoucher, onClose],
    );

    return (
        <Modal show={isOpen} onClose={onClose} size='md' className='!p-0'>
            <div className='absolute inset-0 bg-gradient-to-br from-amber-50/90 via-white to-purple-50/90 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/80 rounded-lg' />

            <Modal.Header className='relative border-b border-amber-100/30 dark:border-amber-800/30 pb-3'>
                <div className='flex items-center gap-2.5'>
                    <div className='p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-md shadow-md'>
                        <FiGift className='w-4 h-4 text-white' />
                    </div>
                    <div>
                        <h3 className='text-lg font-medium bg-gradient-to-r from-amber-700 via-amber-600 to-purple-700 bg-clip-text text-transparent'>
                            Ưu đãi độc quyền
                        </h3>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Chọn voucher để nhận ưu đãi tốt nhất</p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body className='relative p-4'>
                {selectedVoucher ? (
                    <SelectedVoucher voucher={selectedVoucher} onRemove={() => onApplyVoucher(null)} />
                ) : (
                    <div className='space-y-4'>
                        <TextInput
                            type='text'
                            placeholder='Tìm kiếm voucher...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={FiSearch}
                            className='!ring-0 focus:!border-amber-500'
                            sizing='sm'
                        />

                        <div className='h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/50 scrollbar-track-amber-100/30 dark:scrollbar-thumb-amber-600/50 dark:scrollbar-track-gray-700/30'>
                            {filteredVouchers.length > 0 ? (
                                <div className='space-y-2'>
                                    <AnimatePresence>
                                        {filteredVouchers.map((voucher, index) => (
                                            <motion.div
                                                key={voucher.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                            >
                                                <VoucherCard
                                                    voucher={voucher}
                                                    onApplyVoucher={() => handleVoucherApply(voucher)}
                                                    totalAmount={totalAmount}
                                                    userProvince={userProvince}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <EmptyState />
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className='relative border-t border-amber-100/30 dark:border-amber-800/30'>
                <button
                    onClick={onClose}
                    className='w-full px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700
                    text-white text-sm rounded-md transition-all duration-300 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1'
                >
                    Đóng
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default React.memo(VoucherModal_Component);
