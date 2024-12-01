import { useSearchParams } from 'react-router-dom';
import { Pagination as AntPagination } from 'antd';
import { useEffect, useState } from 'react';

export default function Pagination({ totalProduct }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const page = parseInt(searchParams.get('pageNum')) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    const handlePageChange = (page) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('pageNum', page);
        setSearchParams(newSearchParams);
    };

    return (
        <div className='flex justify-center items-center my-8'>
            <AntPagination
                current={currentPage}
                total={totalProduct}
                pageSize={12}
                onChange={handlePageChange}
                showSizeChanger={false}
            />
        </div>
    );
}
