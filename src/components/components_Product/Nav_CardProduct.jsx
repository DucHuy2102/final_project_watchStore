import { useSelector } from 'react-redux';
import { Breadcrumb_Component, FilterSortPanel_Component } from '../exportComponent';

export default function Nav_CardProduct({ totalProduct }) {
    const filterParamsFromRedux = useSelector((state) => state.filter.filter);

    return (
        <div
            className='text-white w-full border-b border-gray-200 dark:border-gray-600 pb-4
        flex flex-col items-center justify-between gap-y-2 sm:flex-row sm:px-5'
        >
            <Breadcrumb_Component />

            {filterParamsFromRedux && totalProduct > 0 && (
                <span className='text-gray-600 dark:text-gray-200 font-semibold text-lg'>
                    Tìm được {totalProduct} sản phẩm khớp với bộ lọc
                </span>
            )}

            <FilterSortPanel_Component />
        </div>
    );
}
