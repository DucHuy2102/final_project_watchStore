import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { FaTimes, FaUserEdit } from 'react-icons/fa';
import { RiSave3Fill } from 'react-icons/ri';
import { Button, Checkbox, Label, Modal, Radio, TextInput } from 'flowbite-react';
import { ProductInfo_CheckoutPage_Component } from '../../components/exportComponent';
import { PiHouseLineLight } from 'react-icons/pi';
import { Select } from 'antd';
import axios from 'axios';
import { SlNote } from 'react-icons/sl';
import { toast } from 'react-toastify';
import { update_Address, user_UpdateProfile } from '../../redux/slices/userSlice';

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PaymentMethod = ({ id, label, imageSrc, name }) => (
    <div className='cursor-pointer flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'>
        <Radio id={id} name={name} />
        <Label htmlFor={id} className='flex items-center gap-x-3 text-lg cursor-pointer'>
            <img src={imageSrc} alt={label} className='w-10 h-10 object-contain' />
            <span className='font-medium text-gray-800 dark:text-gray-200'>{label}</span>
        </Label>
    </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className='cursor-pointer flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow-md'>
        <div className='flex-shrink-0'>
            <div className='p-3 bg-blue-100 dark:bg-blue-900 rounded-full'>
                <Icon className='w-6 h-6 text-blue-600 dark:text-blue-300' />
            </div>
        </div>
        <div className='flex-grow'>
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{label}</p>
            <p className='text-lg font-semibold text-gray-900 dark:text-white'>{value}</p>
        </div>
    </div>
);

export default function DashCheckout() {
    // ==================================== Redux ====================================
    const { totalPrice, totalDiscountPrice, totalAmountToPay, productItems } = useSelector(
        (state) => state.checkout
    );
    const infoProduct = useMemo(() => productItems.map((item) => item.productItem), [productItems]);
    const currentUser = useSelector((state) => state.user.user);
    const addressUser = useSelector((state) => state.user.address);

    // ==================================== State ====================================
    const dispatch = useDispatch();
    const [shippingFee, setShippingFee] = useState(0);
    const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(null);
    const date = new Date(expectedDeliveryTime * 1000);
    const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const hours = date.getHours() + 1;
    const formattedDate = `trước ${hours}h ngày ${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;
    const navigate = useNavigate();
    const [showModalEditAddress, setShowModalEditAddress] = useState(false);
    const [selectedOption, setSelectedOption] = useState('thisUser');
    const [formData, setFormData] = useState({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
    });

    useEffect(() => {
        if (selectedOption === 'anotherUser') {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                province: { label: '', value: '' },
                district: { label: '', value: '' },
                ward: { label: '', value: '' },
                street: '',
            });
        } else {
            setFormData({
                fullName: currentUser.fullName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || '',
                province: addressUser?.province?.label || { label: '', value: '' },
                district: addressUser?.district?.label || { label: '', value: '' },
                ward: addressUser?.ward?.label || { label: '', value: '' },
                street: addressUser?.street || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption]);

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ==================================== Address ====================================
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [formAddress, setFormAddress] = useState({
        province: {
            label: addressUser.province?.label || '',
            value: addressUser.province?.value || null,
        },
        district: {
            label: addressUser.district?.label || '',
            value: addressUser.district?.value || null,
        },
        ward: {
            label: addressUser.ward?.label || '',
            value: addressUser.ward?.value || null,
        },
        street: addressUser.street || '',
    });

    // get province from api
    useEffect(() => {
        const getProvince = async () => {
            try {
                const res = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                    {
                        headers: {
                            Token: import.meta.env.VITE_TOKEN_GHN,
                        },
                    }
                );
                if (res?.status === 200) {
                    setProvinces(res.data.data);
                }
            } catch (error) {
                console.log('Error get api province', error);
            }
        };

        getProvince();
    }, []);

    // get district from api
    useEffect(() => {
        const getDistrict = async () => {
            if (!formAddress.province?.value) return;
            try {
                const res = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
                    {
                        params: { province_id: formAddress.province.value },
                        headers: {
                            Token: import.meta.env.VITE_TOKEN_GHN,
                        },
                    }
                );
                if (res?.status === 200) {
                    setDistricts(res.data.data);
                }
            } catch (error) {
                console.log('Error get api district', error);
                console.log('district', formAddress.province.value);
            }
        };

        getDistrict();
    }, [formAddress.province?.value]);

    // get ward from api
    useEffect(() => {
        const getWard = async () => {
            if (!formAddress.district?.value) return;
            try {
                const res = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
                    {
                        params: { district_id: formAddress.district.value },
                        headers: {
                            Token: import.meta.env.VITE_TOKEN_GHN,
                        },
                    }
                );
                if (res?.status === 200) {
                    setWards(res.data.data);
                }
            } catch (error) {
                console.log('Error get api ward', error);
                console.log('ward', formAddress.district.value);
            }
        };

        getWard();
    }, [formAddress.district?.value]);

    // handle confirm info
    const handleConfirmInfo = () => {
        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formAddress.ward ||
            !formAddress.district ||
            !formAddress.province
        ) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const fullAddress = `${formAddress.street}, ${formAddress.ward.label}, ${formAddress.district.label}, ${formAddress.province.label}`;
        setFormData({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: fullAddress,
        });
        dispatch(
            update_Address({
                province: formAddress.province,
                district: formAddress.district,
                ward: formAddress.ward,
                street: formAddress.street,
                fullAddress: fullAddress,
            })
        );
        setShowModalEditAddress(false);
    };

    // ==================================== Call API GNH ====================================
    const totalWeight = useMemo(
        () => productItems.reduce((total, item) => total + item.productItem.weight, 0),
        [productItems]
    );
    // calculate fee ship
    useEffect(() => {
        const calculateFeeShip = async () => {
            console.log(
                '-->',
                totalAmountToPay,
                addressUser.district?.value,
                addressUser.ward?.value,
                totalWeight
            );
            // try {
            //     const res = await axios.get(
            //         'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
            //         {
            //             params: {
            //                 service_id: 100039,
            //                 insurance_value: totalAmountToPay,
            //                 coupon: null,
            //                 from_district_id: 3695,
            //                 to_district_id: addressUser.district?.value,
            //                 to_ward_code: addressUser.ward?.value,
            //                 height: 15,
            //                 length: 15,
            //                 weight: 800,
            //                 width: 15,
            //             },
            //             headers: {
            //                 Token: import.meta.env.VITE_TOKEN_GHN,
            //             },
            //         }
            //     );
            //     if (res?.status === 200) {
            //         const { data } = res;
            //         setShippingFee(data.data.service_fee);
            //     }
            // } catch (error) {
            //     console.log('Error calculate fee ship', error);
            // }
        };
        calculateFeeShip();
    }, [addressUser.district?.value, addressUser.ward?.value]);

    // calculate the expected delivery time
    useEffect(() => {
        const calculateExpectedDeliveryTime = async () => {
            try {
                const res = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
                    {
                        params: {
                            from_district_id: 3695,
                            from_ward_code: '90742',
                            to_district_id: 1560,
                            to_ward_code: '580107',
                            service_id: 53321,
                        },
                        headers: {
                            Token: import.meta.env.VITE_TOKEN_GHN,
                        },
                    }
                );
                if (res?.status === 200) {
                    const { data } = res;
                    setExpectedDeliveryTime(data.data.leadtime);
                }
            } catch (error) {
                console.log('Error calculate expected delivery time', error);
            }
        };
        calculateExpectedDeliveryTime();
    }, [addressUser.district?.value]);

    return (
        <div className='w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Column */}
                    <div className='w-full lg:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <div className='mb-6'>
                            <div className='space-y-4 dark:bg-gray-800 p-6 rounded-xl'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='font-semibold text-xl text-gray-700 dark:text-gray-300 mb-4'>
                                        Thông tin người nhận
                                    </h3>
                                    <Button
                                        onClick={() => setShowModalEditAddress(true)}
                                        size='sm'
                                        outline
                                    >
                                        <CiEdit className='mr-2 mt-1' />
                                        Chỉnh sửa thông tin
                                    </Button>
                                </div>
                                <InfoItem
                                    icon={CiUser}
                                    label='Họ và Tên'
                                    value={formData.fullName}
                                />
                                <InfoItem icon={CiMail} label='Email' value={formData.email} />
                                <InfoItem
                                    icon={CiPhone}
                                    label='Số điện thoại'
                                    value={formData.phone}
                                />
                                <InfoItem
                                    icon={CiHome}
                                    label='Địa chỉ nhận hàng'
                                    value={formData.address}
                                />
                            </div>
                        </div>
                        <div className='mb-8'>
                            <h3 className='font-semibold text-xl text-gray-800 dark:text-gray-200 mb-6'>
                                Phương thức thanh toán
                            </h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <PaymentMethod
                                    id='cash'
                                    name='paymentMethod'
                                    label='Tiền mặt'
                                    imageSrc='../assets/payCash.png'
                                />
                                <PaymentMethod
                                    id='vnpay'
                                    name='paymentMethod'
                                    label='VNPAY'
                                    imageSrc='../assets/vnpayPayment.jpg'
                                />
                                <PaymentMethod
                                    id='momo'
                                    name='paymentMethod'
                                    label='Ví Momo'
                                    imageSrc='../assets/momoPayment.png'
                                />
                                <PaymentMethod
                                    id='credit'
                                    name='paymentMethod'
                                    label='Thẻ tín dụng/Ghi nợ'
                                    imageSrc='../assets/creditCard.png'
                                />
                            </div>
                        </div>

                        <Modal
                            show={showModalEditAddress}
                            onClose={() => setShowModalEditAddress(false)}
                            size='md'
                        >
                            <Modal.Header className='flex items-center space-x-4'>
                                <div className='flex items-center space-x-4'>
                                    <FaUserEdit className='text-blue-500 text-3xl' />
                                    <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                                        Gửi hàng cho người khác
                                    </h3>
                                </div>
                            </Modal.Header>
                            <Modal.Body className='space-y-5'>
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-x-2'>
                                        <Radio
                                            id='thisUser'
                                            checked={selectedOption === 'thisUser'}
                                            onChange={() => setSelectedOption('thisUser')}
                                        />
                                        <Label
                                            htmlFor='thisUser'
                                            className='text-gray-700 dark:text-gray-300'
                                        >
                                            Thông tin của tôi
                                        </Label>
                                    </div>
                                    <div className='flex items-center gap-x-2'>
                                        <Radio
                                            id='anotherUser'
                                            checked={selectedOption === 'anotherUser'}
                                            onChange={() => setSelectedOption('anotherUser')}
                                        />
                                        <Label
                                            htmlFor='anotherUser'
                                            className='text-gray-700 dark:text-gray-300'
                                        >
                                            Gửi hàng cho người khác
                                        </Label>
                                    </div>
                                </div>
                                <>
                                    <TextInput
                                        icon={CiUser}
                                        type='text'
                                        name='fullName'
                                        placeholder='Họ và Tên người nhận'
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                    <TextInput
                                        icon={CiMail}
                                        type='email'
                                        name='email'
                                        placeholder='Email người nhận'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                    <TextInput
                                        icon={CiPhone}
                                        type='text'
                                        name='phone'
                                        placeholder='Số điện thoại người nhận'
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    <Select
                                        placeholder='Chọn Thành Phố'
                                        className='w-full h-10'
                                        options={
                                            provinces?.map((province) => ({
                                                label: province.ProvinceName,
                                                value: province.ProvinceID,
                                            })) ?? []
                                        }
                                        onChange={(value) => {
                                            setFormAddress({
                                                ...formAddress,
                                                province: {
                                                    label: provinces.find(
                                                        (province) => province.ProvinceID === value
                                                    ).NameExtension[1],
                                                    value: value,
                                                },
                                            });
                                        }}
                                    />
                                    <Select
                                        placeholder='Chọn Quận/Huyện'
                                        className='w-full h-10'
                                        options={
                                            districts?.map((district) => ({
                                                label: district.DistrictName,
                                                value: district.DistrictID,
                                            })) ?? []
                                        }
                                        onChange={(value) => {
                                            setFormAddress({
                                                ...formAddress,
                                                district: {
                                                    label: districts.find(
                                                        (district) => district.DistrictID === value
                                                    ).NameExtension[0],
                                                    value: value,
                                                },
                                            });
                                        }}
                                    />
                                    <Select
                                        placeholder='Chọn Phường/Xã'
                                        className='w-full h-10'
                                        options={
                                            wards?.map((ward) => ({
                                                label: ward.WardName,
                                                value: ward.WardCode,
                                            })) ?? []
                                        }
                                        onChange={(value) => {
                                            setFormAddress({
                                                ...formAddress,
                                                ward: {
                                                    label: wards.find(
                                                        (ward) => ward.WardCode === value
                                                    ).NameExtension[0],
                                                    value: value,
                                                },
                                            });
                                        }}
                                    />

                                    <TextInput
                                        type='text'
                                        className='w-full'
                                        placeholder='Số nhà, tên đường'
                                        value={formAddress.street}
                                        onChange={(e) =>
                                            setFormAddress({
                                                ...formAddress,
                                                street: e.target.value,
                                            })
                                        }
                                    />
                                </>
                            </Modal.Body>
                            <Modal.Footer className='flex justify-between h-16'>
                                <Button color='gray' onClick={() => setShowModalEditAddress(false)}>
                                    Hủy
                                </Button>
                                <Button color='blue' onClick={handleConfirmInfo}>
                                    Xác nhận
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    {/* Right Column */}
                    <div className='w-full lg:w-2/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                        <div className='flex flex-col justify-start items-start mb-1'>
                            <span className='text-2xl font-semibold text-gray-800 dark:text-gray-200'>
                                Thông tin đơn hàng
                            </span>
                            <span>
                                Dự kiến hàng sẽ đến vào{' '}
                                <span className='text-blue-500'>{`${dayOfWeek}, ${formattedDate}`}</span>
                            </span>
                        </div>
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
