import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useSearchParams } from 'react-router-dom';
import { FilterSortPanel, ProductCard } from './components/exportCom_Product';
import { Breadcrumb_Component, Pagination_Component } from '../../components/exportComponent';

export default function DashboardProduct() {
    // states
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        const getFilterParams = () => {
            const filterParams = new URLSearchParams();
            searchParams.forEach((value, key) => {
                if (value && key !== 'sortBy' && key !== 'pageNum') {
                    filterParams.set(key, value);
                }
            });
            return new URLSearchParams(filterParams).toString();
        };

        const getProducts = async () => {
            setLoading(true);
            try {
                const filterParams = getFilterParams();
                const sortBy = searchParams.get('sortBy');
                const pageNum = searchParams.get('pageNum') || '1';

                const res = await axios(
                    `${
                        import.meta.env.VITE_API_URL
                    }/client/get-all-product?${filterParams}&sortBy=${sortBy}&pageNum=${pageNum}`,
                );
                if (res?.status === 200) {
                    setProducts(res.data.productResponses);
                    setTotalPages(res.data.totalPages);
                    setTotalProducts(res.data.totalProducts);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [searchParams, setSearchParams]);

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
            <div
                className='text-white w-full 
        flex flex-col items-center justify-between gap-y-2 sm:flex-row sm:px-5'
            >
                <div className='flex justify-start w-full sm:w-auto'>
                    <Breadcrumb_Component displayName={'Sản phẩm'} />
                </div>

                {searchParams.size !== 0 && totalProducts > 0 ? (
                    <span className='text-gray-600 dark:text-gray-200 font-semibold text-lg text-center w-full sm:w-auto'>
                        Tìm được <span className='text-teal-500 font-bold'>{totalProducts}</span> sản phẩm khớp với bộ
                        lọc
                    </span>
                ) : (
                    <span className='text-gray-600 dark:text-gray-200 font-semibold text-lg text-center w-full sm:w-auto'>
                        Tất cả <span className='text-blue-500 font-bold'>{totalProducts}</span> sản phẩm
                    </span>
                )}

                <FilterSortPanel />
            </div>

            {products?.length > 0 ? (
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-x-4 
            lg:grid-cols-3 lg:gap-x-3 xl:grid-cols-3 xl:gap-x-2
            my-5 gap-y-8 justify-items-center'
                >
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='w-full flex flex-col justify-center items-center'>
                    <img src={'../assets/productNoFound.jpg'} alt='' className='h-96 w-auto object-cover' />
                    <p className='text-gray-400 text-lg text-center font-semibold'>Hiện tại không có sản phẩm nào</p>
                    <p className='text-gray-400 text-lg text-center font-semibold'>
                        Vui lòng thử lại sau hoặc thay đổi bộ lọc
                    </p>
                </div>
            )}

            {products && <Pagination_Component totalPages={totalPages} totalProduct={products?.length} />}
        </div>
    );
}
