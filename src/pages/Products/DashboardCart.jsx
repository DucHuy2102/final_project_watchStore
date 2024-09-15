import { Button, Modal } from 'flowbite-react';
import { GiShoppingCart } from 'react-icons/gi';
import { MdDeleteOutline } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashboardCart() {
    const tokenUser = useSelector((state) => state.user.access_token);
    const amountProduct = 1;

    return (
        <div className='min-h-screen py-8'>
            <div className='mx-auto px-4'>
                {amountProduct === 0 ? (
                    // no product in cart
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
                    // have product in cart
                    <div className='flex flex-col md:flex-row gap-4'>
                        {/* product info */}
                        <div className='md:w-3/4'>
                            <div className='rounded-lg shadow-md dark:shadow-gray-800 p-6 mb-4'>
                                <table className='w-full'>
                                    {/* header table */}
                                    <thead>
                                        <tr>
                                            <th className='text-left font-semibold'>
                                                Tất cả ( {amountProduct} sản phẩm )
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

                                    {/* body product */}
                                    {/* <tbody>
                                        {orders.data.map((order, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className='py-4'>
                                                        <div className='flex items-center'>
                                                            <img
                                                                className='h-16 w-16 mr-4'
                                                                src={order.product.img[0]}
                                                                alt='Product image'
                                                            />

                                                            <span className='w-80 font-semibold'>
                                                                {order.product.productName}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className='py-4 text-center'>
                                                        {priceFormat(order.product.price)}
                                                    </td>

                                                    <td className='py-4'>
                                                        <div className='flex items-center justify-center'>
                                                            <button
                                                                onClick={() =>
                                                                    handleChangeQuantity(
                                                                        'decrease',
                                                                        order.product.id
                                                                    )
                                                                }
                                                                className='border rounded-md py-2 px-4 mr-2'
                                                            >
                                                                -
                                                            </button>

                                                            <span className='text-center w-8'>
                                                                {order.quantity}
                                                            </span>

                                                            <button
                                                                onClick={() =>
                                                                    handleChangeQuantity(
                                                                        'increase',
                                                                        order.product.id
                                                                    )
                                                                }
                                                                className='border rounded-md py-2 px-4 ml-2'
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>

                                                    <td className='py-4 text-center'>
                                                        {priceFormat(
                                                            order.product.price * order.quantity
                                                        )}
                                                    </td>

                                                    <td className='pt-2 text-center'>
                                                        <button onClick={() => showModal(order.id)}>
                                                            <RiDeleteBin6Line size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody> */}

                                    {/* modal delete product */}
                                    {/* <Modal
                                        title='Xác nhận xóa sản phẩm'
                                        okText='Xác nhận xóa'
                                        cancelText='Hủy bỏ'
                                        style={{ textAlign: 'center' }}
                                        open={isModalOpen}
                                        okButtonProps={{
                                            className:
                                                'bg-black text-white hover:bg-red-500 hover:text-white',
                                        }}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                    >
                                        <p className='text-lg'>
                                            Hành động này sẽ xóa sản phẩm khỏi giỏ hàng của bạn!
                                        </p>
                                    </Modal> */}
                                </table>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className='md:w-1/4'>
                            <div className='shadow-md dark:bg-gray-800 rounded-lg p-6'>
                                <h2 className='text-lg font-semibold mb-4'>Thành tiền</h2>

                                {/* total price */}
                                <div className='flex justify-between mb-2'>
                                    <span>Tạm tính</span>
                                    {/* <span>{priceFormat(totalPrice)}</span> */}
                                </div>

                                {/* shippingPrice */}
                                <div className='flex justify-between mb-2'>
                                    <span>Phí vận chuyển</span>
                                    <span>0 ₫</span>
                                </div>

                                <hr className='my-2' />
                                <div className='flex justify-between mb-2'>
                                    <span className='text-lg font-semibold'>Tổng tiền</span>
                                    {/* <span className='text-lg font-semibold'>
                                        {priceFormat(totalPrice)}
                                    </span> */}
                                </div>

                                {/* button checkout */}
                                {/* <Link to='/checkout' className='mt-6 text-center'> */}
                                <button
                                    // onClick={() => handleCheckout()}
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
                                {/* </Link> */}

                                {/* Secured Payment info */}
                                <div className='flex flex-col items-center justify-center mt-3'>
                                    <div className='flex items-center justify-center'>
                                        {/* <FontAwesomeIcon icon={faLock} /> */}
                                        <p className='ml-2'>
                                            Thanh toán an toàn với các phương thức:
                                        </p>
                                    </div>

                                    {/* Payment methods */}
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
