import { IoCloseCircle } from 'react-icons/io5';

export default function SelectedVoucher({ voucher, onRemove }) {
    return (
        <div
            className='flex items-center justify-between bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30
            dark:from-slate-900 dark:via-slate-900/95 dark:to-blue-900/50 p-8 rounded-2xl cursor-pointer
            hover:shadow-xl transition-all duration-500 border border-slate-100
            dark:border-slate-800 backdrop-blur-sm relative group'
        >
            {/* Elegant hover effect overlay */}
            <div
                className='absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-100/10 to-blue-100/0
                dark:from-blue-500/0 dark:via-blue-500/5 dark:to-blue-500/0
                opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl'
            />

            <div className='flex items-center space-x-8 relative'>
                <div className='relative w-20 h-20'>
                    {/* Price discount badge */}
                    <div
                        className='absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-red-600
                        dark:from-red-600 dark:to-red-700 text-white px-3 py-1.5 rounded-full
                        shadow-lg z-10 font-medium tracking-wider text-sm transform rotate-12
                        border border-white/20 backdrop-blur-sm'
                    >
                        -{voucher.discount}%
                    </div>

                    <div
                        className='absolute inset-0 bg-gradient-to-br from-blue-100 to-white dark:from-blue-900
                        dark:to-slate-900 rounded-2xl transform -rotate-6 opacity-50'
                    />
                    <img
                        src={
                            voucher.image ||
                            'https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                        }
                        alt={voucher.couponName}
                        className='w-full h-full object-cover rounded-2xl shadow-lg relative
                        ring-1 ring-slate-200/50 dark:ring-slate-700/50 transform transition-transform
                        duration-500 group-hover:scale-105'
                    />
                </div>
                <div className='space-y-2'>
                    <p className='font-semibold text-lg text-slate-800 dark:text-slate-100 tracking-wide min-w-0 truncate'>
                        {voucher.couponName}
                    </p>
                    <p
                        className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-light
                        max-w-md border-t border-slate-200 dark:border-slate-700/50 pt-1 min-w-0 truncate'
                    >
                        {voucher.description}
                    </p>
                </div>
            </div>

            <button
                onClick={onRemove}
                className='group/btn relative p-3.5 hover:bg-red-50 dark:hover:bg-red-900/30
                rounded-full transition-all duration-300 ml-6'
                aria-label='Bỏ chọn voucher'
            >
                <IoCloseCircle
                    className='w-7 h-7 text-slate-400 group-hover/btn:text-red-500
                    dark:text-slate-500 dark:group-hover/btn:text-red-400
                    transition-all duration-300 transform group-hover/btn:rotate-90'
                />
                <span
                    className='absolute invisible group-hover/btn:visible -top-12 right-0
                    text-xs bg-slate-900/90 text-slate-100 px-4 py-2 rounded-lg
                    whitespace-nowrap shadow-xl backdrop-blur-sm
                    transform -translate-y-1 transition-all duration-300'
                >
                    Bỏ chọn voucher
                </span>
            </button>
        </div>
    );
}
