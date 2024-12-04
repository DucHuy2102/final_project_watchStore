import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { FaUserEdit } from 'react-icons/fa';
import { FiCalendar, FiClock, FiHome, FiMail, FiPhone, FiTruck, FiUser } from 'react-icons/fi';
import { Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { Select } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RiCoupon3Fill } from 'react-icons/ri';
import { resetCart } from '../../services/redux/slices/cartSlice';
import { resetCheckout, resetOrderDetail, setOrderDetail } from '../../services/redux/slices/checkoutSlice';
import { EmptyCheckout, ProductInfo_CheckoutPage, SelectedVoucher, VoucherModal } from './components/exportCom_Product';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PaymentMethod = ({ id, label, imageSrc, selectedPayment, onSelect, className }) => (
    <div onClick={() => onSelect(id)} className={`cursor-pointer ${className}`}>
        <div
            className={`
            p-4 rounded-lg bg-gradient-to-br from-white via-gray-50 to-gray-100
            dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 
            shadow-sm hover:shadow-lg transition-all duration-300
            ${selectedPayment === id ? 'ring-1 ring-amber-500 shadow-amber-500/20' : ''}
            transform hover:scale-[1.01]
        `}
        >
            <div className='flex items-center gap-3'>
                <div className='relative w-12 h-12'>
                    <div className='absolute inset-0 rounded-lg' />
                    <img
                        src={imageSrc}
                        alt={label}
                        className='relative w-full h-full object-contain rounded-lg p-1.5'
                    />
                </div>
                <div className='flex-1'>
                    <p className='text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent'>
                        {label}
                    </p>
                </div>
                <div
                    className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${selectedPayment === id ? 'border-amber-500' : 'border-gray-300 dark:border-gray-600'}
                    transition-colors duration-300
                `}
                >
                    {selectedPayment === id && <div className='w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse' />}
                </div>
            </div>
        </div>
    </div>
);

const InfoItem = ({ icon: Icon, label, value, iconColor, iconBg }) => (
    <div className='group cursor-pointer transition-all duration-300'>
        <div className='relative'>
            <div className='absolute inset-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg blur-sm transition-all duration-300'></div>
            <div className='relative p-3.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:hover:shadow-gray-700 border border-gray-50 dark:border-gray-800 transition-all duration-300 group-hover:shadow-md'>
                <div className='flex items-center space-x-3'>
                    <div className='flex-shrink-0'>
                        <div
                            className={`p-2 ${iconBg} rounded-lg group-hover:scale-105 transition-transform duration-300`}
                        >
                            <Icon className={`w-4 h-4 ${iconColor} stroke-[1.5]`} />
                        </div>
                    </div>
                    <div className='flex-grow min-w-0'>
                        <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>{label}</p>
                        <p className='text-sm font-semibold text-gray-800 dark:text-gray-200 truncate'>{value}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ExpectedDeliveryTime = ({ dayOfWeek, formattedDate }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg p-5 mb-1 w-full shadow-md'
    >
        <div className='flex items-center justify-between mb-3'>
            <div className='flex items-center space-x-3'>
                <div className='bg-white/90 rounded-lg p-1.5'>
                    <FiTruck className='text-indigo-500 text-base' />
                </div>
                <h3 className='text-lg font-semibold text-white'>Đơn vị vận chuyển</h3>
            </div>
            <a
                href='https://ghn.vn/'
                target='_blank'
                rel='noreferrer'
                className='flex items-center space-x-2 cursor-pointer'
            >
                <img src={'../assets/ghn_logo.webp'} alt='GiaoHangNhanh Logo' className='w-6 h-6 rounded-full' />
                <span className='text-base text-white font-medium'>GiaoHangNhanh</span>
            </a>
        </div>
        <div className='bg-white/10 rounded-lg p-3'>
            <div className='flex items-center space-x-2 mb-1.5'>
                <FiCalendar className='text-white text-base' />
                <p className='text-base text-white font-medium'>Ngày giao dự kiến: {dayOfWeek}</p>
            </div>
            <div className='flex items-center space-x-2 mb-1.5'>
                <FiClock className='text-white text-base' />
                <p className='text-base text-white font-medium'>Thời gian: {formattedDate}</p>
            </div>
            <div className='mt-2 text-white/90 text-sm'>
                <p>Ước tính thời gian giao hàng: 2-3 ngày làm việc</p>
                <p className='mt-1'>
                    <span className='font-medium'>Lưu ý</span>: Thời gian giao hàng có thể thay đổi tùy theo địa chỉ
                    nhận hàng và tình hình giao thông thực tế.
                </p>
            </div>
        </div>
    </motion.div>
);

const validatePhone = (phone) => {
    const phoneRegex = /^0[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default function DashCheckout() {
    // ==================================== Redux ====================================
    const { access_token: tokenUser, user: currentUser } = useSelector((state) => state.user);
    const { cartItem: cartRedux } = useSelector((state) => state.cart);
    const { isBuyNow, cartItems, buyNowItem } = useSelector((state) => state.checkout);
    const checkoutData = isBuyNow ? buyNowItem : cartItems;
    const { productItems, totalQuantity } = checkoutData;
    const totalPrice = useMemo(() => {
        if (isBuyNow) {
            const selectedOption = productItems?.productItem?.option?.find(
                (opt) => opt.key === checkoutData?.productItems?.option,
            );
            if (selectedOption) {
                const { price, discount } = selectedOption.value;
                const discountedPrice = price - discount;
                return discountedPrice * totalQuantity;
            }
            return 0;
        } else {
            return productItems.reduce((total, item) => {
                const selectedOption = item.productItem?.option?.find((opt) => opt.key === item.option);
                if (selectedOption) {
                    const { price, discount } = selectedOption.value;
                    const discountedPrice = price - discount;
                    return total + discountedPrice * item.quantity;
                }
                return total;
            }, 0);
        }
    }, [isBuyNow, productItems, checkoutData, totalQuantity]);

    // ==================================== State ====================================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formOrderResponse, setFormOrderResponse] = useState(null);
    const [countdown, setCountdown] = useState(5);

    // voucher state
    const [allVouchers, setAllVouchers] = useState([]);
    const [openModalVoucher, setOpenModalVoucher] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState(null);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [voucherPrice, setVoucherPrice] = useState(0);
    const [voucherCode, setVoucherCode] = useState('');

    // shipping fee state and expected delivery time
    const [shippingFee, setShippingFee] = useState(0);
    const [expectedDeliveryTime, setExpectedDeliveryTime] = useState(null);

    // modal edit address
    const [showModalEditAddress, setShowModalEditAddress] = useState(false);
    const [formEditAddress, setFormEditAddress] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: {
            province: {
                label: '',
                value: null,
            },
            district: {
                label: '',
                value: null,
            },
            ward: {
                label: '',
                value: null,
            },
            street: '',
            fullAddress: '',
        },
    });

    const [infoItemData, setInfoItemData] = useState({
        fullName: currentUser?.fullName ?? 'Chưa cập nhật',
        email: currentUser?.email ?? 'Chưa cập nhật',
        phone: currentUser?.phone ?? 'Chưa cập nhật',
        address: currentUser?.address?.fullAddress ?? 'Chưa cập nhật',
    });

    // countdown to redirect to products page if no product
    useEffect(() => {
        if (totalQuantity === 0) {
            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        navigate('/products');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [totalQuantity, navigate]);

    // redirect to payment gateway after buy now success
    useEffect(() => {
        if (formOrderResponse) {
            dispatch(setOrderDetail(formOrderResponse));

            if (paymentMethod !== 'cash') {
                const redirectTimer = setTimeout(() => {
                    window.open(formOrderResponse.redirectUrl, '_self');
                    dispatch(resetCart());
                    dispatch(resetCheckout());
                    dispatch(resetOrderDetail());
                }, 3000);
                return () => clearTimeout(redirectTimer);
            } else {
                dispatch(resetCart());
                dispatch(resetCheckout());
                navigate('/order/order-detail');
            }
        }
    }, [dispatch, formOrderResponse, navigate, paymentMethod]);

    // get all vouchers from API
    useEffect(() => {
        if (totalQuantity === 0) return;
        const getAllVouchers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/client/get-all-coupon`);
                if (res?.status === 200) {
                    setAllVouchers(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllVouchers();
    }, [totalQuantity]);

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'street') {
            setFormEditAddress((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
        } else {
            setFormEditAddress((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ==================================== Address ====================================
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // get province from api
    useEffect(() => {
        if (totalQuantity === 0) return;
        const getProvince = async () => {
            try {
                const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
                    headers: {
                        Token: import.meta.env.VITE_TOKEN_GHN,
                    },
                });
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
            if (!formEditAddress?.address.province?.value) return;
            try {
                const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                    params: { province_id: formEditAddress.address.province.value },
                    headers: {
                        Token: import.meta.env.VITE_TOKEN_GHN,
                    },
                });
                if (res?.status === 200) {
                    setDistricts(res.data.data);
                }
            } catch (error) {
                console.log('Error get api district', error);
            }
        };

        getDistrict();
    }, [formEditAddress?.address.province?.value]);

    // get ward from api
    useEffect(() => {
        const getWard = async () => {
            if (!formEditAddress?.address.district?.value) return;
            try {
                const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                    params: { district_id: formEditAddress.address.district.value },
                    headers: {
                        Token: import.meta.env.VITE_TOKEN_GHN,
                    },
                });
                if (res?.status === 200) {
                    setWards(res.data.data);
                }
            } catch (error) {
                console.log('Error get api ward', error);
            }
        };

        getWard();
    }, [formEditAddress?.address.district?.value]);

    // handle confirm info
    const handleConfirmInfo = () => {
        console.log(formEditAddress);
        if (
            !formEditAddress.fullName ||
            !formEditAddress.email ||
            !formEditAddress.phone ||
            !formEditAddress.address.ward ||
            !formEditAddress.address.district ||
            !formEditAddress.address.province
        ) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const newAddress = `${formEditAddress.address.street}, ${formEditAddress.address.ward.label}, ${formEditAddress.address.district.label}, ${formEditAddress.address.province.label}`;
        setInfoItemData({
            fullName: formEditAddress.fullName,
            email: formEditAddress.email,
            phone: formEditAddress.phone,
            address: newAddress,
        });
        setShowModalEditAddress(false);
    };

    // ==================================== Call API GNH ====================================
    const totalWeight = useMemo(() => {
        if (!isBuyNow) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.weight, 0));
        } else {
            return Math.ceil(productItems?.productItem?.weight);
        }
    }, [isBuyNow, productItems]);

    const totalHeight = useMemo(() => {
        if (!isBuyNow) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.height, 0) / 10);
        } else {
            return Math.ceil(productItems?.productItem?.height);
        }
    }, [isBuyNow, productItems]);

    const totalLength = useMemo(() => {
        if (!isBuyNow) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.length, 0) / 10);
        } else {
            return Math.ceil(productItems?.productItem?.length);
        }
    }, [isBuyNow, productItems]);

    const totalWidth = useMemo(() => {
        if (!isBuyNow) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.width, 0) / 10);
        } else {
            return Math.ceil(productItems?.productItem?.width);
        }
    }, [isBuyNow, productItems]);

    // calculate fee ship
    useEffect(() => {
        if (totalQuantity === 0) return;
        else {
            const calculateFeeShip = async () => {
                try {
                    const res = await axios.post(
                        'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
                        {
                            service_type_id: 2,
                            to_district_id: currentUser?.address.district?.value,
                            to_ward_code: currentUser?.address.ward?.value,
                            height: totalHeight,
                            length: totalLength,
                            weight: totalWeight,
                            width: totalWidth,
                        },
                        {
                            headers: {
                                ShopId: '5194683',
                                Token: import.meta.env.VITE_TOKEN_GHN,
                            },
                        },
                    );
                    if (res?.status === 200) {
                        const { data } = res.data;
                        setShippingFee(data.service_fee !== 0 ? data.service_fee : 27190);
                    }
                } catch (error) {
                    console.log('Error calculate fee ship', error);
                }
            };
            calculateFeeShip();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser?.address.province?.value, currentUser?.address.district?.value, currentUser?.address.ward?.value]);

    // calculate the expected delivery time
    useEffect(() => {
        if (totalQuantity === 0) return;
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
                    },
                );
                if (res?.status === 200) {
                    const { data } = res.data;
                    setExpectedDeliveryTime(data.leadtime);
                }
            } catch (error) {
                console.log('Error calculate expected delivery time', error);
            }
        };
        calculateExpectedDeliveryTime();
    }, []);

    const date = new Date(expectedDeliveryTime * 1000);
    const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayOfWeek = `${daysOfWeek[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const hours = date.getHours();
    const formattedDate = `
        Trong khoảng ${hours} giờ - ${hours + 4} giờ (${hours < 12 ? 'Sáng' : hours < 18 ? 'Chiều' : 'Tối'})
    `;

    // ==================================== Call API to create order ====================================
    // handle choose payment method
    const handleChoosePaymentMethod = useCallback((idMethod) => {
        setPaymentMethod(idMethod);
    }, []);

    // handle select voucher in modal vouchers
    const handleApplyVoucher = useCallback(
        (voucher) => {
            if (voucher) {
                setSelectedVoucher(voucher);
                setAppliedVoucher(voucher.couponCode);
                const discountPrice = (totalPrice + shippingFee) * (voucher.discount / 100);
                setVoucherPrice(discountPrice);
            } else {
                setSelectedVoucher(null);
                setAppliedVoucher(null);
                setVoucherPrice(0);
            }
        },
        [shippingFee, totalPrice],
    );

    // handle apply voucher code
    const handleApplyVoucherCode = () => {
        if (!voucherCode) {
            toast.error('Vui lòng nhập mã khuyến mãi để áp dụng');
            return;
        }

        const isValidVoucher = allVouchers.find((voucher) => voucher.couponCode === voucherCode);
        if (!isValidVoucher) {
            toast.error('Mã khuyến mãi không hợp lệ');
            return;
        }

        const now = new Date();
        const createdDate = new Date(isValidVoucher.createdDate);
        const expiryDate = new Date(isValidVoucher.expiryDate);

        const isValidDate = now >= createdDate && now <= expiryDate;
        const hasRemainingTimes = isValidVoucher.times > 0;
        const isMinPriceReached = totalPrice >= isValidVoucher.minPrice;

        if (!isValidDate) {
            toast.error('Mã khuyến mãi đã hết hạn');
            setTimeout(() => setVoucherCode(''), 3000);
            return;
        }

        if (!hasRemainingTimes) {
            toast.error('Mã khuyến mãi đã hết lượt sử dụng');
            setTimeout(() => setVoucherCode(''), 3000);
            return;
        }

        if (!isMinPriceReached) {
            const remaining = isValidVoucher.minPrice - totalPrice;
            toast.error(`Đơn hàng cần thêm ${remaining.toLocaleString('vi-VN')}₫ để áp dụng mã này`);
            setTimeout(() => setVoucherCode(''), 3000);
            return;
        }

        handleApplyVoucher(isValidVoucher);
        setVoucherCode('');
        toast.success('Áp dụng mã khuyến mãi thành công');
    };

    // calculate total amount
    const totalAmount = totalPrice + shippingFee - (appliedVoucher ? voucherPrice : 0);

    // handle create order function
    const handleCreateOrder = async () => {
        if (paymentMethod === '') {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }
        if (!isBuyNow) {
            try {
                setIsLoading(true);
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/order/create`,
                    {
                        productItem: cartRedux.map((item) => item.idCart),
                        paymentMethod: paymentMethod,
                        shippingPrice: shippingFee,
                        couponCode: appliedVoucher ?? '',
                        profile: {
                            name: formEditAddress.fullName !== '' ? formEditAddress.fullName : currentUser?.fullName,
                            phone: formEditAddress.phone !== '' ? formEditAddress.phone : currentUser?.phone,
                            email: formEditAddress.email !== '' ? formEditAddress.email : currentUser?.email,
                            address: {
                                province: {
                                    label:
                                        formEditAddress.address.province.label !== ''
                                            ? formEditAddress.address.province.label
                                            : currentUser?.address.province.label,
                                    value:
                                        formEditAddress.address.province.value !== null
                                            ? formEditAddress.address.province.value
                                            : currentUser?.address.province.value,
                                },
                                district: {
                                    label:
                                        formEditAddress.address.district.label !== ''
                                            ? formEditAddress.address.district.label
                                            : currentUser?.address.district.label,
                                    value:
                                        formEditAddress.address.district.value !== null
                                            ? formEditAddress.address.district.value
                                            : currentUser?.address.district.value,
                                },
                                ward: {
                                    label:
                                        formEditAddress.address.ward.label !== ''
                                            ? formEditAddress.address.ward.label
                                            : currentUser?.address.ward.label,
                                    value:
                                        formEditAddress.address.ward.value !== null
                                            ? formEditAddress.address.ward.value
                                            : currentUser?.address.ward.value,
                                },
                                fullAddress:
                                    formEditAddress.address.fullAddress !== ''
                                        ? formEditAddress.address.fullAddress
                                        : currentUser?.address.fullAddress,
                            },
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    },
                );
                if (res.status === 201) {
                    if (paymentMethod === 'cash') {
                        toast.success('Đặt hàng thành công');
                    } else {
                        toast.success('Đang chuyển hướng đến cổng thanh toán...');
                    }
                    const { data } = res;
                    setFormOrderResponse(data);
                }
            } catch (error) {
                console.log('Error create order', error);
                toast.error('Lỗi hệ thống. Trang sẽ tải lại sau 3 giây');
                setTimeout(() => window.location.reload(), 3000);
            } finally {
                setIsLoading(false);
            }
        } else {
            try {
                setIsLoading(true);
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/order/buy-now`,
                    {
                        productId: productItems.productItem.id,
                        quantity: productItems.quantity,
                        option: productItems.option,
                        paymentMethod: paymentMethod,
                        shippingPrice: shippingFee,
                        couponCode: appliedVoucher ?? '',
                        profile: {
                            name: formEditAddress.fullName !== '' ? formEditAddress.fullName : currentUser?.fullName,
                            phone: formEditAddress.phone !== '' ? formEditAddress.phone : currentUser?.phone,
                            email: formEditAddress.email !== '' ? formEditAddress.email : currentUser?.email,
                            address: {
                                province: {
                                    label:
                                        formEditAddress.address.province.label !== ''
                                            ? formEditAddress.address.province.label
                                            : currentUser?.address.province.label,
                                    value:
                                        formEditAddress.address.province.value !== null
                                            ? formEditAddress.address.province.value
                                            : currentUser?.address.province.value,
                                },
                                district: {
                                    label:
                                        formEditAddress.address.district.label !== ''
                                            ? formEditAddress.address.district.label
                                            : currentUser?.address.district.label,
                                    value:
                                        formEditAddress.address.district.value !== null
                                            ? formEditAddress.address.district.value
                                            : currentUser?.address.district.value,
                                },
                                ward: {
                                    label:
                                        formEditAddress.address.ward.label !== ''
                                            ? formEditAddress.address.ward.label
                                            : currentUser?.address.ward.label,
                                    value:
                                        formEditAddress.address.ward.value !== null
                                            ? formEditAddress.address.ward.value
                                            : currentUser?.address.ward.value,
                                },
                                fullAddress:
                                    formEditAddress.address.fullAddress !== ''
                                        ? formEditAddress.address.fullAddress
                                        : currentUser?.address.fullAddress,
                            },
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    },
                );
                if (res.status === 200) {
                    if (paymentMethod === 'cash') {
                        toast.success('Đặt hàng thành công');
                    } else {
                        toast.success('Đang chuyển hướng đến cổng thanh toán...');
                    }
                    const { data } = res;
                    setFormOrderResponse(data);
                }
            } catch (error) {
                console.log('Error create order', error);
                toast.error('Lỗi hệ thống. Vui lòng thử lại!');
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Pass user's province to VoucherModal
    const userProvince = useMemo(
        () => ({
            label: currentUser?.address?.province?.label || '',
            value: currentUser?.address?.province?.value || null,
        }),
        [currentUser?.address?.province],
    );

    if (isLoading) {
        return (
            <div
                className='fixed inset-0 flex flex-col items-center justify-center gap-y-5
            bg-opacity-50 backdrop-blur-md z-50'
            >
                <Spinner className='w-20 h-20' />
                <p className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Đang xử lý đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen py-10'>
            {isLoading && (
                <div className='fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50'>
                    <div className='relative bg-white/90 dark:bg-gray-800/90 p-8 rounded-2xl shadow-2xl'>
                        <div className='absolute inset-0 bg-gradient-to-r from-amber-100/20 to-purple-100/20 rounded-2xl blur-xl' />
                        <div className='relative flex flex-col items-center'>
                            <div className='w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4' />
                            <p className='text-lg font-medium bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent'>
                                Đang xử lý đơn hàng...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-10'>
                {/* Header */}
                <div className='text-center mb-7'>
                    <h1 className='font-serif text-4xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-purple-700 bg-clip-text text-transparent mb-2'>
                        Thanh toán đơn hàng
                    </h1>
                    <div className='w-[20rem] h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full'></div>
                </div>

                {totalQuantity > 0 ? (
                    <div className='space-y-8'>
                        {/* Banner */}
                        <div className='relative overflow-hidden'>
                            <div className='px-1'>
                                <ExpectedDeliveryTime dayOfWeek={dayOfWeek} formattedDate={formattedDate} />
                            </div>
                        </div>

                        <div className='flex flex-col lg:flex-row gap-8'>
                            {/* Left Column */}
                            <div className='w-full lg:w-3/5 space-y-8'>
                                {/* User Information Card */}
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-purple-100/10 to-transparent rounded-3xl blur-xl' />
                                    <div className='relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-700/50 overflow-hidden'>
                                        <div className='px-8 py-6'>
                                            <div className='flex justify-between items-center mb-3'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl'>
                                                        <CiUser className='w-5 h-5 text-white' />
                                                    </div>
                                                    <h2 className='font-serif text-2xl font-bold text-gray-800 dark:text-gray-200'>
                                                        Thông tin người nhận
                                                    </h2>
                                                </div>
                                                <Button
                                                    onClick={() => setShowModalEditAddress(true)}
                                                    className='!ring-0 flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 
                                                    hover:to-amber-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-200/50'
                                                >
                                                    <CiEdit className='w-5 h-5' />
                                                    Gửi đến địa chỉ khác
                                                </Button>
                                            </div>

                                            <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                                                <InfoItem
                                                    icon={FiUser}
                                                    label='Họ và Tên'
                                                    value={infoItemData.fullName}
                                                    iconColor='text-blue-600 dark:text-blue-400'
                                                    iconBg='bg-blue-50 dark:bg-blue-900/30'
                                                />
                                                <InfoItem
                                                    icon={FiPhone}
                                                    label='Số điện thoại'
                                                    value={infoItemData.phone}
                                                    iconColor='text-green-600 dark:text-green-400'
                                                    iconBg='bg-green-50 dark:bg-green-900/30'
                                                />
                                                <InfoItem
                                                    icon={FiMail}
                                                    label='Email'
                                                    value={infoItemData.email}
                                                    iconColor='text-purple-600 dark:text-purple-400'
                                                    iconBg='bg-purple-50 dark:bg-purple-900/30'
                                                />
                                                <div className='col-span-3'>
                                                    <InfoItem
                                                        icon={FiHome}
                                                        label='Địa chỉ'
                                                        value={infoItemData.address}
                                                        iconColor='text-rose-600 dark:text-rose-400'
                                                        iconBg='bg-rose-50 dark:bg-rose-900/30'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Edit Address */}
                                <Modal
                                    show={showModalEditAddress}
                                    onClose={() => setShowModalEditAddress(false)}
                                    size='md'
                                    className='!p-0 backdrop-blur-md'
                                    dismissible={false}
                                    autoFocus={false}
                                >
                                    <div className='absolute inset-0 bg-gradient-to-br from-amber-50/90 via-white/90 to-purple-50/90 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-purple-900/90 backdrop-blur-sm rounded-lg' />

                                    <Modal.Header className='relative border-b border-amber-200/30 dark:border-amber-700/30'>
                                        <div className='flex items-center gap-4'>
                                            <div className='p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg shadow-lg'>
                                                <FaUserEdit className='text-white text-xl animate-pulse' />
                                            </div>
                                            <div>
                                                <h3 className='text-xl font-serif font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-purple-700 bg-clip-text text-transparent'>
                                                    Thông tin giao hàng
                                                </h3>
                                                <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                    Vui lòng điền đầy đủ thông tin bên dưới
                                                </p>
                                            </div>
                                        </div>
                                    </Modal.Header>

                                    <Modal.Body className='relative px-6'>
                                        <div className='space-y-4'>
                                            <div className='flex items-center gap-3 mb-4'>
                                                <span className='w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full' />
                                                <h4 className='text-base font-medium text-gray-700 dark:text-gray-300'>
                                                    Thông tin cá nhân
                                                </h4>
                                            </div>
                                            <div className='space-y-4'>
                                                <TextInput
                                                    icon={CiUser}
                                                    type='text'
                                                    name='fullName'
                                                    placeholder='Họ và Tên người nhận'
                                                    value={formEditAddress.fullName}
                                                    onChange={handleInputChange}
                                                />
                                                <TextInput
                                                    icon={CiMail}
                                                    type='email'
                                                    name='email'
                                                    placeholder='Email người nhận'
                                                    value={formEditAddress.email}
                                                    onChange={handleInputChange}
                                                    className={`${
                                                        !validateEmail(formEditAddress.email) && formEditAddress.email
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                            : ''
                                                    }`}
                                                />
                                                {formEditAddress.email && !validateEmail(formEditAddress.email) && (
                                                    <div className='flex items-center gap-x-1 text-red-500 text-sm animate-fadeIn'>
                                                        <svg
                                                            className='w-4 h-4 flex-shrink-0'
                                                            fill='currentColor'
                                                            viewBox='0 0 20 20'
                                                        >
                                                            <path
                                                                fillRule='evenodd'
                                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                                                clipRule='evenodd'
                                                            />
                                                        </svg>
                                                        <span>Email không hợp lệ</span>
                                                    </div>
                                                )}
                                                <TextInput
                                                    icon={CiPhone}
                                                    type='text'
                                                    name='phone'
                                                    placeholder='Số điện thoại'
                                                    value={formEditAddress.phone}
                                                    onChange={handleInputChange}
                                                    className={`${
                                                        !validatePhone(formEditAddress.phone) && formEditAddress.phone
                                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                            : ''
                                                    }`}
                                                />
                                                {formEditAddress.phone && !validatePhone(formEditAddress.phone) && (
                                                    <div className='flex items-center gap-x-1 text-red-500 text-sm animate-fadeIn'>
                                                        <svg
                                                            className='w-4 h-4 flex-shrink-0'
                                                            fill='currentColor'
                                                            viewBox='0 0 20 20'
                                                        >
                                                            <path
                                                                fillRule='evenodd'
                                                                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                                                clipRule='evenodd'
                                                            />
                                                        </svg>
                                                        <span>Số điện thoại không hợp lệ</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='flex items-center gap-3 mb-4 mt-6'>
                                                <span className='w-1.5 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full' />
                                                <h4 className='text-base font-medium text-gray-700 dark:text-gray-300'>
                                                    Địa chỉ giao hàng
                                                </h4>
                                            </div>

                                            <div className='space-y-4'>
                                                <Select
                                                    placeholder='Chọn Thành Phố'
                                                    className='w-full h-10 !rounded-lg !shadow-sm hover:!border-amber-500'
                                                    options={
                                                        provinces?.map((province) => ({
                                                            label: province.ProvinceName,
                                                            value: province.ProvinceID,
                                                        })) ?? []
                                                    }
                                                    onChange={(value) => {
                                                        const selectedProvince = provinces.find(
                                                            (province) => province.ProvinceID === value,
                                                        );
                                                        setFormEditAddress(() => ({
                                                            ...formEditAddress,
                                                            address: {
                                                                ...formEditAddress.address,
                                                                province: {
                                                                    label: selectedProvince.NameExtension[1],
                                                                    value: value,
                                                                },
                                                                district: {
                                                                    label: '',
                                                                    value: null,
                                                                },
                                                                ward: {
                                                                    label: '',
                                                                    value: null,
                                                                },
                                                            },
                                                        }));
                                                    }}
                                                />

                                                <div className='grid grid-cols-2 gap-4'>
                                                    <Select
                                                        placeholder='Quận/Huyện'
                                                        className='w-full h-10 !rounded-lg !shadow-sm hover:!border-amber-500'
                                                        options={
                                                            districts?.map((district) => ({
                                                                label: district.DistrictName,
                                                                value: district.DistrictID,
                                                            })) ?? []
                                                        }
                                                        onChange={(value) => {
                                                            const selectedDistrict = districts.find(
                                                                (district) => district.DistrictID === value,
                                                            );
                                                            setFormEditAddress(() => ({
                                                                ...formEditAddress,
                                                                address: {
                                                                    ...formEditAddress.address,
                                                                    district: {
                                                                        label: selectedDistrict.NameExtension[0],
                                                                        value: value,
                                                                    },
                                                                },
                                                            }));
                                                        }}
                                                    />

                                                    <Select
                                                        placeholder='Phường/Xã'
                                                        className='w-full h-10 !rounded-lg !shadow-sm hover:!border-amber-500'
                                                        options={
                                                            wards?.map((ward) => ({
                                                                label: ward.WardName,
                                                                value: ward.WardCode,
                                                            })) ?? []
                                                        }
                                                        onChange={(value) => {
                                                            const selectedWard = wards.find(
                                                                (ward) => ward.WardCode === value,
                                                            );
                                                            setFormEditAddress(() => ({
                                                                ...formEditAddress,
                                                                address: {
                                                                    ...formEditAddress.address,
                                                                    ward: {
                                                                        label: selectedWard.NameExtension[0],
                                                                        value: value,
                                                                    },
                                                                },
                                                            }));
                                                        }}
                                                    />
                                                </div>

                                                <TextInput
                                                    type='text'
                                                    icon={CiHome}
                                                    name='street'
                                                    className='w-full'
                                                    placeholder='Số nhà, tên đường'
                                                    value={formEditAddress.address.street}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </Modal.Body>

                                    <Modal.Footer className='relative border-t border-amber-200/30 dark:border-amber-700/30'>
                                        <div className='flex items-center justify-between w-full'>
                                            <Button
                                                color='gray'
                                                onClick={() => setShowModalEditAddress(false)}
                                                className='!ring-0 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                tabIndex='-1'
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                onClick={handleConfirmInfo}
                                                className='!ring-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700'
                                            >
                                                <span className='flex items-center justify-center gap-x-2'>
                                                    Xác nhận
                                                    <svg
                                                        className='w-4 h-4'
                                                        fill='none'
                                                        stroke='currentColor'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            strokeWidth={2}
                                                            d='M5 13l4 4L19 7'
                                                        />
                                                    </svg>
                                                </span>
                                            </Button>
                                        </div>
                                    </Modal.Footer>
                                </Modal>

                                {/* Payment Methods Card */}
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-gradient-to-tr from-purple-100/20 via-amber-100/10 to-transparent rounded-3xl blur-xl' />
                                    <div className='relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-700/50 overflow-hidden'>
                                        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/50'>
                                            <div className='flex items-center gap-3 mb-6'>
                                                <div className='p-2 bg-green-100 dark:bg-green-900 rounded-lg'>
                                                    <RiCoupon3Fill className='w-6 h-6 text-green-600 dark:text-green-300' />
                                                </div>
                                                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                                                    Phương thức thanh toán
                                                </h2>
                                            </div>

                                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                                <PaymentMethod
                                                    id='cash'
                                                    label='Tiền mặt'
                                                    imageSrc='../assets/payCash.png'
                                                    selectedPayment={paymentMethod}
                                                    onSelect={handleChoosePaymentMethod}
                                                />
                                                <PaymentMethod
                                                    id='vnpay'
                                                    label='VNPAY'
                                                    imageSrc='../assets/vnpayPayment.jpg'
                                                    selectedPayment={paymentMethod}
                                                    onSelect={handleChoosePaymentMethod}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Order Summary */}
                            <div className='w-full lg:w-2/5'>
                                <div className='relative'>
                                    <div className='absolute inset-0 bg-gradient-to-tr from-amber-100/20 via-purple-100/10 to-transparent rounded-3xl blur-xl' />
                                    <div className='relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-amber-200/50 dark:border-amber-700/50'>
                                        <div className='px-8 py-6'>
                                            {/* Order Summary Header */}
                                            <div className='text-center mb-6'>
                                                <h3 className='font-serif text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 animate-shimmer'>
                                                    Thông tin đơn hàng
                                                </h3>
                                                <div className='w-28 h-0.5 mx-auto mt-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
                                            </div>

                                            {/* Products List */}
                                            <div className='space-y-6 mb-8'>
                                                {!isBuyNow ? (
                                                    productItems.map((item, index) => (
                                                        <ProductInfo_CheckoutPage
                                                            key={index}
                                                            dataProduct={{
                                                                ...item,
                                                                selectedOption: item.productItem?.option?.find(
                                                                    (opt) => opt.key === item.option,
                                                                )?.value,
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <ProductInfo_CheckoutPage
                                                        dataProduct={{
                                                            ...productItems,
                                                            selectedOption: productItems?.productItem?.option?.find(
                                                                (opt) => opt.key === checkoutData?.productItems?.option,
                                                            )?.value,
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <div className='space-y-4 border-t border-amber-200/50 dark:border-amber-700/50 py-5'>
                                                {appliedVoucher ? (
                                                    <SelectedVoucher
                                                        voucher={selectedVoucher}
                                                        onRemove={() => {
                                                            setSelectedVoucher(null);
                                                            setAppliedVoucher(null);
                                                            setVoucherPrice(0);
                                                        }}
                                                    />
                                                ) : (
                                                    <div className='flex gap-2'>
                                                        <TextInput
                                                            type='text'
                                                            placeholder='Nhập mã giảm giá'
                                                            value={voucherCode}
                                                            onChange={(e) => setVoucherCode(e.target.value)}
                                                            className='flex-1'
                                                        />
                                                        <Button
                                                            onClick={handleApplyVoucherCode}
                                                            className='!ring-0 bg-amber-500 hover:bg-amber-600'
                                                        >
                                                            Áp dụng
                                                        </Button>
                                                        <Button
                                                            onClick={() => setOpenModalVoucher(true)}
                                                            className='!ring-0 bg-blue-500 hover:bg-blue-600'
                                                        >
                                                            Chọn voucher
                                                        </Button>
                                                    </div>
                                                )}
                                                <VoucherModal
                                                    vouchers={allVouchers}
                                                    isOpen={openModalVoucher}
                                                    onClose={() => setOpenModalVoucher(false)}
                                                    onApplyVoucher={handleApplyVoucher}
                                                    totalAmount={totalPrice}
                                                    selectedVoucher={selectedVoucher}
                                                    userProvince={userProvince}
                                                />
                                            </div>

                                            {/* Price Summary */}
                                            <div className='space-y-4 border-t border-amber-200/50 dark:border-amber-700/50 pt-6'>
                                                <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                                                    <span>Tạm tính</span>
                                                    <span className='font-medium'>{formatPrice(totalPrice)}</span>
                                                </div>
                                                <div className='flex justify-between text-gray-600 dark:text-gray-400'>
                                                    <span>Phí vận chuyển</span>
                                                    <span>{formatPrice(shippingFee)}</span>
                                                </div>
                                                {appliedVoucher && voucherPrice > 0 && (
                                                    <div className='flex justify-between text-green-600'>
                                                        <span>Giảm giá</span>
                                                        <span>- {formatPrice(voucherPrice)}</span>
                                                    </div>
                                                )}
                                                <div className='flex justify-between items-center text-xl pt-3 border-t border-amber-200/30 dark:border-amber-800/30'>
                                                    <span className='font-serif text-gray-800 dark:text-gray-200 tracking-wide'>
                                                        Tổng thanh toán
                                                    </span>
                                                    <span
                                                        className='font-montserrat font-medium tracking-wide 
                                                    bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 
                                                    dark:from-amber-400 dark:via-amber-300 dark:to-amber-400 
                                                    bg-clip-text text-transparent text-2xl'
                                                    >
                                                        {formatPrice(totalAmount)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkout Button */}
                                            <button onClick={handleCreateOrder} className='w-full mt-8 relative group'>
                                                <div
                                                    className='relative px-6 py-3.5 bg-amber-500 rounded-lg 
                                                    transform transition-all duration-300 
                                                    group-hover:-translate-y-0.5 group-hover:shadow-lg
                                                    group-active:translate-y-0'
                                                >
                                                    <div className='absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                                                    <div className='absolute inset-0 rounded-lg overflow-hidden'>
                                                        <div
                                                            className='absolute top-0 left-0 w-full h-full 
                                                        bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] 
                                                    bg-[length:250%_250%,100%_100%] 
                                                    group-hover:animate-shine'
                                                        />
                                                    </div>

                                                    <div className='flex items-center justify-center gap-2'>
                                                        <span className='relative text-sm font-medium text-white tracking-wide'>
                                                            Tiến Hành Đặt Hàng
                                                        </span>
                                                        <svg
                                                            className='w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-0.5'
                                                            fill='none'
                                                            stroke='currentColor'
                                                            viewBox='0 0 24 24'
                                                        >
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                strokeWidth={2}
                                                                d='M5 13l4 4L19 7'
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyCheckout countdown={countdown} />
                )}
            </div>
        </div>
    );
}
