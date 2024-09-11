import { ConfigProvider, Pagination as PaginationANTD } from 'antd';
import { useSelector } from 'react-redux';

export default function Pagination() {
    const theme = useSelector((state) => state.theme.theme);

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorBgContainer: theme === 'light' ? 'rgb(250 247 248)' : 'rgb(31 41 55)',
                    colorPrimary: theme === 'light' ? 'rgb(31 41 55)' : 'rgb(250 247 248)',
                },
            }}
        >
            <PaginationANTD align='center' className='text-md' defaultCurrent={1} total={50} />
        </ConfigProvider>
    );
}
