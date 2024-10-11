import axios from 'axios';
import { Button, Modal, TextInput } from 'flowbite-react';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { PiHouseLineLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { user_UpdateProfile } from '../../../redux/slices/userSlice';
import { FaHouseUser, FaPhone, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function DeliveryTo() {
    // get user from redux store to display the current user's address
    const tokenUser = useSelector((state) => state.user.access_token ?? '');
    const currentUser = useSelector((state) => state.user.user ?? {});
    const address = useSelector((state) => state.user.address ?? {});
    const { id, access_token, admin, state, username, verified, ...rest } = currentUser;
    const checkedUser =
        currentUser.fullName === 'unknow' || currentUser.address === 'unknow' ? true : false;

    // states
    const navigate = useNavigate();
    const [showModalChangeAddress, setShowModalChangeAddress] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [formAddress, setFormAddress] = useState({
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
    });
    const dispatch = useDispatch();

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

    // handle update address to api and redux store
    const handleUpdateAddress = async () => {
        const newAddress = `${formAddress.street}, ${formAddress.ward.label}, ${formAddress.district.label}, ${formAddress.province.label}`;
        setShowModalChangeAddress(false);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/profile/update`,
                { ...rest, address: newAddress },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                }
            );
            if (res?.status === 200) {
                const { data } = res;
                toast.success('Cập nhật địa chỉ giao hàng thành công!');
                dispatch(
                    user_UpdateProfile({
                        user: data,
                        address: {
                            province: {
                                label: formAddress.province.label,
                                value: formAddress.province.value,
                            },
                            district: {
                                label: formAddress.district.label,
                                value: formAddress.district.value,
                            },
                            ward: {
                                label: formAddress.ward.label,
                                value: formAddress.ward.value,
                            },
                            street: formAddress.street,
                            fullAddress: newAddress,
                        },
                    })
                );
            }
        } catch (error) {
            console.log('Error update address', error);
        } finally {
            setFormAddress({
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
            });
        }
    };

    return (
        <>
            <div
                className='bg-white dark:bg-gray-800 w-full rounded-lg shadow-sm overflow-hidden 
            border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md'
            >
                {checkedUser ? (
                    <div className='p-6 space-y-5'>
                        <div className='flex flex-col items-center justify-between '>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200'>
                                Cập nhật địa chỉ giao hàng
                            </h3>
                            <Button
                                className='w-full mt-3'
                                onClick={() => {
                                    setShowModalChangeAddress(true);
                                    navigate('/dashboard?tab=profile');
                                }}
                            >
                                <div className='flex items-center justify-center gap-x-1'>
                                    <CiEdit className='w-4 h-4 transition-transform duration-200 group-hover:rotate-12' />
                                    <span className='font-medium group-hover:underline'>
                                        Cập nhật
                                    </span>
                                </div>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='p-6 space-y-5'>
                        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4'>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200'>
                                Địa chỉ giao hàng
                            </h3>
                            <button
                                onClick={() => setShowModalChangeAddress(true)}
                                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-2 transition-all duration-200 group'
                            >
                                <CiEdit className='w-4 h-4 transition-transform duration-200 group-hover:rotate-12' />
                                <span className='font-medium group-hover:underline'>Thay đổi</span>
                            </button>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'>
                                <div className='flex-shrink-0'>
                                    <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center'>
                                        <FaUser className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                                    </div>
                                </div>
                                <div className='flex-grow'>
                                    <p className='text-lg font-medium text-gray-800 dark:text-gray-200'>
                                        {currentUser?.fullName || 'Chưa cập nhật'}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'>
                                <div className='flex-shrink-0'>
                                    <div className='w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center'>
                                        <FaPhone className='w-5 h-5 text-green-600 dark:text-green-400' />
                                    </div>
                                </div>
                                <div className='flex-grow'>
                                    <p className='text-lg font-medium text-gray-700 dark:text-gray-300'>
                                        {currentUser?.phone}
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'>
                                <div className='flex-shrink-0 pt-1'>
                                    <div className='w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center'>
                                        <FaHouseUser className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />
                                    </div>
                                </div>
                                <div className='flex-grow'>
                                    <p className='text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed'>
                                        {currentUser?.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal change address */}
            <Modal
                show={showModalChangeAddress}
                onClose={() => setShowModalChangeAddress(false)}
                size='md'
                popup
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                        <PiHouseLineLight className='text-blue-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>
                            Cập nhật địa chỉ của bạn
                        </span>
                        <Select
                            placeholder='Chọn Thành Phố'
                            className='w-full h-10'
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
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
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
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
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
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
                                        label: wards.find((ward) => ward.WardCode === value)
                                            .NameExtension[0],
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

                        {/* Display the formatted address */}
                        {formAddress.street &&
                            formAddress.ward &&
                            formAddress.district &&
                            formAddress.province && (
                                <div className='w-full p-2 border rounded-lg text-center'>
                                    <h4 className='font-semibold text-gray-800'>
                                        Địa chỉ của bạn:
                                    </h4>
                                    <p className='text-gray-600 break-words text-ellipsis overflow-hidden'>
                                        {`${formAddress.street}, ${formAddress.ward.label},
                                            ${formAddress.district.label},
                                            ${formAddress.province.label}`}
                                    </p>
                                </div>
                            )}

                        <div className='w-full flex justify-between items-center'>
                            <Button color='gray' onClick={() => setShowModalChangeAddress(false)}>
                                Hủy
                            </Button>
                            <Button color='blue' onClick={handleUpdateAddress}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
