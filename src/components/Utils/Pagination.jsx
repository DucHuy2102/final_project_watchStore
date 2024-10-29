import React from 'react';
import { Button } from 'flowbite-react';
import { useSearchParams } from 'react-router-dom';

export default function Pagination({ totalPages, totalProduct }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('pageNum')) || 1;

    const handlePageChange = (page) => {
        searchParams.set('pageNum', page);
        setSearchParams(searchParams);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            {totalProduct > 0 && (
                <div className='flex flex-wrap justify-center items-center gap-2 mt-4'>
                    <Button
                        color='gray'
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Trang trước
                    </Button>

                    {pageNumbers.map((number) => (
                        <Button
                            key={number}
                            color={currentPage === number ? 'blue' : 'gray'}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Button>
                    ))}

                    <Button
                        color='gray'
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Trang sau
                    </Button>
                </div>
            )}
        </>
    );
}
