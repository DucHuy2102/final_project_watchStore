import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { Button, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { FilterModal, Pagination, ProductCard } from './components/exportCom_Product';
import { Breadcrumb_Component } from '../../components/exportComponent';
import { FaFilter } from 'react-icons/fa';

const SORT_OPTIONS = [
    { value: 'gia-tang-dan', label: 'Giá tăng dần', icon: '↑' },
    { value: 'gia-giam-dan', label: 'Giá giảm dần', icon: '↓' },
    { value: 'a-z', label: 'Từ A - Z', icon: 'A' },
    { value: 'z-a', label: 'Từ Z - A', icon: 'Z' },
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
                    { key: 'gender', value: 'Thiếu nhi', label: 'Đồng hồ thiếu nhi' },
                    { key: 'gender', value: 'Tất cả', label: 'Tất cả đối tượng' },
                ],
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
                    { key: 'shape', value: 'Đồng hồ mặt tròn', label: 'Đồng hồ mặt tròn' },
                    { key: 'shape', value: 'Đồng hồ mặt vuông', label: 'Đồng hồ mặt vuông' },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt chữ nhật',
                        label: 'Đồng hồ mặt chữ nhật',
                    },
                    {
                        key: 'shape ',
                        value: 'Đồng hồ mặt tam giác',
                        label: 'Đồng hồ mặt tam giác',
                    },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt bầu dục',
                        label: 'Đồng hồ mặt bầu dục',
                    },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt Tonneau',
                        label: 'Đồng hồ mặt Tonneau',
                    },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt Carage',
                        label: 'Đồng hồ mặt Carage',
                    },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt Cushion',
                        label: 'Đồng hồ mặt Cushion',
                    },
                    {
                        key: 'shape',
                        value: 'Đồng hồ mặt bát giác',
                        label: 'Đồng hồ mặt bát giác',
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
                    if (!filterGroups[filter.key]) {
                        filterGroups[filter.key] = new Set();
                    }
                    filterGroups[filter.key].add(filter.value.trim());
                }
            });

            Object.entries(filterGroups).forEach(([key, values]) => {
                const valuesArray = Array.from(values);
                if (valuesArray.length > 0) {
                    newSearchParams.set(key, valuesArray.join(','));
                }
            });

            searchParams.forEach((value, key) => {
                if (key !== 'pageNum' && !FILTER_OPTIONS.some((option) => option.choices[0].key === key)) {
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

                <div className='w-full sm:w-auto flex items-center justify-center gap-x-2'>
                    <Select
                        placeholder='Sắp xếp theo'
                        options={SORT_OPTIONS}
                        onChange={handleSortChange}
                        className='w-[180px] h-11'
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

            {totalPages > 1 && <Pagination totalProduct={totalProducts} />}
        </div>
    );
}
