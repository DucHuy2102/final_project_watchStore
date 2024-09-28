import React from 'react';

export default function CardVoucherMini({ voucher }) {
    console.log(voucher);
    return (
        <div
            className='w-full border dark:border-gray-700 shadow-sm shadow-gray-200 
        rounded-lg p-3 flex items-center justify-between gap-x-2'
        >
            <div className='flex items-center justify-between gap-x-3'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-12 h-12 object-cover rounded-lg'
                />
                <span className='font-medium'>{voucher.couponName}</span>
            </div>
            <button
                className='rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-300 
            text-white dark:text-gray-100 px-3 py-1'
            >
                Áp dụng
            </button>
        </div>
    );
}
