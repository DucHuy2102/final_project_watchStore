import axios from 'axios';
import { Button, Modal, TextInput } from 'flowbite-react';
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { CiHome, CiUser } from 'react-icons/ci';
import { PiHouseLineLight } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { user_UpdateAddress } from '../../../redux/slices/userSlice';

export default function DeliveryTo() {
    // get user from redux store to display the current user's address
    const tokenUser = useSelector((state) => state.user.access_token);
    const currentUser = useSelector((state) => state.user.user);

    // states
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
                    console.log('district', res.data.data);
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

    const handleUpdateAddress = async () => {
        const newAddress = `${formAddress.street}, ${formAddress.ward.label}, ${formAddress.district.label}, ${formAddress.province.label}`;
        setShowModalChangeAddress(false);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/profile/update`,
                newAddress,
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                }
            );
            if (res?.status === 200) {
                const { data } = res;
                toast.success('Cập nhật địa chỉ giao hàng thành công!');
                dispatch(user_UpdateAddress({ address: data }));
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
                className='w-full shadow-sm border border-gray-200 dark:border-none dark:bg-gray-800 
                                rounded-lg p-6 flex flex-col justify-center gap-y-2'
            >
                <div className='flex items-center justify-between'>
                    <span className='text-gray-600 dark:text-gray-400 font-semibold'>Giao tới</span>
                    <span
                        onClick={() => setShowModalChangeAddress(true)}
                        className='cursor-pointer text-blue-600 hover:underline'
                    >
                        Thay đổi
                    </span>
                </div>
                <div className='w-full flex items-center gap-x-2'>
                    <CiUser className='text-blue-700 bg-blue-300 rounded-md p-[1px] h-5 w-8' />
                    <span className='flex flex-wrap text-md font-semibold'>
                        {currentUser.fullName}{' '}
                        <span className='border border-gray-300 dark:border-gray-600 mx-2' />
                        {currentUser.phone}
                    </span>
                </div>
                <div className='w-full flex items-start gap-x-2'>
                    <CiHome className='text-green-700 bg-green-300 rounded-md p-[1px] h-5 w-8' />
                    <span className='w-3/4 text-sm tracking-wide font-medium'>
                        {currentUser.address}
                    </span>
                </div>
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
                            showSearch='true'
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
                            showSearch
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
                            showSearch
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
