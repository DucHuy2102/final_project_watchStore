import { Breadcrumb_Component, FilterSortPanel_Component } from '../exportComponent';

export default function Nav_CardProduct() {
    return (
        <div
            className='text-white w-full 
        flex justify-between items-center px-5'
        >
            <Breadcrumb_Component />
            <FilterSortPanel_Component />
        </div>
    );
}
