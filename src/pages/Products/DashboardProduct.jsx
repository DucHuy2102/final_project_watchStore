import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { Button, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { FilterModal, Pagination, ProductCard } from './components/exportCom_Product';
import { Breadcrumb_Component } from '../../components/exportComponent';
import { FaFilter, FaEye } from 'react-icons/fa';
import DashCompare from './components/Compare/DashCompare';

const SORT_OPTIONS = [
    { value: 'topView', label: 'Xem nhiều', icon: <FaEye /> },
    { value: 'gia-tang-dan', label: 'Giá tăng dần', icon: '↑' },
    { value: 'gia-giam-dan', label: 'Giá giảm dần', icon: '↓' },
    { value: 'a-z', label: 'Từ A - Z', icon: 'A' },
    { value: 'z-a', label: 'Từ Z - A', icon: 'Z' },
];

const PRICE_RANGES = [
    { key: 'price', value: '0-1000000', label: 'Dưới 1 triệu' },
    { key: 'price', value: '1000000-3000000', label: '1 - 3 triệu' },
    { key: 'price', value: '3000000-5000000', label: '3 - 5 triệu' },
    { key: 'price', value: '5000000-10000000', label: '5 - 10 triệu' },
    { key: 'price', value: '10000000-999999999', label: 'Trên 10 triệu' },
    { key: 'price', value: '20000000-9999999999', label: 'Trên 20 triệu' },
];

export default function DashboardProduct() {
    // states
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showModalFilter, setShowModalFilter] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [wireMaterial, setWireMaterial] = useState([]);
    const [waterProof, setWaterProof] = useState([]);

    const getAllProduct = async () => {
        try {
            setLoading(true);
            const filterParams = Array.from(searchParams.entries())
                .filter(([key]) => key !== 'pageNum')
                .map(([key, value]) => `${key}=${value}`)
                .join('&');

            const pageNum = searchParams.get('pageNum') || '1';

            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/client/get-all-product${
                    filterParams ? `?${filterParams}&pageNum=${pageNum}` : `?pageNum=${pageNum}`
                }`,
            );
            if (res.status === 200) {
                const { data } = res;
                console.log(data);
                setProducts(data.productResponses);
                setTotalPages(data.totalPages);
                setTotalProducts(data.totalProducts);
                setWaterProof(data.waterProof);
                setWireMaterial(data.wireMaterial);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllProduct();
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    const FILTER_OPTIONS = useMemo(
        () => [
            {
                title: 'Đối tượng',
                choices: [
                    { key: 'gender', value: 'Nữ', label: 'Đồng hồ nữ' },
                    { key: 'gender', value: 'Nam', label: 'Đồng hồ nam' },
                ],
            },
            {
                title: 'Khoảng giá',
                choices: PRICE_RANGES,
            },
            {
                title: 'Chất liệu dây',
                choices: wireMaterial?.map((wireMaterial) => ({
                    key: 'wireMaterial',
                    value: wireMaterial,
                    label: wireMaterial,
                })),
            },
            {
                title: 'Hình dáng mặt đồng hồ',
                choices: [
                    { key: 'shape', value: 'Mặt tròn', label: 'Mặt tròn' },
                    { key: 'shape', value: 'Mặt vuông', label: 'Mặt vuông' },
                    {
                        key: 'shape',
                        value: 'Mặt chữ nhật',
                        label: 'Mặt chữ nhật',
                    },
                    {
                        key: 'shape ',
                        value: 'Mặt tam giác',
                        label: 'Mặt tam giác',
                    },
                    {
                        key: 'shape',
                        value: 'Mặt bầu dục',
                        label: 'Mặt bầu dục',
                    },
                    {
                        key: 'shape',
                        value: 'Mặt Tonneau',
                        label: 'Mặt Tonneau',
                    },
                    {
                        key: 'shape',
                        value: 'Mặt Carage',
                        label: 'Mặt Carage',
                    },
                    {
                        key: 'shape',
                        value: 'Mặt Cushion',
                        label: 'Mặt Cushion',
                    },
                    {
                        key: 'shape',
                        value: 'Mặt bát giác',
                        label: 'Mặt bát giác',
                    },
                ],
            },
            {
                title: 'Kháng nước',
                choices: waterProof?.map((waterProof) => ({
                    key: 'waterProof',
                    value: waterProof,
                    label: `${waterProof} ATM`,
                })),
            },
        ],
        [waterProof, wireMaterial],
    );

    const handleSelectOptionFilter = useCallback(
        (choice) => {
            const isChoiceExist = selectedFilters.some(
                (item) => item.key === choice.key && item.value === choice.value,
            );
            if (isChoiceExist) {
                setSelectedFilters(
                    selectedFilters.filter((item) => item.key !== choice.key || item.value !== choice.value),
                );
            } else {
                setSelectedFilters([...selectedFilters, choice]);
            }
        },
        [selectedFilters],
    );

    const updateSearchParams = useCallback(
        (filters) => {
            const newSearchParams = new URLSearchParams();
            newSearchParams.set('pageNum', '1');

            const filterGroups = {};
            filters.forEach((filter) => {
                if (filter?.value.trim()) {
                    if (filter.key === 'price') {
                        const [min, max] = filter.value.split('-');
                        newSearchParams.set('minPrice', min);
                        newSearchParams.set('maxPrice', max);
                    } else {
                        if (!filterGroups[filter.key]) {
                            filterGroups[filter.key] = new Set();
                        }
                        filterGroups[filter.key].add(filter.value.trim());
                    }
                }
            });

            Object.entries(filterGroups).forEach(([key, values]) => {
                const valuesArray = Array.from(values);
                if (valuesArray.length > 0) {
                    newSearchParams.set(key, valuesArray.join(','));
                }
            });

            searchParams.forEach((value, key) => {
                if (
                    key !== 'pageNum' &&
                    key !== 'minPrice' &&
                    key !== 'maxPrice' &&
                    !FILTER_OPTIONS.some((option) => option.choices[0].key === key)
                ) {
                    newSearchParams.set(key, value);
                }
            });

            searchParams.forEach((value, key) => {
                if (key === 'q' && value.trim()) {
                    newSearchParams.set(key, value);
                }
            });

            setSearchParams(newSearchParams);
        },
        [FILTER_OPTIONS, searchParams, setSearchParams],
    );

    const handleSubmitFilter = (e) => {
        e.preventDefault();
        updateSearchParams(selectedFilters);
        setShowModalFilter(false);
    };

    const handleSortChange = (value) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (value) {
            newSearchParams.set('sortBy', value);
        } else {
            newSearchParams.delete('sortBy');
        }
        newSearchParams.set('pageNum', '1');
        setSearchParams(newSearchParams);
    };

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
            <div className='text-white w-full flex flex-col items-center justify-between gap-y-2 sm:flex-row sm:px-5'>
                <div className='w-full sm:w-auto'>
                    <Breadcrumb_Component displayName={'Sản phẩm'} />
                </div>

                {selectedFilters.length !== 0 ? (
                    <span className='text-gray-700 dark:text-gray-100 font-normal text-sm lg:text-xl pl-20 tracking-wide'>
                        <span className='text-blue-600 font-bold text-lg lg:text-2xl italic'>
                            {totalProducts.toLocaleString()}
                        </span>{' '}
                        sản phẩm phù hợp
                    </span>
                ) : (
                    <span className='text-gray-700 dark:text-gray-100 font-normal text-sm lg:text-xl pl-20 tracking-wide'>
                        Tổng cộng{' '}
                        <span className='text-blue-600 font-bold text-lg lg:text-2xl italic'>
                            {totalProducts.toLocaleString()}
                        </span>{' '}
                        sản phẩm
                    </span>
                )}

                <div className='w-full sm:w-auto flex items-center justify-center gap-x-2'>
                    <Select
                        placeholder='Sắp xếp theo'
                        options={SORT_OPTIONS}
                        onChange={handleSortChange}
                        className='w-[180px] h-11 custom-select'
                        popupClassName='custom-select-dropdown'
                        value={searchParams.get('sortBy')}
                        optionRender={(option) => (
                            <div className='flex items-center gap-3 px-1'>
                                <span className='text-blue-500 font-semibold'>{option.data.icon}</span>
                                <span>{option.data.label}</span>
                            </div>
                        )}
                        allowClear
                    />

                    <Button
                        onClick={() => setShowModalFilter(true)}
                        className={`h-11 px-5 flex items-center gap-2 border-2 ${
                            selectedFilters.length ? 'border-blue-500 text-blue-500' : ''
                        }`}
                    >
                        <FaFilter />
                        <span className='hidden sm:inline'>Bộ Lọc</span>
                        {selectedFilters.length > 0 && (
                            <span className='flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-500 text-white rounded-full'>
                                {selectedFilters.length}
                            </span>
                        )}
                    </Button>
                </div>

                <FilterModal
                    show={showModalFilter}
                    onClose={() => setShowModalFilter(false)}
                    options={FILTER_OPTIONS}
                    selectedFilters={selectedFilters}
                    onRemoveFilter={() => setSelectedFilters([])}
                    onSelect={handleSelectOptionFilter}
                    onSubmit={handleSubmitFilter}
                />
            </div>

            {products?.length > 0 ? (
                <div className='w-full mx-auto grid grid-cols-1 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 md:gap-x-4 2xl:grid-cols-4 2xl:gap-x-2 4xl:grid-cols-5 4xl:gap-x-2 my-5 gap-y-8 justify-items-center'>
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

            {totalPages > 1 && <Pagination totalProduct={totalProducts} />}
            <DashCompare />
        </div>
    );
}
