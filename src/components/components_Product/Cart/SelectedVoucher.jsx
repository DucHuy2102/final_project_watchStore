import { IoCloseCircle } from 'react-icons/io5';

export default function SelectedVoucher({ voucher, onRemove }) {
    return (
        <div
            className='flex items-center justify-between bg-blue-50 dark:bg-blue-900/60 p-4 rounded-lg mt-4 
            hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-all duration-200 
            shadow-sm hover:shadow-md'
        >
            <div className='flex items-center space-x-4'>
                <div className='relative w-12 h-12'>
                    <img
                        src={
                            voucher.image ||
                            'https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                        }
                        alt={voucher.couponName}
                        className='w-full h-full object-cover rounded-lg shadow-sm'
                    />
                </div>
                <div className='space-y-1'>
                    <p className='font-medium text-blue-700 dark:text-blue-200'>{voucher.couponName}</p>
                    <p className='text-sm text-blue-600 dark:text-blue-300'>{voucher.description}</p>
                </div>
            </div>

            <button
                onClick={onRemove}
                className='group relative p-2 hover:bg-red-50 dark:hover:bg-red-900/30 
                    rounded-full transition-all duration-200'
                aria-label='Bỏ chọn voucher'
            >
                <IoCloseCircle
                    className='w-5 h-5 text-red-400 group-hover:text-red-500 
                    dark:text-red-400 dark:group-hover:text-red-300'
                />
                <span
                    className='absolute invisible group-hover:visible -top-8 right-0 
                    text-xs bg-gray-800 text-white px-2 py-1 rounded whitespace-nowrap'
                >
                    Bỏ chọn voucher
                </span>
            </button>
        </div>
    );
}
