import { ConfigProvider, Pagination as PaginationANTD } from 'antd';
import { useSelector } from 'react-redux';

export default function Pagination({ totalProducts, productPerPage, setCurrentPageValue }) {
    const theme = useSelector((state) => state.theme.theme);

    const handlePageChange = (page) => {
        setCurrentPageValue(page);
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: theme === 'light' ? 'rgb(250 247 248)' : 'rgb(31 41 55)',
                    colorPrimary: theme === 'light' ? 'rgb(31 41 55)' : 'rgb(250 247 248)',
                },
            }}
        >
            <PaginationANTD
                align='center'
                className='text-md'
                defaultCurrent={1}
                total={totalProducts}
                pageSize={productPerPage}
                onChange={handlePageChange}
            />
        </ConfigProvider>
    );
}
