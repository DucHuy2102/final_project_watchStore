import { useRef, useState } from 'react';

export default function CardVoucherFull({ voucher, onApplyVoucher }) {
    const [showVoucherDetail, setShowVoucherDetail] = useState(false);
    const detailRef = useRef(null);

    const date = new Date(voucher.expiryDate);
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(
        date.getMonth() + 1
    ).padStart(2, '0')}/${date.getFullYear()}`;

    return (
        <div
            className='w-full border dark:border-gray-700 shadow-sm shadow-gray-200
        rounded-lg p-3 flex items-center justify-between gap-x-2 relative group'
        >
            <div className='w-1/4'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-full h-auto object-cover rounded-lg'
                />
            </div>

            <div className='w-3/4 flex flex-col gap-y-2'>
                <div className='flex justify-between'>
                    <div className='flex flex-col items-start'>
                        <span className='text-md font-medium'>{voucher.couponName}</span>
                        <div className='flex'>
                            <span className='text-gray-400 text-sm'>{voucher.description}</span>
                        </div>
                    </div>
                    <span
                        onMouseEnter={() => setShowVoucherDetail(true)}
                        onMouseLeave={() => setShowVoucherDetail(false)}
                        className='text-blue-600 mt-1 cursor-pointer rounded-full 
                    border border-blue-600 w-4 h-4 text-xs flex justify-center items-center'
                    >
                        i
                    </span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='text-gray-500 text-sm'>HSD: {formattedDate}</span>
                    <button
                        onClick={() => onApplyVoucher(voucher.id)}
                        className='rounded-lg bg-blue-500 text-white text-sm px-3 py-[3px]'
                    >
                        Áp dụng
                    </button>
                </div>
            </div>

            {showVoucherDetail && (
                <div
                    ref={detailRef}
                    className='absolute z-50 hidden group-hover:flex flex-col bg-white 
            border border-gray-300 p-3 rounded-lg shadow-lg top-9 -right-5 w-60'
                >
                    <span className='font-medium text-sm'>Chi tiết mã giảm giá:</span>
                    <span className='text-gray-600 text-sm'>
                        Mã giảm giá: <strong>{voucher.couponCode}</strong>
                    </span>
                    <span className='text-gray-600 text-sm'>Hạn sử dụng: {formattedDate}</span>
                    <span className='text-gray-600 text-sm'>Điều kiện: {voucher.description}</span>
                </div>
            )}
        </div>
    );
}
