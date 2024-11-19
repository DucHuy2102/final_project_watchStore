import { Breadcrumb as Bread } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { useParams } from 'react-router-dom';

export default function Breadcrumb({ displayName }) {
    const { id } = useParams();

    return (
        <Bread>
            <Bread.Item className='py-3' href='/' icon={HiHome}>
                Trang chủ
            </Bread.Item>
            {displayName === 'Sản phẩm' ? (
                <Bread.Item className='text-base' href='/products'>
                    {displayName}
                </Bread.Item>
            ) : (
                <>
                    <Bread.Item className='text-base' href='/products'>
                        Sản phẩm
                    </Bread.Item>
                    <Bread.Item className='text-base' href={`/product-detail/${id}`}>
                        {displayName}
                    </Bread.Item>
                </>
            )}
        </Bread>
    );
}
