import { Breadcrumb as Bread } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';

export default function Breadcrumb({ displayName }) {
    return (
        <Bread>
            <Bread.Item className='py-3' href='/' icon={HiHome}>
                Trang chủ
            </Bread.Item>
            <Bread.Item className='text-base' href='/products'>
                {displayName}
            </Bread.Item>
        </Bread>
    );
}
