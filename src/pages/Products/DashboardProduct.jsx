import { useSelector } from 'react-redux';
import {
    Navbar_CardProduct_Component,
    Pagination_Component,
    ProductCard_Component,
} from '../../components/exportComponent';
import { useMemo, useState } from 'react';

// format data products
const formatData = (data) => {
    let allProducts = [];
    data.forEach((item) => {
        allProducts = allProducts.concat(item.products);
    });
    return allProducts;
};

export default function DashboardProduct() {
    // get data products from redux
    const products_Redux = useSelector((state) => state.product.product);
    const products = formatData(products_Redux);

    // Pagination state and function to handle pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(12);
    const lastProductIndex = currentPage * productPerPage;
    const firstProductIndex = lastProductIndex - productPerPage;

    // Get products to display on page
    const displayData = useMemo(() => {
        return Array.isArray(products) ? products.slice(firstProductIndex, lastProductIndex) : [];
    }, [products, firstProductIndex, lastProductIndex]);

    return (
        <div className='min-h-screen p-5 w-full'>
            <Navbar_CardProduct_Component />

            <div
                className='grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-x-4 
            lg:grid-cols-3 lg:gap-x-3 xl:grid-cols-3 xl:gap-x-2
            my-10 gap-y-8 justify-items-center'
            >
                {displayData.map((product) => (
                    <ProductCard_Component key={product.id} product={product} />
                ))}
            </div>

            <Pagination_Component
                totalProducts={products.length}
                productPerPage={productPerPage}
                setCurrentPageValue={setCurrentPage}
            />
        </div>
    );
}
