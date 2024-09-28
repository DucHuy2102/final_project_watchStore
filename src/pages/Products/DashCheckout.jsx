import { Button, Label, Modal, Textarea, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { DeliveryTo_Component, Vouchers_Component } from '../../components/exportComponent';
import { FaTimes } from 'react-icons/fa';
import { RiSave3Fill } from 'react-icons/ri';

// format data products
const formatData = (data) => {
    let allProducts = [];
    data?.forEach((item) => {
        allProducts = allProducts.concat(item.products);
    });
    return allProducts;
};

export default function DashCheckout() {
    // redux
    const tokenUser = useSelector((state) => state.user.access_token);
    const currentUser = useSelector((state) => state.user.user);

    // state
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isEditting, setIsEditting] = useState(false);
    const [showModalEditAddress, setShowModalEditAddress] = useState(false);
    const [formData, setFormData] = useState({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
    });
    const [formModal, setFormModal] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleEditAddress = () => {
        setFormData({
            fullName: formModal.fullName,
            email: formModal.email,
            phone: formModal.phone,
            address: formModal.address,
        });
        setShowModalEditAddress(false);
    };

    const handleUpdateInfo = async () => {};

    const handleSubmitForm = async () => {};

    const handleCheckout = async () => {};

    return (
        <div className='mx-auto min-h-screen py-8 px-4'>
            {/* <h1 className='text-3xl text-center font-bold'>Thanh toán đơn hàng</h1> */}

            <div className='lg:flex justify-between gap-2'>
                <div className='lg:w-3/4'>
                    <div className='shadow-md rounded-lg mb-4'>
                        <div className='px-6 py-4'>
                            <div className='flex items-center justify-between mb-5'>
                                <h4 className='text-xl font-semibold mb-5'>Thông tin cá nhân</h4>
                                <div className='flex items-center justify-between gap-x-2'>
                                    {!isEditting && (
                                        <>
                                            <Button onClick={() => setIsEditting(true)} outline>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <CiEdit />
                                                    <span>Chỉnh sửa</span>
                                                </div>
                                            </Button>
                                            <Button
                                                onClick={() => setShowModalEditAddress(true)}
                                                outline
                                            >
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <CiEdit />
                                                    <span>Gửi đến địa chỉ khác</span>
                                                </div>
                                            </Button>
                                            <Modal
                                                show={showModalEditAddress}
                                                onClose={() => setShowModalEditAddress(false)}
                                                size='md'
                                                popup
                                            >
                                                <Modal.Body>
                                                    <div className='w-full flex flex-col justify-center items-center gap-y-3 px-5'>
                                                        <div className='mt-5 w-full flex flex-col justify-center items-center'>
                                                            <span className='text-xl font-semibold'>
                                                                Cập nhật thông tin mới
                                                            </span>
                                                            <span className='text-sm text-gray-400'>
                                                                Điền thông tin địa chỉ nhận hàng của
                                                                bạn
                                                            </span>
                                                        </div>
                                                        <div className='w-full'>
                                                            <Label
                                                                htmlFor='fullName'
                                                                value='Họ và tên'
                                                                className='text-gray-700 font-semibold'
                                                            />
                                                            <TextInput
                                                                type='text'
                                                                id='fullName'
                                                                className='mt-2'
                                                                placeholder='Nguyễn Văn A'
                                                                value={formModal.fullName}
                                                                onChange={(e) =>
                                                                    setFormModal({
                                                                        ...formModal,
                                                                        fullName: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>

                                                        <div className='w-full'>
                                                            <Label
                                                                htmlFor='email1'
                                                                value='Địa chỉ email'
                                                                className='text-gray-700 font-semibold'
                                                            />
                                                            <TextInput
                                                                id='email1'
                                                                type='email'
                                                                className='mt-2'
                                                                placeholder='email@gmail.com'
                                                                value={formModal.email}
                                                                onChange={(e) =>
                                                                    setFormModal({
                                                                        ...formModal,
                                                                        email: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>

                                                        <div className='w-full'>
                                                            <Label
                                                                htmlFor='phone'
                                                                value='Số điện thoại'
                                                                className='text-gray-700 font-semibold'
                                                            />
                                                            <TextInput
                                                                id='phone'
                                                                type='text'
                                                                className='mt-2'
                                                                placeholder='(+84) 123 456 789'
                                                                value={formModal.phone}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    if (
                                                                        /^\d*$/.test(value) &&
                                                                        value.length <= 10
                                                                    ) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            phone: value.trim(),
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                        </div>

                                                        <div className='w-full'>
                                                            <Label
                                                                htmlFor='address'
                                                                value='Địa chỉ nhận hàng'
                                                                className='text-gray-700 font-semibold'
                                                            />
                                                            <Textarea
                                                                rows={3}
                                                                id='address'
                                                                className='mt-2'
                                                                placeholder='Số nhà, đường, phường, quận, thành phố'
                                                                value={formModal.address}
                                                                onChange={(e) =>
                                                                    setFormModal({
                                                                        ...formModal,
                                                                        address: e.target.value,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                        <div className='w-full flex justify-between items-center'>
                                                            <Button
                                                                color='gray'
                                                                className='w-full mr-2'
                                                                onClick={() =>
                                                                    setShowModalEditAddress(false)
                                                                }
                                                            >
                                                                Hủy
                                                            </Button>
                                                            <Button
                                                                color='blue'
                                                                className='w-full ml-2'
                                                                onClick={handleEditAddress}
                                                            >
                                                                Xác nhận
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </>
                                    )}
                                    {isEditting && (
                                        <>
                                            <Button onClick={() => setIsEditting(false)} outline>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <FaTimes className='w-4 h-auto' />
                                                    <span>Hủy</span>
                                                </div>
                                            </Button>
                                            <Button onClick={handleUpdateInfo} outline>
                                                <div className='flex items-center justify-center gap-x-1'>
                                                    <RiSave3Fill className='w-4 h-auto' />
                                                    <span>Lưu</span>
                                                </div>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <form onSubmit={handleSubmitForm}>
                                <div className='grid grid-cols-2 gap-5'>
                                    <TextInput
                                        disabled={!isEditting}
                                        type='text'
                                        icon={CiUser}
                                        className='w-full'
                                        placeholder='Họ và tên'
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                    <TextInput
                                        disabled={!isEditting}
                                        type='text'
                                        icon={CiMail}
                                        className='w-full'
                                        placeholder='Email'
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value.trim(),
                                            })
                                        }
                                    />
                                    <TextInput
                                        disabled={!isEditting}
                                        type='text'
                                        id='phone'
                                        icon={CiPhone}
                                        className='w-full'
                                        value={formData.phone}
                                        placeholder='Số điện thoại'
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value) && value.length <= 10) {
                                                setFormData({
                                                    ...formData,
                                                    phone: value.trim(),
                                                });
                                            }
                                        }}
                                    />
                                    <TextInput
                                        disabled={!isEditting}
                                        type='text'
                                        id='address'
                                        icon={CiHome}
                                        className='w-full'
                                        value={formData.address}
                                        placeholder='Địa chỉ'
                                    />
                                </div>
                            </form>
                        </div>

                        <div className='px-6 py-4'>
                            <h4 className='text-xl font-semibold mb-5'>Thông tin sản phẩm</h4>

                            <table className='w-full'>
                                <thead>
                                    <tr>
                                        <th className='text-left font-semibold'>Sản phẩm</th>
                                        <th className='font-semibold text-center'>Đơn giá</th>
                                        <th className='font-semibold text-center'>Số lượng</th>
                                        <th className='font-semibold text-center'>Thành tiền</th>
                                    </tr>
                                </thead>

                                {/* <tbody>
                                            {checkBuyNow
                                                ? orders_Redux?.productBuyNow.map((item) => {
                                                      return (
                                                          <tr key={item.id}>
                                                              <td className='py-4'>
                                                                  <div className='flex items-center'>
                                                                      <img
                                                                          className='h-16 w-16 mr-4'
                                                                          src={item.product.img[0]}
                                                                          alt='Product image'
                                                                      />

                                                                      <span className='w-80 font-semibold'>
                                                                          {item.product.productName}
                                                                      </span>
                                                                  </div>
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {formatData(item.product.price)}
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {item.quantity}
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {formatData(
                                                                      item.product.price *
                                                                          item.quantity
                                                                  )}
                                                              </td>
                                                          </tr>
                                                      );
                                                  })
                                                : orders_Redux?.data.map((item) => {
                                                      return (
                                                          <tr key={item.id}>
                                                              <td className='py-4'>
                                                                  <div className='flex items-center'>
                                                                      <img
                                                                          className='h-16 w-16 mr-4'
                                                                          src={item.product.img[0]}
                                                                          alt='Product image'
                                                                      />

                                                                      <span className='w-80 font-semibold'>
                                                                          {item.product.productName}
                                                                      </span>
                                                                  </div>
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {formatData(item.product.price)}
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {item.quantity}
                                                              </td>

                                                              <td className='py-4 text-center'>
                                                                  {formatData(
                                                                      item.product.price *
                                                                          item.quantity
                                                                  )}
                                                              </td>
                                                          </tr>
                                                      );
                                                  })}
                                        </tbody> */}
                            </table>
                        </div>
                    </div>
                </div>

                <div className='lg:w-1/4 w-full flex flex-col items-center gap-y-5'>
                    {/* <DeliveryTo_Component /> */}
                    <Vouchers_Component />
                    <div
                        className='w-full shadow-sm border border-gray-200 
                    dark:border-none dark:bg-gray-800 rounded-lg p-6'
                    >
                        <div className='flex items-center justify-between mb-1'>
                            <span className='font-semibold text-lg'>Thanh toán đơn hàng</span>
                            <Link
                                className='text-blue-500 cursor-pointer hover:underline'
                                to={'/cart'}
                            >
                                Thay đổi
                            </Link>
                        </div>

                        <div className='border-t border-b py-3'>
                            <div className='flex justify-between text-md'>
                                <span>Tạm tính</span>
                                <span>{'formatData(totalPrice)'}</span>
                            </div>
                            <div className='flex justify-between text-md'>
                                <span>Phí vận chuyển</span>
                                <span>0 ₫</span>
                            </div>
                            <div className='flex justify-between text-md'>
                                <span>Giảm giá từ Deal</span>
                                <span className='text-green-500'>0 ₫</span>
                            </div>
                        </div>

                        <div className='flex justify-between mt-2 text-xl font-semibold'>
                            <span>Tổng tiền</span>
                            <span className='text-red-500'>{'formatData(totalPrice)'}</span>
                        </div>

                        <div className='flex justify-end my-1'>
                            <span className='text-sm text-end text-gray-500'>
                                (Giá này đã bao gồm thuế GTGT, phí đóng gói và các chi phí phát sinh
                                khác)
                            </span>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            type='button'
                            className='group inline-flex w-full items-center justify-center rounded-md 
                            bg-blue-500 dark:bg-blue-500 hover:bg-red-500 dark:hover:bg-red-500
                            px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow'
                        >
                            Đặt hàng
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
                    </div>
                </div>
            </div>
        </div>
    );
}
