import { useSelector } from 'react-redux';
import {
    Navbar_CardProduct_Component,
    Pagination_Component,
    ProductCard_Component,
} from '../../components/exportComponent';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function DashboardProduct() {
    // const products = useSelector((state) => state.product.allProducts);

    // const [currentPage, setCurrentPage] = useState(1);
    // const [productPerPage] = useState(12);
    // const lastProductIndex = currentPage * productPerPage;
    // const firstProductIndex = lastProductIndex - productPerPage;

    // const displayData = useMemo(() => {
    //     return Array.isArray(products) ? products.slice(firstProductIndex, lastProductIndex) : [];
    // }, [products, firstProductIndex, lastProductIndex]);

    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const sortValueFromRedux = useSelector((state) => state.filter.sort);
    const filterParamsFromRedux = useSelector((state) => state.filter.filter);

    useEffect(() => {
        const getProducts = async () => {
            setLoading(true);
            try {
                if (sortValueFromRedux) {
                    searchParams.set('sortBy', sortValueFromRedux);
                }
                filterParamsFromRedux?.forEach((param) => {
                    if (param.value) {
                        searchParams.set(param.key, param.value);
                    }
                });
                const newSearchTerm = searchParams.toString();
                setSearchParams(searchParams, {
                    replace: true,
                });
                const res = await axios(
                    `${import.meta.env.VITE_API_URL}/client/get-all-product?${newSearchTerm}`
                );
                if (res?.status === 200) {
                    setProducts(res.data.productResponses);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [filterParamsFromRedux, location.search, searchParams, setSearchParams, sortValueFromRedux]);

    // loading
    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>
                        Hệ thống đang tải. Vui lòng chờ trong giây lát...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen p-5 w-full'>
            <Navbar_CardProduct_Component />

            <div
                className='grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-x-4 
            lg:grid-cols-3 lg:gap-x-3 xl:grid-cols-3 xl:gap-x-2
            my-10 gap-y-8 justify-items-center'
            >
                {products.map((product) => (
                    <ProductCard_Component key={product.id} product={product} />
                ))}
            </div>

            {/* <Pagination_Component
                totalProducts={products.length}
                productPerPage={productPerPage}
                setCurrentPageValue={setCurrentPage}
            /> */}
        </div>
    );
}
