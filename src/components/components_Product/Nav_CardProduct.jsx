import { useSearchParams } from 'react-router-dom';
import { Breadcrumb_Component, FilterSortPanel_Component } from '../exportComponent';

export default function Nav_CardProduct({ totalProducts }) {
    const [searchParams] = useSearchParams();

    return (
        <div
            className='text-white w-full border-b border-gray-200 dark:border-gray-600 pb-4
        flex flex-col items-center justify-between gap-y-2 sm:flex-row sm:px-5'
        >
            <Breadcrumb_Component />

            {searchParams.size !== 0 && totalProducts > 0 ? (
                <span className='text-gray-600 dark:text-gray-200 font-semibold text-lg'>
                    Tìm được <span className='text-teal-500 font-bold'>{totalProducts}</span> sản
                    phẩm khớp với bộ lọc
                </span>
            ) : (
                <span className='text-gray-600 dark:text-gray-200 font-semibold text-lg'>
                    Tất cả <span className='text-blue-500 font-bold'>{totalProducts}</span> sản phẩm
                </span>
            )}

            <FilterSortPanel_Component />
        </div>
    );
}
