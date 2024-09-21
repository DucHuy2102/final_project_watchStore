import { Breadcrumb as Bread } from 'flowbite-react';
import { HiHome } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';

// format data products
const formatData = (data) => {
    let allProducts = [];
    data?.forEach((item) => {
        allProducts = allProducts.concat(item.products);
    });
    return allProducts;
};

export default function Breadcrumb() {
    const products = formatData(useSelector((state) => state.product.allProducts));
    const { pathname } = useLocation();
    const { id } = useParams();
    const product = products.find((product) => product.id === id);

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
