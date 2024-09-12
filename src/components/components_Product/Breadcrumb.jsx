import { Breadcrumb as Bread } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function Breadcrumb() {
    return (
        <Bread>
            <Bread.Item className='py-3' icon={HiHome}>
                <Link
                    className='text-[#374151] dark:text-gray-400 dark:hover:text-white hover:text-black 
                    transition-colors duration-200'
                    to={'/'}
                >
                    Trang chủ
                </Link>
            </Bread.Item>
            <Bread.Item href='/products'>Sản phẩm</Bread.Item>
        </Bread>
    );
}
