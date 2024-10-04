// import { useMemo, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
// import { FaTimes } from 'react-icons/fa';
// import { RiSave3Fill } from 'react-icons/ri';
// import { FiMinus } from 'react-icons/fi';
// import { Button, Checkbox, Label, Modal, Textarea, TextInput } from 'flowbite-react';
// import { ProductInfo_CheckoutPage_Component } from '../../components/exportComponent';

// const formatPrice = (price) =>
//     new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// const PaymentMethod = ({ id, label, imageSrc }) => (
//     <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
//         <Checkbox id={id} />
//         <Label htmlFor={id} className='flex items-center gap-x-2 text-md cursor-pointer'>
//             <img src={imageSrc} alt='' className='w-8 h-8 object-contain' />
//             {label}
//         </Label>
//     </div>
// );

// const InfoField = ({ label, icon: Icon, value, onChange, disabled }) => (
//     <div className='mb-4'>
//         <Label value={label} className='text-gray-700 dark:text-gray-300 mb-1 block' />
//         <TextInput
//             icon={Icon}
//             type='text'
//             className='w-full'
//             value={value}
//             onChange={onChange}
//             disabled={disabled}
//         />
//     </div>
// );

// export default function DashCheckout() {
//     const navigate = useNavigate();
//     const [isEditing, setIsEditing] = useState(false);
//     const [showModalEditAddress, setShowModalEditAddress] = useState(false);
//     const { totalPrice, totalDiscountPrice, totalAmountToPay, productItems } = useSelector(
//         (state) => state.checkout
//     );
//     const currentUser = useSelector((state) => state.user.user);

//     const [formData, setFormData] = useState({
//         fullName: currentUser.fullName || '',
//         email: currentUser.email || '',
//         phone: currentUser.phone || '',
//         address: currentUser.address || '',
//     });

//     const infoProduct = useMemo(() => productItems.map((item) => item.productItem), [productItems]);

//     const shippingFee = 0;

//     return (
//         <div className='w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8'>
//             <div className='max-w-7xl mx-auto'>
//                 <div className='flex flex-col lg:flex-row gap-8'>
//                     {/* Left Column */}
//                     <div className='w-full lg:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
//                         <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6'>
//                             Thông tin thanh toán
//                         </h2>
//                         <div className='mb-8'>
//                             <h3 className='font-semibold text-lg text-gray-700 dark:text-gray-300 mb-4'>
//                                 Phương thức thanh toán
//                             </h3>
//                             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//                                 <PaymentMethod
//                                     id='cash'
//                                     label='Tiền mặt'
//                                     imageSrc='../assets/payCash.png'
//                                 />
//                                 <PaymentMethod
//                                     id='vnpay'
//                                     label='VNPAY'
//                                     imageSrc='../assets/vnpayPayment.jpg'
//                                 />
//                                 <PaymentMethod
//                                     id='momo'
//                                     label='Ví Momo'
//                                     imageSrc='../assets/momoPayment.png'
//                                 />
//                                 <PaymentMethod
//                                     id='credit'
//                                     label='Thẻ tín dụng/Ghi nợ'
//                                     imageSrc='../assets/creditCard.png'
//                                 />
//                             </div>
//                         </div>
//                         <div className='mb-6'>
//                             <div className='flex items-center justify-between mb-4'>
//                                 <h3 className='font-semibold text-lg text-gray-700 dark:text-gray-300'>
//                                     Thông tin người nhận
//                                 </h3>
//                                 {!isEditing ? (
//                                     <div className='flex gap-2'>
//                                         <Button
//                                             onClick={() => setIsEditing(true)}
//                                             size='sm'
//                                             outline
//                                         >
//                                             <CiEdit className='mr-2' />
//                                             Chỉnh sửa
//                                         </Button>
//                                         <Button
//                                             onClick={() => setShowModalEditAddress(true)}
//                                             size='sm'
//                                             outline
//                                         >
//                                             <CiEdit className='mr-2' />
//                                             Gửi đến địa chỉ khác
//                                         </Button>
//                                     </div>
//                                 ) : (
//                                     <div className='flex gap-2'>
//                                         <Button
//                                             onClick={() => setIsEditing(false)}
//                                             size='sm'
//                                             outline
//                                         >
//                                             <FaTimes className='mr-2' />
//                                             Hủy
//                                         </Button>
//                                         <Button
//                                             onClick={() => {
//                                                 /* Handle update */
//                                             }}
//                                             size='sm'
//                                             outline
//                                         >
//                                             <RiSave3Fill className='mr-2' />
//                                             Lưu
//                                         </Button>
//                                     </div>
//                                 )}
//                             </div>
//                             <InfoField
//                                 label='Họ và Tên'
//                                 icon={CiUser}
//                                 value={formData.fullName}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, fullName: e.target.value })
//                                 }
//                                 disabled={!isEditing}
//                             />
//                             <InfoField
//                                 label='Email'
//                                 icon={CiMail}
//                                 value={formData.email}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, email: e.target.value.trim() })
//                                 }
//                                 disabled={!isEditing}
//                             />
//                             <InfoField
//                                 label='Số điện thoại'
//                                 icon={CiPhone}
//                                 value={formData.phone}
//                                 onChange={(e) => {
//                                     const value = e.target.value;
//                                     if (/^\d*$/.test(value) && value.length <= 10) {
//                                         setFormData({ ...formData, phone: value.trim() });
//                                     }
//                                 }}
//                                 disabled={!isEditing}
//                             />
//                             <InfoField
//                                 label='Địa chỉ nhận hàng'
//                                 icon={CiHome}
//                                 value={formData.address}
//                                 onChange={(e) =>
//                                     setFormData({ ...formData, address: e.target.value })
//                                 }
//                                 disabled={!isEditing}
//                             />
//                         </div>
//                     </div>

//                     {/* Right Column */}
//                     <div className='w-full lg:w-2/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
//                         <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6'>
//                             Thông tin đơn hàng
//                         </h2>
//                         <div className='space-y-4 mb-6'>
//                             {infoProduct.map((_, index) => {
//                                 return (
//                                     <ProductInfo_CheckoutPage_Component
//                                         key={index}
//                                         dataProduct={productItems[index]}
//                                     />
//                                 );
//                             })}
//                         </div>
//                         <div className='mb-6'>
//                             <div className='flex items-center mb-4'>
//                                 <TextInput
//                                     type='text'
//                                     placeholder='Mã khuyến mãi'
//                                     className='flex-grow mr-2'
//                                 />
//                                 <Button color='blue'>Áp dụng</Button>
//                             </div>
//                         </div>
//                         <div className='space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
//                             <div className='flex justify-between'>
//                                 <span className='text-gray-600 dark:text-gray-400'>Tạm tính</span>
//                                 <span className='font-semibold text-gray-800 dark:text-gray-200'>
//                                     {formatPrice(totalPrice)}
//                                 </span>
//                             </div>
//                             <div className='flex justify-between'>
//                                 <span className='text-gray-600 dark:text-gray-400'>
//                                     Phí vận chuyển
//                                 </span>
//                                 <span className='font-semibold text-gray-800 dark:text-gray-200'>
//                                     {formatPrice(shippingFee)}
//                                 </span>
//                             </div>
//                             <div className='flex justify-between'>
//                                 <span className='text-gray-600 dark:text-gray-400'>Giảm giá</span>
//                                 <span className='font-semibold text-green-600'>
//                                     - {formatPrice(totalDiscountPrice)}
//                                 </span>
//                             </div>
//                         </div>
//                         <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
//                             <div className='flex justify-between items-center mb-4'>
//                                 <span className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
//                                     Tổng cộng
//                                 </span>
//                                 <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
//                                     {formatPrice(totalAmountToPay - shippingFee)}
//                                 </span>
//                             </div>
//                             <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
//                                 (Đã bao gồm thuế VAT)
//                             </p>
//                             <Button
//                                 color='blue'
//                                 size='lg'
//                                 className='w-full'
//                                 onClick={() => navigate('/checkout')}
//                             >
//                                 Đặt hàng
//                             </Button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { FaTimes } from 'react-icons/fa';
import { RiSave3Fill } from 'react-icons/ri';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { ProductInfo_CheckoutPage_Component } from '../../components/exportComponent';

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PaymentMethod = ({ id, label, imageSrc }) => (
    <div className='flex items-center gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm'>
        <Checkbox id={id} />
        <Label htmlFor={id} className='flex items-center gap-x-2 text-md cursor-pointer'>
            <img src={imageSrc} alt='' className='w-8 h-8 object-contain' />
            {label}
        </Label>
    </div>
);

const InfoField = ({ label, icon: Icon, value, onChange, disabled }) => (
    <div className='mb-4'>
        <Label value={label} className='text-gray-700 dark:text-gray-300 mb-1 block' />
        <TextInput
            icon={Icon}
            type='text'
            className='w-full'
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
    </div>
);

const ReadOnlyField = ({ label, icon: Icon, value }) => (
    <div className='mb-4'>
        <Label value={label} className='text-gray-700 dark:text-gray-300 mb-1 block' />
        <div className='flex items-center text-gray-800 dark:text-gray-200'>
            <Icon className='mr-2' />
            <span>{value}</span>
        </div>
    </div>
);

export default function DashCheckout() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showModalEditAddress, setShowModalEditAddress] = useState(false);
    const { totalPrice, totalDiscountPrice, totalAmountToPay, productItems } = useSelector(
        (state) => state.checkout
    );
    const currentUser = useSelector((state) => state.user.user);

    const [formData, setFormData] = useState({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
    });

    const infoProduct = useMemo(() => productItems.map((item) => item.productItem), [productItems]);

    const shippingFee = 0;

    const renderUserInfo = () => {
        if (isEditing) {
            return (
                <>
                    <InfoField
                        label='Họ và Tên'
                        icon={CiUser}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        disabled={false}
                    />
                    <InfoField
                        label='Email'
                        icon={CiMail}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                        disabled={false}
                    />
                    <InfoField
                        label='Số điện thoại'
                        icon={CiPhone}
                        value={formData.phone}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value) && value.length <= 10) {
                                setFormData({ ...formData, phone: value.trim() });
                            }
                        }}
                        disabled={false}
                    />
                    <InfoField
                        label='Địa chỉ nhận hàng'
                        icon={CiHome}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={false}
                    />
                </>
            );
        } else {
            return (
                <div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                    <ReadOnlyField label='Họ và Tên' icon={CiUser} value={formData.fullName} />
                    <ReadOnlyField label='Email' icon={CiMail} value={formData.email} />
                    <ReadOnlyField label='Số điện thoại' icon={CiPhone} value={formData.phone} />
                    <ReadOnlyField
                        label='Địa chỉ nhận hàng'
                        icon={CiHome}
                        value={formData.address}
                    />
                </div>
            );
        }
    };

    return (
        <div className='w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Column */}
                    <div className='w-full lg:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6'>
                            Thông tin thanh toán
                        </h2>
                        <div className='mb-8'>
                            <h3 className='font-semibold text-lg text-gray-700 dark:text-gray-300 mb-4'>
                                Phương thức thanh toán
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <PaymentMethod
                                    id='cash'
                                    label='Tiền mặt'
                                    imageSrc='../assets/payCash.png'
                                />
                                <PaymentMethod
                                    id='vnpay'
                                    label='VNPAY'
                                    imageSrc='../assets/vnpayPayment.jpg'
                                />
                                <PaymentMethod
                                    id='momo'
                                    label='Ví Momo'
                                    imageSrc='../assets/momoPayment.png'
                                />
                                <PaymentMethod
                                    id='credit'
                                    label='Thẻ tín dụng/Ghi nợ'
                                    imageSrc='../assets/creditCard.png'
                                />
                            </div>
                        </div>
                        <div className='mb-6'>
                            <div className='flex items-center justify-between mb-4'>
                                <h3 className='font-semibold text-lg text-gray-700 dark:text-gray-300'>
                                    Thông tin người nhận
                                </h3>
                                {!isEditing ? (
                                    <div className='flex gap-2'>
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            size='sm'
                                            outline
                                        >
                                            <CiEdit className='mr-2' />
                                            Chỉnh sửa
                                        </Button>
                                        <Button
                                            onClick={() => setShowModalEditAddress(true)}
                                            size='sm'
                                            outline
                                        >
                                            <CiEdit className='mr-2' />
                                            Gửi đến địa chỉ khác
                                        </Button>
                                    </div>
                                ) : (
                                    <div className='flex gap-2'>
                                        <Button
                                            onClick={() => setIsEditing(false)}
                                            size='sm'
                                            outline
                                        >
                                            <FaTimes className='mr-2' />
                                            Hủy
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                /* Handle update */
                                                setIsEditing(false);
                                            }}
                                            size='sm'
                                            outline
                                        >
                                            <RiSave3Fill className='mr-2' />
                                            Lưu
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {renderUserInfo()}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='w-full lg:w-2/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6'>
                            Thông tin đơn hàng
                        </h2>
                        <div className='space-y-4 mb-6'>
                            {infoProduct.map((_, index) => {
                                return (
                                    <ProductInfo_CheckoutPage_Component
                                        key={index}
                                        dataProduct={productItems[index]}
                                    />
                                );
                            })}
                        </div>
                        <div className='mb-6'>
                            <div className='flex items-center mb-4'>
                                <TextInput
                                    type='text'
                                    placeholder='Mã khuyến mãi'
                                    className='flex-grow mr-2'
                                />
                                <Button color='blue'>Áp dụng</Button>
                            </div>
                        </div>
                        <div className='space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
                            <div className='flex justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>Tạm tính</span>
                                <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>
                                    Phí vận chuyển
                                </span>
                                <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                    {formatPrice(shippingFee)}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600 dark:text-gray-400'>Giảm giá</span>
                                <span className='font-semibold text-green-600'>
                                    - {formatPrice(totalDiscountPrice)}
                                </span>
                            </div>
                        </div>
                        <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
                            <div className='flex justify-between items-center mb-4'>
                                <span className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                                    Tổng cộng
                                </span>
                                <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                    {formatPrice(totalAmountToPay - shippingFee)}
                                </span>
                            </div>
                            <p className='text-sm text-gray-500 dark:text-gray-400 mb-6'>
                                (Đã bao gồm thuế VAT)
                            </p>
                            <Button
                                color='blue'
                                size='lg'
                                className='w-full'
                                onClick={() => navigate('/checkout')}
                            >
                                Đặt hàng
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
