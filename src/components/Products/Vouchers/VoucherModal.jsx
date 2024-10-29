import { useState, useMemo } from 'react';
import { Modal, TextInput, Button } from 'flowbite-react';
import { FiSearch } from 'react-icons/fi';
import { SelectedVoucher_Component } from '../../exportComponent';

const VoucherModal_Component = ({ vouchers, isOpen, onClose, onApplyVoucher, totalAmount, selectedVoucher }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredVouchers = useMemo(() => {
        return vouchers.filter(
            (voucher) =>
                voucher.couponName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [vouchers, searchTerm]);

    return (
        <Modal show={isOpen} onClose={onClose} size='lg'>
            <Modal.Header>
                Watc<span className='text-yellow-400 font-bold'>H</span>es Khuyến mãi
            </Modal.Header>
            <Modal.Body>
                {selectedVoucher ? (
                    <SelectedVoucher_Component voucher={selectedVoucher} onRemove={() => onApplyVoucher(null)} />
                ) : (
                    <>
                        <div className='mb-4'>
                            <TextInput
                                type='text'
                                placeholder='Tìm kiếm mã giảm giá...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={FiSearch}
                            />
                        </div>
                        <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
                            {filteredVouchers.map((voucher) => (
                                <VoucherCard
                                    key={voucher.id}
                                    voucher={voucher}
                                    onApplyVoucher={() => {
                                        onApplyVoucher(voucher);
                                        onClose();
                                    }}
                                    totalAmount={totalAmount}
                                />
                            ))}
                        </div>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} className='w-full'>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const VoucherCard = ({ voucher, onApplyVoucher, totalAmount }) => {
    const now = new Date();
    const createdDate = new Date(voucher.createdDate);
    const expiryDate = new Date(voucher.expiryDate);
    const formattedExpiryDate = expiryDate.toLocaleDateString('vi-VN');

    const isValidDate = now >= createdDate && now <= expiryDate;
    const hasRemainingTimes = voucher.times > 0;
    const isMinPriceReached = totalAmount >= voucher.minPrice;

    const isApplicable = isValidDate && hasRemainingTimes && isMinPriceReached;

    const remainingAmount = voucher.minPrice - totalAmount;

    const getStatusMessage = () => {
        if (!isValidDate) return 'Voucher đã hết hạn';
        if (!hasRemainingTimes) return 'Voucher đã hết lượt sử dụng';
        if (!isMinPriceReached) return `Còn thiếu ${remainingAmount.toLocaleString('vi-VN')} ₫`;
        return 'Có thể áp dụng';
    };

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-start space-x-4'>
            <div className='w-1/4 flex-shrink-0'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-full h-auto object-cover rounded-lg'
                />
            </div>
            <div className='flex-grow'>
                <h4 className='text-lg font-semibold'>{voucher.couponName}</h4>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{voucher.description}</p>
                <div className='mt-2 flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>HSD: {formattedExpiryDate}</span>
                    {isApplicable ? (
                        <Button onClick={onApplyVoucher} size='sm' gradientDuoTone='greenToBlue'>
                            Áp dụng
                        </Button>
                    ) : (
                        <div className='flex flex-col items-end'>
                            <span className='text-sm font-medium text-orange-500'>{getStatusMessage()}</span>
                            {!isMinPriceReached && (
                                <div className='w-full bg-gray-200 rounded-full h-2.5 mt-1'>
                                    <div
                                        className='bg-orange-500 h-2.5 rounded-full'
                                        style={{ width: `${Math.min((totalAmount / voucher.minPrice) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VoucherModal_Component;
