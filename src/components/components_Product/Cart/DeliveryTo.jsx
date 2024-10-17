import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Select } from 'antd';
import { Button, Modal, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import { CiEdit } from 'react-icons/ci';
import { FaUser, FaPhone, FaHouseUser } from 'react-icons/fa';
import { PiHouseLineLight } from 'react-icons/pi';
import { user_UpdateProfile } from '../../../redux/slices/userSlice';

const useAddressData = () => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProvinces = useCallback(async () => {
        setIsLoading(true);
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
            console.error('Error fetching provinces:', error);
            toast.error('Không thể tải danh sách tỉnh/thành phố');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchDistricts = useCallback(async (provinceId) => {
        if (!provinceId) return;
        setIsLoading(true);
        try {
            const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', {
                params: { province_id: provinceId },
                headers: {
                    Token: import.meta.env.VITE_TOKEN_GHN,
                },
            });
            if (res?.status === 200) {
                setDistricts(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching districts:', error);
            toast.error('Không thể tải danh sách quận/huyện');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchWards = useCallback(async (districtId) => {
        if (!districtId) return;
        setIsLoading(true);
        try {
            const res = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', {
                params: { district_id: districtId },
                headers: {
                    Token: import.meta.env.VITE_TOKEN_GHN,
                },
            });
            if (res?.status === 200) {
                setWards(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching wards:', error);
            toast.error('Không thể tải danh sách phường/xã');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { provinces, districts, wards, isLoading, fetchProvinces, fetchDistricts, fetchWards };
};

const useAddressForm = (tokenUser, onSuccess, onError) => {
    const [formAddress, setFormAddress] = useState({
        province: { label: '', value: null },
        district: { label: '', value: null },
        ward: { label: '', value: null },
        street: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateAddress = async () => {
        setIsUpdating(true);
        const newAddress = `${formAddress.street}, ${formAddress.ward.label}, ${formAddress.district.label}, ${formAddress.province.label}`;
        try {
            const { street, ...addressUpdated } = formAddress;
            const addressUpdate = {
                ...addressUpdated,
                fullAddress: newAddress,
            };

            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/profile/update-address`,
                { ...addressUpdate },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                onSuccess({
                    user: res.data,
                    address: {
                        province: formAddress.province,
                        district: formAddress.district,
                        ward: formAddress.ward,
                        street: formAddress.street,
                        fullAddress: newAddress,
                    },
                });
            }
        } catch (error) {
            onError(error);
        } finally {
            setIsUpdating(false);
            setFormAddress({
                province: { label: '', value: null },
                district: { label: '', value: null },
                ward: { label: '', value: null },
                street: '',
            });
        }
    };

    return { formAddress, setFormAddress, handleUpdateAddress, isUpdating };
};

const AddressItem = ({ icon, text, placeholder, bgColor }) => (
    <div className='flex items-start space-x-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600'>
        <div className='flex-shrink-0 pt-1'>
            <div className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}>{icon}</div>
        </div>
        <div className='flex-grow'>
            <p className='text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed'>
                {text || placeholder}
            </p>
        </div>
    </div>
);

const AddressDisplay = ({ currentUser, onChangeAddress }) => (
    <div className='p-6 space-y-5'>
        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4'>
            <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200'>Địa chỉ giao hàng</h3>
            <button
                onClick={onChangeAddress}
                className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-2 transition-all duration-200 group'
                aria-label='Thay đổi địa chỉ'
            >
                <CiEdit
                    className='w-4 h-4 transition-transform duration-200 group-hover:rotate-12'
                    aria-hidden='true'
                />
                <span className='font-medium group-hover:underline'>Thay đổi</span>
            </button>
        </div>

        <div className='space-y-2'>
            <AddressItem
                icon={<FaUser className='w-5 h-5 text-blue-600 dark:text-blue-400' />}
                text={currentUser?.fullName}
                placeholder='Chưa cập nhật'
                bgColor='bg-blue-100 dark:bg-blue-900'
            />
            <AddressItem
                icon={<FaPhone className='w-5 h-5 text-green-600 dark:text-green-400' />}
                text={currentUser?.phone}
                placeholder='Chưa cập nhật'
                bgColor='bg-green-100 dark:bg-green-900'
            />
            <AddressItem
                icon={<FaHouseUser className='w-5 h-5 text-yellow-600 dark:text-yellow-400' />}
                text={currentUser?.address?.fullAddress}
                placeholder='Chưa cập nhật'
                bgColor='bg-yellow-100 dark:bg-yellow-900'
            />
        </div>
    </div>
);

const AddressModal = ({
    show,
    onClose,
    formAddress,
    setFormAddress,
    handleUpdateAddress,
    provinces,
    districts,
    wards,
    isLoading,
}) => (
    <Modal show={show} onClose={onClose} size='md' popup>
        <Modal.Header />
        <Modal.Body>
            <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                <PiHouseLineLight className='text-blue-500 text-5xl mx-auto' aria-hidden='true' />
                <span className='text-lg font-medium text-black'>Cập nhật địa chỉ của bạn</span>
                <Select
                    placeholder='Chọn Thành Phố'
                    className='w-full h-10'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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
                                label: provinces.find((province) => province.ProvinceID === value).NameExtension[1],
                                value: value,
                            },
                            district: { label: '', value: null },
                            ward: { label: '', value: null },
                        });
                    }}
                    value={formAddress.province.value}
                    disabled={isLoading}
                />
                <Select
                    placeholder='Chọn Quận/Huyện'
                    className='w-full h-10'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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
                                label: districts.find((district) => district.DistrictID === value).NameExtension[0],
                                value: value,
                            },
                            ward: { label: '', value: null },
                        });
                    }}
                    value={formAddress.district.value}
                    disabled={!formAddress.province.value || isLoading}
                />
                <Select
                    placeholder='Chọn Phường/Xã'
                    className='w-full h-10'
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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
                                label: wards.find((ward) => ward.WardCode === value).NameExtension[0],
                                value: value,
                            },
                        });
                    }}
                    value={formAddress.ward.value}
                    disabled={!formAddress.district.value || isLoading}
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
                    disabled={isLoading}
                />

                {formAddress.street &&
                    formAddress.ward.value &&
                    formAddress.district.value &&
                    formAddress.province.value && (
                        <div className='w-full p-2 border rounded-lg text-center'>
                            <h4 className='font-semibold text-gray-800'>Địa chỉ của bạn:</h4>
                            <p className='text-gray-600 break-words text-ellipsis overflow-hidden'>
                                {`${formAddress.street}, ${formAddress.ward.label},
                            ${formAddress.district.label},
                            ${formAddress.province.label}`}
                            </p>
                        </div>
                    )}

                <div className='w-full flex justify-between items-center'>
                    <Button color='gray' onClick={onClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button color='blue' onClick={handleUpdateAddress} disabled={isLoading}>
                        {isLoading ? 'Đang cập nhật...' : 'Xác nhận'}
                    </Button>
                </div>
            </div>
        </Modal.Body>
    </Modal>
);

export default function DeliveryTo() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { tokenUser, currentUser } = useSelector((state) => ({
        tokenUser: state.user.access_token,
        currentUser: state.user.user,
    }));

    const [showModalChangeAddress, setShowModalChangeAddress] = useState(false);

    const {
        provinces,
        districts,
        wards,
        isLoading: isLoadingAddress,
        fetchProvinces,
        fetchDistricts,
        fetchWards,
    } = useAddressData();

    const { formAddress, setFormAddress, handleUpdateAddress, isUpdating } = useAddressForm(
        tokenUser,
        (data) => {
            toast.success('Cập nhật địa chỉ giao hàng thành công!');
            dispatch(user_UpdateProfile(data));
            setShowModalChangeAddress(false);
        },
        (error) => {
            toast.error('Cập nhật địa chỉ thất bại. Vui lòng thử lại.');
            console.error('Error updating address:', error);
        },
    );

    const checkedUser = useMemo(() => currentUser?.fullName || currentUser?.address, [currentUser]);

    const handleChangeAddress = useCallback(() => {
        setShowModalChangeAddress(true);
        if (checkedUser) {
            navigate('/dashboard?tab=profile');
        }
        fetchProvinces();
    }, [checkedUser, navigate, fetchProvinces]);

    useEffect(() => {
        if (formAddress.province.value) {
            fetchDistricts(formAddress.province.value);
        }
    }, [formAddress.province.value, fetchDistricts]);

    useEffect(() => {
        if (formAddress.district.value) {
            fetchWards(formAddress.district.value);
        }
    }, [formAddress.district.value, fetchWards]);

    return (
        <>
            <div
                className='bg-white dark:bg-gray-800 w-full rounded-lg shadow-sm overflow-hidden 
                border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md'
            >
                {checkedUser ? (
                    <div className='p-6 space-y-5'>
                        <div className='flex flex-col items-center justify-between'>
                            <h3 className='text-lg font-bold text-gray-800 dark:text-gray-200'>
                                Cập nhật địa chỉ giao hàng
                            </h3>
                            <Button className='w-full mt-3' onClick={handleChangeAddress}>
                                <div className='flex items-center justify-center gap-x-1'>
                                    <CiEdit className='w-4 h-4 transition-transform duration-200 group-hover:rotate-12' />
                                    <span className='font-medium group-hover:underline'>Cập nhật</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <AddressDisplay currentUser={currentUser} onChangeAddress={handleChangeAddress} />
                )}
            </div>

            <AddressModal
                show={showModalChangeAddress}
                onClose={() => setShowModalChangeAddress(false)}
                formAddress={formAddress}
                setFormAddress={setFormAddress}
                handleUpdateAddress={handleUpdateAddress}
                provinces={provinces}
                districts={districts}
                wards={wards}
                isLoading={isLoadingAddress || isUpdating}
            />
        </>
    );
}
