import { Button, Modal } from 'flowbite-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CiWarning } from 'react-icons/ci';
import { FaMinus, FaPlus } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { changeProductQuantity, deleteProductFromCart } from '../../redux/slices/cartSlice';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { DeliveryTo_Component, Vouchers_Component } from '../../components/exportComponent';
import { setProductToCheckout } from '../../redux/slices/checkoutSlice';
import { FiMinus } from 'react-icons/fi';

// format price to VND
const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function DashboardCart() {
    // ================================================ Get data from redux store ================================================
    const tokenUser = useSelector((state) => state.user.access_token);
    const totalQuantity = useSelector((state) => state.cart.cartTotalQuantity);
    const totalPrice = useSelector((state) => state.cart.cartTotalAmount);
    const productCartItem = useSelector((state) => state.cart.cartItem);

    // get product info from productCartItem
    const infoProduct = useMemo(() => {
        return productCartItem.map((item) => item.productItem);
    }, [productCartItem]);

    // calculate total discount price of all product in cart
    const totalDiscountPrice = useMemo(() => {
        return infoProduct.reduce((total, item) => {
            const qualityProduct = productCartItem.find(
                (product) => product.idProduct === item.id
            ).quantity;
            return total + item.discount * qualityProduct;
        }, 0);
    }, [infoProduct, productCartItem]);

    // calculate total price of all product in cart
    const totalAmountToPay = useMemo(() => {
        return totalPrice - totalDiscountPrice;
    }, [totalPrice, totalDiscountPrice]);

    // ================================================ State ================================================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false);
    const [idProductToDelete, setIdProductToDelete] = useState(null);
    const [selectedVoucher, setSelectedVoucher] = useState('');
    const { pathname } = useLocation();

    // call API update cart when change quantity
    const updateCartApiCall = async (updateCartItem) => {
        if (!tokenUser) {
            console.log('Token user is null');
            return;
        }
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/cart/update-cart`,
                updateCartItem,
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    // debounce update cart after 500ms when change quantity
    const debouncedUpdateCart = useRef(
        debounce((updatedCartItem) => {
            updateCartApiCall(updatedCartItem);
        }, 500)
    ).current;

    // get product cart item to update cart
    // when unmount page or change quantity
    useEffect(() => {
        const updatedCartItem = productCartItem.map(({ idCart, quantity }) => ({
            itemId: idCart,
            quantity: quantity,
        }));
        if (tokenUser && updatedCartItem.length > 0) {
            debouncedUpdateCart(updatedCartItem);
        }
    }, [productCartItem, debouncedUpdateCart, tokenUser]);

    // when unmount page, cancel debounce
    useEffect(() => {
        return () => {
            debouncedUpdateCart.cancel();
        };
    }, [debouncedUpdateCart]);

    // handle change quantity
    const handleChangeQuantity = useCallback(
        (type, productId) => {
            if (tokenUser) {
                dispatch(changeProductQuantity({ type, productId }));
            }
        },
        [dispatch, tokenUser]
    );

    // handle delete product from cart
    const handleDeleteProductFromCart = () => {
        if (tokenUser) {
            dispatch(deleteProductFromCart(idProductToDelete));
        }
        setShowModalDeleteProduct(false);
    };

    // function navigate to login page
    const handleNavigateToLoginPage = () => {
        navigate('/login', { state: { from: pathname } });
    };

    // ================================================ Checkout product ================================================
    // function navigate to checkout page
    const handleNavigateToCheckoutPage = () => {
        dispatch(
            setProductToCheckout({
                productItems: productCartItem,
                totalPrice: totalPrice,
                totalDiscountPrice: totalDiscountPrice,
                totalAmountToPay: totalAmountToPay,
                totalQuantity: totalQuantity,
                isBuyNow: false,
            })
        );
        navigate('/checkout');
    };

    return (
        <div className='mx-auto px-4 py-4'>
            {totalQuantity === 0 ? (
                <div className='h-[85vh] flex flex-col items-center justify-center gap-y-6'>
                    <span className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
                        Đẳng Cấp Thời Gian, Giá Trị Vượt Trội
                    </span>
                    <img
                        src={'../public/assets/cartEmpty.jpg'}
                        alt='High-quality watch'
                        className='w-auto h-80 object-contain rounded-lg shadow-sm'
                    />
                    {tokenUser ? (
                        <>
                            <span className='text-2xl font-bold'>Giỏ hàng trống</span>
                            <span className='text-xl'>
                                Không có sản phẩm nào trong giỏ hàng của bạn
                            </span>
                            <div className='flex items-center justify-center gap-x-5'>
                                <Link to='/products'>
                                    <Button className='w-96'>Tiếp tục mua hàng</Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className='font-semibold text-lg'>
                                Vui lòng đăng nhập để xem giỏ hàng của bạn
                            </span>
                            <div onClick={handleNavigateToLoginPage}>
                                <Button className='w-96'>Đăng nhập</Button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className='flex flex-col lg:flex-row gap-x-4'>
                    {/* Product Table Section */}
                    <div className='lg:w-3/4 w-full dark:bg-gray-800 rounded-lg'>
                        <div
                            className='border border-gray-200 dark:border-none shadow-gray-100 dark:shadow-gray-800/50 
                        p-6 overflow-x-auto rounded-lg shadow-sm'
                        >
                            <table className='w-full'>
                                <thead>
                                    <tr className='border-b border-gray-200 dark:border-gray-700'>
                                        <th className='text-left font-semibold pb-5'>
                                            Tất cả{' '}
                                            <span className='text-blue-600 font-bold'>
                                                {productCartItem?.length}
                                            </span>{' '}
                                            sản phẩm
                                        </th>
                                        <th className='font-semibold text-center pb-5'>
                                            Trạng thái
                                        </th>
                                        <th className='font-semibold text-center pb-5'>Màu sắc</th>
                                        <th className='font-semibold text-center pb-5'>
                                            Đơn giá (VNĐ)
                                        </th>
                                        <th className='font-semibold text-center pb-5'>Số lượng</th>
                                        <th className='font-semibold text-center pb-5'>
                                            Thành tiền (VNĐ)
                                        </th>
                                        <th className='text-center flex justify-center items-center pt-1'>
                                            <MdDeleteOutline size={20} />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {infoProduct?.map((item, index) => {
                                        const currentSellPrice = item.price - item.discount;
                                        const qualityProduct = productCartItem.find(
                                            (product) => product.idProduct === item.id
                                        ).quantity;
                                        const totalPrice =
                                            (item.price - item.discount) * qualityProduct;
                                        return (
                                            <tr
                                                key={index}
                                                className={`${
                                                    index % 2 === 0
                                                        ? 'bg-gray-50 dark:bg-gray-800'
                                                        : ''
                                                } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer`}
                                            >
                                                <td className='py-5 w-1/3'>
                                                    <div
                                                        className='flex items-center cursor-pointer'
                                                        onClick={() =>
                                                            navigate(`/product-detail/${item.id}`)
                                                        }
                                                    >
                                                        <img
                                                            className='h-20 w-20 object-cover ml-4 mr-4 rounded-lg'
                                                            src={item.img[0]}
                                                            alt='Product image'
                                                        />
                                                        <span className='font-semibold line-clamp-2 hover:text-blue-600'>
                                                            {item.productName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='py-5 text-center'>
                                                    {item.condition}
                                                </td>
                                                <td className='py-5 text-center'>{item.color}</td>
                                                <td className='py-5 text-center'>
                                                    <div className='flex flex-col items-center justify-center gap-y-1'>
                                                        <span className='text-red-500 font-medium text-sm line-through'>
                                                            {formatPrice(item.price)}
                                                        </span>
                                                        <span className='text-blue-500 font-semibold text-lg'>
                                                            {formatPrice(currentSellPrice)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='py-5'>
                                                    <div className='flex items-center justify-center'>
                                                        <button
                                                            onClick={() =>
                                                                handleChangeQuantity(
                                                                    'decrease',
                                                                    item.id
                                                                )
                                                            }
                                                            className='hover:bg-blue-100 hover:text-blue-600 border rounded-l-lg 
                                                        text-md py-2 px-3 font-bold border-gray-300 transition-colors duration-200'
                                                        >
                                                            <FaMinus />
                                                        </button>

                                                        <span className='text-center w-10 py-1 border-t border-b border-gray-300'>
                                                            {qualityProduct}
                                                        </span>

                                                        <button
                                                            onClick={() =>
                                                                handleChangeQuantity(
                                                                    'increase',
                                                                    item.id
                                                                )
                                                            }
                                                            className='hover:bg-blue-100 hover:text-blue-600 border rounded-r-lg 
                                                        text-md py-2 px-3 font-bold border-gray-300 transition-colors duration-200'
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className='py-5 text-center text-blue-600 text-lg font-semibold'>
                                                    {formatPrice(totalPrice)}
                                                </td>
                                                <td className='py-5 text-center'>
                                                    <button
                                                        onClick={() => {
                                                            setIdProductToDelete(item.id);
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

                    {/* Summary & Vouchers Section */}
                    <div className='lg:w-1/4 w-full flex flex-col items-center gap-y-5'>
                        <DeliveryTo_Component />
                        {/* <Vouchers_Component onSelectVoucher={setSelectedVoucher} /> */}
                        <div className='w-full shadow-sm border border-gray-200 dark:border-none dark:bg-gray-800 rounded-lg p-6'>
                            <div className='flex justify-between mb-2 text-md font-medium'>
                                <span>Tạm tính</span>
                                <span className='text-red-500 font-semibold'>
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            <div className='flex justify-between mb-2 text-md'>
                                <span>Giảm giá từ Deal</span>
                                <div className='text-green-500 font-medium flex justify-center items-center gap-x-1'>
                                    <FiMinus />
                                    <span>{formatPrice(totalDiscountPrice)}</span>
                                </div>
                            </div>

                            <div className='my-2 h-[1px] bg-gray-300 dark:bg-gray-500' />

                            <div className='flex justify-between mb-3 text-xl font-semibold'>
                                <span>Tổng tiền</span>
                                <span className='text-blue-500 font-semibold'>
                                    {formatPrice(totalAmountToPay)}
                                </span>
                            </div>

                            <button
                                onClick={handleNavigateToCheckoutPage}
                                type='button'
                                className='group inline-flex w-full items-center justify-center rounded-md 
                            bg-gray-700 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-500
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
                                <p className='ml-2'>Thanh toán an toàn với các phương thức:</p>

                                <div className='flex items-center justify-center gap-3'>
                                    <img
                                        className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                        src='https://www.material-tailwind.com/image/logos/visa.svg'
                                        alt='Visa'
                                    />
                                    <img
                                        className='rounded-sm w-10 h-7 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                        src='https://www.material-tailwind.com/image/logos/master-card.png'
                                        alt='MasterCard'
                                    />
                                    <img
                                        className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                        src='https://www.material-tailwind.com/image/logos/american-express-logo.svg'
                                        alt='American Express'
                                    />
                                    <img
                                        className='rounded-sm w-10 h-10 object-cover cursor-pointer transform hover:scale-110 transition-transform duration-300'
                                        src='https://www.material-tailwind.com/image/logos/paypal.png'
                                        alt='PayPal'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
