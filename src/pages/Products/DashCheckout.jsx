import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CiEdit, CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { FaUserEdit } from 'react-icons/fa';
import { FiCalendar, FiClock, FiTruck } from 'react-icons/fi';
import { Button, Label, Modal, Radio, Spinner, TextInput } from 'flowbite-react';
import {
    ProductInfo_CheckoutPage_Component,
    SelectedVoucher_Component,
    VoucherModal_Component,
} from '../../components/exportComponent';
import { Select } from 'antd';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { RiCoupon3Fill } from 'react-icons/ri';
import { user_UpdateProfile } from '../../services/redux/slices/userSlice';
import { resetCart } from '../../services/redux/slices/cartSlice';
import { resetCheckout, resetOrderDetail, setOrderDetail } from '../../services/redux/slices/checkoutSlice';
import { IoCartOutline } from 'react-icons/io5';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PaymentMethod = ({ id, label, imageSrc, name, selectedPayment, onSelect }) => (
    <div
        onClick={() => onSelect(id)}
        className={`cursor-pointer flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
            selectedPayment === id ? 'ring-2 ring-blue-500' : ''
        }`}
    >
        <Radio id={id} name={name} checked={selectedPayment === id} onChange={() => onSelect(id)} />
        <Label htmlFor={id} className='flex items-center gap-x-3 text-lg cursor-pointer w-full'>
            <div className='flex items-center gap-x-3 w-full'>
                <img src={imageSrc} alt={label} className='w-10 h-10 object-contain' />
                <span className='font-medium text-gray-800 dark:text-gray-200'>{label}</span>
            </div>
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
const ExpectedDeliveryTime = ({ dayOfWeek, formattedDate }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl p-6 mb-1 w-full shadow-lg'
    >
        <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-4'>
                <div className='bg-white rounded-full p-2'>
                    <FiTruck className='text-indigo-500 text-lg' />
                </div>
                <h3 className='text-xl font-bold text-white'>Đơn vị vận chuyển</h3>
            </div>
            <a
                href='https://ghn.vn/'
                target='_blank'
                rel='noreferrer'
                className='flex items-center space-x-2 cursor-pointer'
            >
                <img
                    src={'../assets/ghn_logo.webp'}
                    alt='GiaoHangNhanh Logo'
                    width={30}
                    height={30}
                    className='rounded-full'
                />
                <span className='text-white font-medium'>GiaoHangNhanh</span>
            </a>
        </div>
        <div className='bg-white bg-opacity-20 rounded-lg p-4'>
            <div className='flex items-center space-x-3 mb-2'>
                <FiCalendar className='text-white text-xl' />
                <p className='text-white font-medium'>Ngày giao dự kiến: {dayOfWeek}</p>
            </div>
            <div className='flex items-center space-x-3 mb-2'>
                <FiClock className='text-white text-xl' />
                <p className='text-white font-medium'>Thời gian: {formattedDate}</p>
            </div>
            <div className='mt-3 text-white text-sm'>
                <p>Ước tính thời gian giao hàng: 2-3 ngày làm việc</p>
                <p className='mt-1'>
                    <span className='font-bold'>Lưu ý</span>: Thời gian giao hàng có thể thay đổi tùy theo địa chỉ nhận
                    hàng và tình hình giao thông thực tế.
                </p>
            </div>
        </div>
    </motion.div>
);

export default function DashCheckout() {
    // ==================================== Redux ====================================
    const selectCheckoutData = (state) => {
        const { isBuyNow, cartItems, buyNowItem } = state.checkout;
        return isBuyNow ? buyNowItem : cartItems;
    };
    const isBuyNow = useSelector((state) => state.checkout.isBuyNow);
    const { productItems, totalPrice, totalDiscountPrice, totalQuantity } = useSelector(selectCheckoutData);
    const productInfo = useMemo(() => {
        if (Array.isArray(productItems) && totalPrice > 0) {
            return productItems.map((item) => ({
                ...item.productItem,
            }));
        } else {
            const producBuyNow = {
                productItem: productItems,
                quantity: totalQuantity,
            };
            return { ...producBuyNow };
        }
    }, [productItems, totalPrice, totalQuantity]);

    const tokenUser = useSelector((state) => state.user.access_token);
    const currentUser = useSelector((state) => state.user.user);
    const cartRedux = useSelector((state) => state.cart.cartItem);

    // ==================================== State ====================================
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formOrderResponse, setFormOrderResponse] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [urlRedirect, setUrlRedirect] = useState('');
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
    const [selectedOption, setSelectedOption] = useState('thisUser');
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName ?? '',
        email: currentUser?.email ?? '',
        phone: currentUser?.phone ?? '',
        address: {
            province: {
                label: currentUser?.address?.province.label ?? '',
                value: currentUser?.address?.province.value ?? null,
            },
            district: {
                label: currentUser?.address?.district.label ?? '',
                value: currentUser?.address?.district.value ?? null,
            },
            ward: {
                label: currentUser?.address?.ward?.label ?? '',
                value: currentUser?.address?.ward?.value ?? null,
            },
            street: currentUser?.address?.street ?? '',
            fullAddress: currentUser?.address?.fullAddress ?? '',
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
        if (totalPrice === 0) {
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
    }, [totalPrice, navigate]);

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

    // handle selected option
    useEffect(() => {
        if (selectedOption === 'anotherUser') {
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: {
                    province: { label: '', value: null },
                    district: { label: '', value: null },
                    ward: { label: '', value: null },
                    street: '',
                    fullAddress: '',
                },
            });
        } else {
            setFormData({
                fullName: currentUser?.fullName ?? '',
                email: currentUser?.email ?? '',
                phone: currentUser?.phone ?? '',
                address: {
                    province: {
                        label: currentUser?.address?.province.label ?? '',
                        value: currentUser?.address?.province.value ?? null,
                    },
                    district: {
                        label: currentUser?.address?.district.label ?? '',
                        value: currentUser?.address?.district.value ?? null,
                    },
                    ward: {
                        label: currentUser?.address?.ward?.label ?? '',
                        value: currentUser?.address?.ward?.value ?? null,
                    },
                    street: currentUser?.address?.street ?? '',
                    fullAddress: currentUser?.address?.fullAddress ?? '',
                },
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOption]);

    // get all vouchers from API
    useEffect(() => {
        if (totalPrice === 0) return;
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
    }, [totalPrice]);

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ==================================== Address ====================================
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // get province from api
    useEffect(() => {
        if (totalPrice === 0) return;
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
            if (!formData?.address.province?.value) return;
            try {
                const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                    params: { province_id: formData.address.province.value },
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
    }, [formData?.address.province?.value]);

    // get ward from api
    useEffect(() => {
        const getWard = async () => {
            if (!formData?.address.district?.value) return;
            try {
                const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                    params: { district_id: formData.address.district.value },
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
    }, [formData?.address.district?.value]);

    // handle confirm info
    const handleConfirmInfo = () => {
        if (
            !formData.fullName ||
            !formData.email ||
            !formData.phone ||
            !formData.address.ward ||
            !formData.address.district ||
            !formData.address.province
        ) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const newAddress = `${formData.address.street}, ${formData.address.ward.label}, ${formData.address.district.label}, ${formData.address.province.label}`;
        setInfoItemData({
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: newAddress,
        });
        setShowModalEditAddress(false);

        // save info user if user choose 'thisUser' option in modal edit address
        if (selectedOption === 'thisUser') {
            const handleSaveInfoUser = async () => {
                const dataUpdate = {
                    avatarImg: currentUser.avatarImg,
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                        province: {
                            label: formData.address.province.label,
                            value: formData.address.province.value,
                        },
                        district: {
                            label: formData.address.district.label,
                            value: formData.address.district.value,
                        },
                        ward: {
                            label: formData.address.ward.label,
                            value: formData.address.ward.value,
                        },
                        street: formData.address.street,
                        fullAddress: newAddress,
                    },
                };
                try {
                    const res = await axios.put(
                        `${import.meta.env.VITE_API_URL}/api/profile/update`,
                        {
                            ...dataUpdate,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${tokenUser}`,
                            },
                        },
                    );
                    if (res?.status === 200) {
                        const { data } = res;
                        toast.success('Cập nhật thông tin thành công!');
                        dispatch(
                            user_UpdateProfile({
                                user: data,
                            }),
                        );
                    }
                } catch (error) {
                    console.log('Error save info user', error);
                    toast.error('Lỗi hệ thống. Vui lòng thử lại sau');
                }
            };
            handleSaveInfoUser();
        }
    };

    // ==================================== Call API GNH ====================================
    const totalWeight = useMemo(() => {
        if (Array.isArray(productItems) && totalPrice > 0) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.weight, 0));
        } else {
            return Math.ceil(productItems.weight);
        }
    }, [productItems, totalPrice]);
    const totalHeight = useMemo(() => {
        if (Array.isArray(productItems) && totalPrice > 0) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.height, 0) / 10);
        } else {
            return Math.ceil(productItems.height);
        }
    }, [productItems, totalPrice]);
    const totalLength = useMemo(() => {
        if (Array.isArray(productItems) && totalPrice > 0) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.length, 0) / 10);
        } else {
            return Math.ceil(productItems.length);
        }
    }, [productItems, totalPrice]);
    const totalWidth = useMemo(() => {
        if (Array.isArray(productItems) && totalPrice > 0) {
            return Math.ceil(productItems.reduce((total, item) => total + item.productItem.width, 0) / 10);
        } else {
            return Math.ceil(productItems.width);
        }
    }, [productItems, totalPrice]);

    // calculate fee ship
    useEffect(() => {
        if (totalPrice === 0) return;
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
                        setShippingFee(data.service_fee);
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
        if (totalPrice === 0) return;
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
    const handleChoosePaymentMethod = (idMethod) => {
        setPaymentMethod(idMethod);
    };

    // handle select voucher in modal vouchers
    const handleApplyVoucher = useCallback(
        (voucher) => {
            if (voucher) {
                setSelectedVoucher(voucher);
                setAppliedVoucher(voucher.couponCode);
                const discountPrice = totalPrice * (voucher.discount / 100);
                setVoucherPrice(discountPrice);
            } else {
                setSelectedVoucher(null);
                setAppliedVoucher(null);
                setVoucherPrice(0);
            }
        },
        [totalPrice],
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
    const totalAmount = useMemo(
        () => totalPrice + shippingFee - totalDiscountPrice - (appliedVoucher ? voucherPrice : 0),
        [totalPrice, shippingFee, totalDiscountPrice, appliedVoucher, voucherPrice],
    );

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
                        quantity: totalQuantity,
                        couponCode: appliedVoucher,
                        profile: {
                            name: formData.fullName,
                            phone: formData.phone,
                            email: formData.email,
                            address: {
                                province: {
                                    label: formData.address.province.label,
                                    value: formData.address.province.value,
                                },
                                district: {
                                    label: formData.address.district.label,
                                    value: formData.address.district.value,
                                },
                                ward: {
                                    label: formData.address.ward.label,
                                    value: formData.address.ward.value,
                                },
                                fullAddress: formData.address.fullAddress,
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
                        productId: productItems.id,
                        paymentMethod: paymentMethod,

                        shippingPrice: shippingFee,
                        couponCode: appliedVoucher,
                        profile: {
                            name: formData.fullName,
                            phone: formData.phone,
                            email: formData.email,
                            address: {
                                province: {
                                    label: formData.address.province.label,
                                    value: formData.address.province.value,
                                },
                                district: {
                                    label: formData.address.district.label,
                                    value: formData.address.district.value,
                                },
                                ward: {
                                    label: formData.address.ward.label,
                                    value: formData.address.ward.value,
                                },
                                fullAddress: formData.address.fullAddress,
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
                toast.error('Lỗi hệ thống. Trang sẽ tải lại sau 3 giây');
                setTimeout(() => window.location.reload(), 3000);
            } finally {
                setIsLoading(false);
            }
        }
    };

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
        <div className='w-full min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 lg:p-8'>
            <div className='max-w-7xl mx-auto'>
                {totalPrice > 0 ? (
                    <div className='flex flex-col lg:flex-row gap-8'>
                        {/* Left Column */}
                        <div className='w-full lg:w-3/5 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
                            <div className='mb-6'>
                                <div className='space-y-4 dark:bg-gray-800 p-6 rounded-xl'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='font-semibold text-xl text-gray-700 dark:text-gray-300 mb-4'>
                                            Thông tin người nhận
                                        </h3>
                                        <Button onClick={() => setShowModalEditAddress(true)} size='sm' outline>
                                            <CiEdit className='mr-2 mt-1' />
                                            Chỉnh sửa thông tin
                                        </Button>
                                    </div>
                                    <InfoItem icon={CiUser} label='Họ và Tên' value={infoItemData.fullName} />
                                    <InfoItem icon={CiMail} label='Email' value={infoItemData.email} />
                                    <InfoItem icon={CiPhone} label='Số điện thoại' value={infoItemData.phone} />
                                    <InfoItem icon={CiHome} label='Địa chỉ nhận hàng' value={infoItemData.address} />
                                </div>
                            </div>

                            <div className='mb-8'>
                                <h3 className='font-semibold text-xl text-gray-800 dark:text-gray-200 mb-6'>
                                    Phương thức thanh toán
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <PaymentMethod
                                        selectedPayment={paymentMethod}
                                        onSelect={handleChoosePaymentMethod}
                                        id='cash'
                                        name='paymentMethod'
                                        label='Tiền mặt'
                                        imageSrc='../assets/payCash.png'
                                    />
                                    <PaymentMethod
                                        selectedPayment={paymentMethod}
                                        onSelect={handleChoosePaymentMethod}
                                        id='vnpay'
                                        name='paymentMethod'
                                        label='VNPAY'
                                        imageSrc='../assets/vnpayPayment.jpg'
                                    />
                                    <PaymentMethod
                                        selectedPayment={paymentMethod}
                                        onSelect={handleChoosePaymentMethod}
                                        id='momo'
                                        name='paymentMethod'
                                        label='Ví Momo'
                                        imageSrc='../assets/momoPayment.png'
                                    />
                                    <PaymentMethod
                                        selectedPayment={paymentMethod}
                                        onSelect={handleChoosePaymentMethod}
                                        id='credit'
                                        name='paymentMethod'
                                        label='Thẻ tín dụng/Ghi nợ'
                                        imageSrc='../assets/creditCard.png'
                                    />
                                </div>
                            </div>

                            <Modal show={showModalEditAddress} onClose={() => setShowModalEditAddress(false)} size='md'>
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
                                            <Label htmlFor='thisUser' className='text-gray-700 dark:text-gray-300'>
                                                Thông tin của tôi
                                            </Label>
                                        </div>
                                        <div className='flex items-center gap-x-2'>
                                            <Radio
                                                id='anotherUser'
                                                checked={selectedOption === 'anotherUser'}
                                                onChange={() => setSelectedOption('anotherUser')}
                                            />
                                            <Label htmlFor='anotherUser' className='text-gray-700 dark:text-gray-300'>
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
                                            value={formData.address.province.label || null}
                                            onChange={(value) => {
                                                const selectedProvince = provinces.find(
                                                    (province) => province.ProvinceID === value,
                                                );
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        province: {
                                                            label: selectedProvince.NameExtension[1],
                                                            value: value,
                                                        },
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
                                            value={formData.address.district.label || null}
                                            onChange={(value) => {
                                                const selectedDistrict = districts.find(
                                                    (district) => district.DistrictID === value,
                                                );
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        district: {
                                                            label: selectedDistrict.NameExtension[0],
                                                            value: value,
                                                        },
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
                                            value={formData.address.ward.label || null}
                                            onChange={(value) => {
                                                const selectedWard = wards.find((ward) => ward.WardCode === value);
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        ward: {
                                                            label: selectedWard.NameExtension[0],
                                                            value: value,
                                                        },
                                                    },
                                                });
                                            }}
                                        />

                                        <TextInput
                                            type='text'
                                            className='w-full'
                                            placeholder='Số nhà, tên đường'
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: {
                                                        ...formData.address,
                                                        street: e.target.value,
                                                    },
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
                                <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-5'>
                                    Thông tin đơn hàng
                                </h2>
                                <ExpectedDeliveryTime dayOfWeek={dayOfWeek} formattedDate={formattedDate} />
                            </div>
                            <div className='space-y-4 rounded-lg my-5'>
                                {Array.isArray(productItems) ? (
                                    productInfo.map((_, index) => {
                                        return (
                                            <ProductInfo_CheckoutPage_Component
                                                key={index}
                                                dataProduct={productItems[index]}
                                            />
                                        );
                                    })
                                ) : (
                                    <ProductInfo_CheckoutPage_Component dataProduct={productInfo} />
                                )}
                            </div>
                            <div className='mb-5'>
                                {selectedVoucher ? (
                                    <SelectedVoucher_Component
                                        voucher={selectedVoucher}
                                        onRemove={() => setSelectedVoucher(null)}
                                    />
                                ) : (
                                    <>
                                        <div className='flex items-center mb-2'>
                                            <TextInput
                                                type='text'
                                                placeholder='Nhập mã khuyến mãi'
                                                className='flex-grow mr-2'
                                                value={voucherCode}
                                                onChange={(e) => setVoucherCode(e.target.value)}
                                            />
                                            <Button onClick={handleApplyVoucherCode} color='blue'>
                                                Áp dụng
                                            </Button>
                                        </div>
                                        <div
                                            onClick={() => setOpenModalVoucher(true)}
                                            className='flex items-center gap-x-1 cursor-pointer'
                                        >
                                            <RiCoupon3Fill className='text-blue-600 text-sm' />
                                            <button
                                                className='text-blue-600 hover:text-blue-800 
                                dark:text-blue-400 dark:hover:text-blue-300 text-sm'
                                            >
                                                Chọn mã khuyến mãi khác
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                            <VoucherModal_Component
                                isOpen={openModalVoucher}
                                onClose={() => setOpenModalVoucher(false)}
                                onApplyVoucher={handleApplyVoucher}
                                totalAmount={totalAmount}
                                vouchers={allVouchers}
                            />
                            <div className='space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600 dark:text-gray-400'>Tạm tính</span>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600 dark:text-gray-400'>Phí vận chuyển</span>
                                    <span className='font-semibold text-gray-800 dark:text-gray-200'>
                                        {formatPrice(shippingFee)}
                                    </span>
                                </div>
                                {appliedVoucher && voucherPrice !== 0 && (
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600 dark:text-gray-400'>
                                            Giảm giá phí vận chuyển
                                        </span>
                                        <span className='font-semibold text-green-500'>
                                            - {formatPrice(voucherPrice)}
                                        </span>
                                    </div>
                                )}
                                {totalDiscountPrice > 0 && (
                                    <div className='flex justify-between'>
                                        <span className='text-gray-600 dark:text-gray-400'>Giảm giá từ Deal</span>
                                        <span className='font-semibold text-green-500'>
                                            - {formatPrice(totalDiscountPrice)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='border-t border-gray-200 dark:border-gray-700 pt-4 mt-4'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                                        Tổng cộng
                                    </span>
                                    <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                                        {formatPrice(totalAmount)}
                                    </span>
                                </div>
                                <p className='text-sm text-gray-500 dark:text-gray-400 mb-3 text-end mt-1'>
                                    (Đã bao gồm thuế VAT)
                                </p>
                                <Button onClick={handleCreateOrder} color='blue' size='lg' className='w-full'>
                                    Đặt hàng
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='min-h-[60vh] flex flex-col items-center justify-center p-8'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className='relative'
                        >
                            <div className='absolute -top-2 -right-2'>
                                <span className='relative flex h-4 w-4'>
                                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                                    <span className='relative inline-flex rounded-full h-4 w-4 bg-blue-500'></span>
                                </span>
                            </div>
                            <IoCartOutline className='w-32 h-32 text-gray-400 mb-4' />
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className='text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center'
                        >
                            Giỏ hàng của bạn đang trống
                        </motion.h2>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className='text-gray-500 dark:text-gray-400 text-center mb-8 flex items-center gap-2'
                        >
                            Đang chuyển hướng đến trang sản phẩm... <span>({countdown}s)</span>
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className='w-32 h-1 bg-gray-200 rounded-full'
                        >
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 5 }}
                                className='h-full bg-blue-500 rounded-full'
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
