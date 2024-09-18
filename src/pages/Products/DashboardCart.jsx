import { Button, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { CiWarning } from 'react-icons/ci';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { GiCardKingClubs, GiShoppingCart } from 'react-icons/gi';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    changeProductQuantity,
    deleteProductFromCart,
    updateCartTotalQuantity,
} from '../../redux/slices/cartSlice';

// format price to VND
const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// format data products
const formatData = (data) => {
    let allProducts = [];
    data?.forEach((item) => {
        allProducts = allProducts.concat(item.products);
    });
    return allProducts;
};

export default function DashboardCart() {
    const tokenUser = useSelector((state) => state.user.access_token);
    const products_From_Redux = useSelector((state) => state.product.allProducts);
    const allProducts = formatData(products_From_Redux);
    const totalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
    const productCartItem = useSelector((state) => state.cart.cartItem);
    const idProduct = productCartItem.map((item) => item.idProduct);
    const productItem = allProducts.filter((item) => idProduct.includes(item.id));
    console.log(productCartItem);

    // state
    const dispatch = useDispatch();
    const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    useEffect(() => {
        dispatch(updateCartTotalQuantity(0));
        return () => {
            dispatch(updateCartTotalQuantity(productItem.length));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // handle change quantity
    const handleChangeQuantity = (type, productId) => {
        dispatch(changeProductQuantity({ type, productId }));
    };

    // handle delete product from cart
    const handleDeleteProductFromCart = () => {
        dispatch(deleteProductFromCart(productToDelete));
        setShowModalDeleteProduct(false);
    };

    return (
        <div className='min-h-screen py-8'>
            <div className='mx-auto px-4'>
                {totalQuantity === 0 ? (
                    <div className='w-full mt-[15vh] flex flex-col items-center justify-center gap-y-3'>
                        <GiShoppingCart size={200} className='text-[#0E7490]' />
                        <span className='text-2xl font-bold'>Giỏ hàng trống</span>
                        <span className='text-xl'>
                            Không có sản phẩm nào trong giỏ hàng của bạn
                        </span>
                        <Link to='/products' className='w-full'>
                            <Button className='w-auto mx-auto'>Tiếp tục mua hàng</Button>
                        </Link>
                    </div>
                ) : (
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='md:w-3/4'>
                            <div className='rounded-lg shadow-md dark:shadow-gray-800 p-6 mb-4'>
                                <table className='w-full'>
                                    <thead>
                                        <tr>
                                            <th className='text-left font-semibold'>
                                                Tất cả {productItem.length} sản phẩm
                                            </th>
                                            <th className='font-semibold text-center'>
                                                Đơn giá (VNĐ)
                                            </th>
                                            <th className='font-semibold text-center'>Số lượng</th>
                                            <th className='text-center font-semibold'>
                                                Thành tiền (VNĐ)
                                            </th>
                                            <th className='text-center pl-2'>
                                                <MdDeleteOutline size={20} />
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {productItem?.map((item) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td className='py-4'>
                                                        <div className='flex items-center'>
                                                            <img
                                                                className='h-16 w-16 mr-4'
                                                                src={item.img[0]}
                                                                alt='Product image'
                                                            />

                                                            <span className='w-80 font-semibold'>
                                                                {item.productName}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className='py-4 text-center'>
                                                        {formatPrice(item.price)}
                                                    </td>

                                                    <td className='py-4'>
                                                        <div className='flex items-center justify-center'>
                                                            <button
                                                                onClick={() =>
                                                                    handleChangeQuantity(
                                                                        'decrease',
                                                                        item.id
                                                                    )
                                                                }
                                                                className='hover:bg-gray-100 hover:text-blue-500 border rounded-lg 
                                                            text-md py-2 px-2 mr-2 font-bold border-gray-400'
                                                            >
                                                                <FaMinus />
                                                            </button>

                                                            <span className='text-center w-8'>
                                                                {
                                                                    productCartItem.find(
                                                                        (product) =>
                                                                            product.idProduct ===
                                                                            item.id
                                                                    ).quantity
                                                                }
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    handleChangeQuantity(
                                                                        'increase',
                                                                        item.id
                                                                    )
                                                                }
                                                                className='hover:bg-gray-100 hover:text-blue-500 border rounded-lg 
                                                            text-md py-2 px-2 ml-2 font-bold border-gray-400'
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className='py-4 text-center'>
                                                        {formatPrice(
                                                            item.price *
                                                                productCartItem.find(
                                                                    (product) =>
                                                                        product.idProduct ===
                                                                        item.id
                                                                ).quantity
                                                        )}
                                                    </td>

                                                    <td className='pt-2 text-center'>
                                                        <button
                                                            onClick={() => {
                                                                setProductToDelete(item.id);
                                                                setShowModalDeleteProduct(true);
                                                            }}
                                                        >
                                                            <MdDeleteOutline size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>

                                    <Modal show={showModalDeleteProduct} size='lg' popup>
                                        <Modal.Body className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                                            <CiWarning size='70px' color={'red'} />
                                            <span className='text-lg font-medium text-black'>
                                                Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?
                                            </span>
                                            <div className='w-full flex justify-between items-center gap-x-5'>
                                                <Button
                                                    outline
                                                    className='w-full'
                                                    onClick={() => setShowModalDeleteProduct(false)}
                                                >
                                                    Hủy
                                                </Button>
                                                <Button
                                                    className='w-full'
                                                    onClick={handleDeleteProductFromCart}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
                                </table>
                            </div>
                        </div>

                        <div className='md:w-1/4'>
                            <div className='shadow-md dark:bg-gray-800 rounded-lg p-6'>
                                <h2 className='text-lg font-semibold mb-4'>Thành tiền</h2>

                                <div className='flex justify-between mb-2'>
                                    <span>Tạm tính</span>
                                    <span>{'priceFormat(totalPrice)'}</span>
                                </div>

                                <div className='flex justify-between mb-2'>
                                    <span>Phí vận chuyển</span>
                                    <span>0 ₫</span>
                                </div>

                                <hr className='my-2' />
                                <div className='flex justify-between mb-2'>
                                    <span className='text-lg font-semibold'>Tổng tiền</span>
                                    <span className='text-lg font-semibold'>
                                        {'priceFormat(totalPrice)'}
                                    </span>
                                </div>

                                <button
                                    type='button'
                                    className='group inline-flex w-full items-center justify-center rounded-md 
                                bg-gray-700 dark:bg-gray-700 hover:bg-blue-500
                                px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow'
                                >
                                    Mua hàng
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        className='group-hover:ml-8 ml-4 h-6 w-6 transition-all'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        stroke='currentColor'
                                        strokeWidth='2'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M13 7l5 5m0 0l-5 5m5-5H6'
                                        />
                                    </svg>
                                </button>

                                <div className='flex flex-col items-center justify-center mt-3'>
                                    <div className='flex items-center justify-center'>
                                        <p className='ml-2'>
                                            Thanh toán an toàn với các phương thức:
                                        </p>
                                    </div>

                                    <div className='flex items-center justify-center gap-3'>
                                        <img
                                            className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                            src='https://www.material-tailwind.com/image/logos/visa.svg'
                                            alt=''
                                        />
                                        <img
                                            className='rounded-sm w-10 h-7 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                            src='https://www.material-tailwind.com/image/logos/master-card.png'
                                            alt=''
                                        />
                                        <img
                                            className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                            src='https://www.material-tailwind.com/image/logos/american-express-logo.svg'
                                            alt=''
                                        />
                                        <img
                                            className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                            src='https://www.material-tailwind.com/image/logos/paypal.png'
                                            alt=''
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
