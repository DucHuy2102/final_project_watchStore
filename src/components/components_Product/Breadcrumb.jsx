import { Breadcrumb as Bread } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

export default function Breadcrumb() {
    const products = useSelector((state) => state.product.allProducts);
    const { pathname } = useLocation();
    const { id } = useParams();
    const product = products?.find((product) => product.id === id);

    let display;
    if (pathname === '/products') {
        display = 'Sản phẩm';
    } else if (pathname.startsWith('/product-detail/')) {
        display = product?.productName;
    } else {
        display = 'Giỏ hàng';
    }

    return (
        <Bread>
            <Bread.Item className='py-3' href='/' icon={HiHome}>
                Trang chủ
            </Bread.Item>
            {pathname.startsWith('/product-detail/') && (
                <Bread.Item className='text-base' href='/products'>
                    Sản phẩm
                </Bread.Item>
            )}
            <Bread.Item className='text-base' href='/products'>
                {display}
            </Bread.Item>
        </Bread>
    );
}
