import { Pagination_Component, ProductCard_Component } from '../../components/exportComponent';

export default function DashboardProduct() {
    return (
        <div className='min-h-screen p-5'>
            {/* <Sort_Filter /> */}

            <div className='my-10 grid grid-cols-3 gap-x-4 gap-y-8 justify-items-center'>
                {/* <ProductCard products={displayData} /> */}
                <ProductCard_Component />
                <ProductCard_Component />
                <ProductCard_Component />
                <ProductCard_Component />
                <ProductCard_Component />
            </div>

            {/* <PaginationComponent
                totalProducts={dataToDisplay.length}
                productPerPage={productPerPage}
                setCurrentPageValue={setCurrentPage}
            /> */}
            <Pagination_Component />
        </div>
    );
}
