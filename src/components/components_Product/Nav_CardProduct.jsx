import { Breadcrumb_Component, FilterSortPanel_Component } from '../exportComponent';

export default function Nav_CardProduct() {
    return (
        <div
            className='text-white w-full border-b border-gray-200 dark:border-gray-600 pb-4
        flex flex-col justify-between gap-y-2 sm:flex-row sm:px-5'
        >
            <Breadcrumb_Component />
            <FilterSortPanel_Component />
        </div>
    );
}
