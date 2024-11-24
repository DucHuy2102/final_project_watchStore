import { Image } from 'antd';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// eslint-disable-next-line react-refresh/only-export-components
const DiscountBadge = ({ discount }) => (
    <span className='absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg'>
        -{discount}%
    </span>
);

// eslint-disable-next-line react-refresh/only-export-components
const PriceDisplay = ({ originalPrice, discountedPrice }) => (
    <div className='text-right'>
        {originalPrice !== discountedPrice && (
            <span className='block text-sm text-red-500 line-through dark:text-gray-400'>
                {formatPrice(originalPrice)}
            </span>
        )}
        <span className='font-semibold text-lg text-blue-600 dark:text-blue-400'>{formatPrice(discountedPrice)}</span>
    </div>
);

export default function ProductInfo_CheckoutPage({ dataProduct }) {
    const navigate = useNavigate();

    const { productItem, quantity, selectedOption } = dataProduct;
    const price = selectedOption?.price || productItem.price;
    const discount = selectedOption?.discount || productItem.discount;
    const discountedPrice = price - discount;
    const discountPercentage = Math.round((discount / price) * 100);
    const sizeProduct =
        productItem.height === productItem.width
            ? ` ${productItem.height} mm`
            : `${productItem.height} x ${productItem.width} mm`;

    const idProduct = useMemo(() => {
        return dataProduct.idProduct ? dataProduct.idProduct : productItem.id;
    }, [dataProduct.idProduct, productItem.id]);

    return (
        <div className='cursor-pointer relative flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all hover:shadow-md'>
            {discountPercentage > 0 && <DiscountBadge discount={discountPercentage} />}
            <Image
                src={productItem.img[0]}
                alt={productItem.productName}
                className='!w-20 !h-auto object-cover'
                preview={{
                    mask: <div className='text-xs font-medium'>Xem</div>,
                }}
            />

            <div className='flex-grow'>
                <h3
                    onClick={() => navigate(`/product-detail/${idProduct}`)}
                    className='font-semibold text-lg text-gray-800 hover:text-blue-500 transition-colors duration-200 dark:text-gray-200 mb-2 min-w-0 truncate'
                >
                    {productItem.productName}
                </h3>

                <div className='flex flex-wrap gap-2 mb-2'>
                    <span className='text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full'>
                        {selectedOption?.color || productItem.color}
                    </span>
                    <span className='text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full'>
                        Size: {sizeProduct}
                    </span>
                </div>
                <div className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    Số lượng: <span className='text-red-500 font-bold'>{quantity}</span>
                </div>
            </div>

            <PriceDisplay originalPrice={price} discountedPrice={discountedPrice} />
        </div>
    );
}
