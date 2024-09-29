import { useSelector } from 'react-redux';
import {
    Navbar_CardProduct_Component,
    Pagination_Component,
    ProductCard_Component,
} from '../../components/exportComponent';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function DashboardProduct() {
    // redux
    const sortValueFromRedux = useSelector((state) => state.filter.sort?.value);
    const filterParamsFromRedux = useSelector((state) => state.filter.filter);
    const searchValueFromRedux = useSelector((state) => state.filter.search);
    const currentPage = useSelector((state) => state.filter.page);

    // states
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);

    // pagination
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getProducts = async () => {
            window.scrollTo(0, 0, 'smooth');
            setLoading(true);
            try {
                const newSearchParams = new URLSearchParams();
                if (searchValueFromRedux) {
                    newSearchParams.set('q', searchValueFromRedux);
                }
                if (sortValueFromRedux) {
                    newSearchParams.set('sortBy', sortValueFromRedux);
                }
                if (filterParamsFromRedux && filterParamsFromRedux.length > 0) {
                    filterParamsFromRedux.forEach((param) => {
                        if (param.value) {
                            newSearchParams.set(param.key, param.value);
                        }
                    });
                }
                if (currentPage !== 1) {
                    newSearchParams.set('pageNum', currentPage);
                }
                setSearchParams(newSearchParams, {
                    replace: true,
                });
                const newSearchTerm = newSearchParams.toString();
                const res = await axios(
                    `${import.meta.env.VITE_API_URL}/client/get-all-product?${newSearchTerm}`
                );
                if (res?.status === 200) {
                    setProducts(res.data.productResponses);
                    setTotalPages(res.data.totalPages);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, [currentPage, filterParamsFromRedux, location.search, searchParams, searchValueFromRedux, setSearchParams, sortValueFromRedux]);

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
            <Navbar_CardProduct_Component totalProduct={products?.length} />

            {products?.length > 0 ? (
                <div
                    className='grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-x-4 
            lg:grid-cols-3 lg:gap-x-3 xl:grid-cols-3 xl:gap-x-2
            my-10 gap-y-8 justify-items-center'
                >
                    {products.map((product) => (
                        <ProductCard_Component key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className='w-full flex flex-col justify-center items-center'>
                    <img
                        src={'../public/assets/productNoFound.jpg'}
                        alt=''
                        className='h-96 w-auto object-cover'
                    />
                    <p className='text-gray-400 text-lg font-semibold'>
                        Không có sản phẩm nào phù hợp với yêu cầu của bạn
                    </p>
                </div>
            )}

            {products && (
                <Pagination_Component totalPages={totalPages} totalProduct={products?.length} />
            )}
        </div>
    );
}
