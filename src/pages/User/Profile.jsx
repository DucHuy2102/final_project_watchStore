import { Alert, Button, Card, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TfiLock } from 'react-icons/tfi';
import { PiHouseLineLight } from 'react-icons/pi';
import { Select, Tooltip } from 'antd';
import { FaBan, FaEnvelope, FaHome, FaPhone, FaUser } from 'react-icons/fa';
import { user_SignOut, user_UpdateProfile } from '../../services/redux/slices/userSlice';
import { PasswordStrengthMeter } from '../Auth/components/exportCom_Auth';
import { resetCart } from '../../services/redux/slices/cartSlice';
import { resetCheckout } from '../../services/redux/slices/checkoutSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { clearLikedProducts } from '../../services/redux/slices/productSlice';

const handleUploadToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', `${import.meta.env.VITE_CLOUDINARY_PRESETS_NAME}`);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            },
        );
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Lỗi khi upload:', error);
        toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
        return null;
    }
};

export default function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser, access_token: tokenUser } = useSelector((state) => state.user);

    // states
    const fileRef = useRef();
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: currentUser?.fullName ?? '',
        email: currentUser?.email ?? '',
        phone: currentUser?.phone ?? '',
        avatarImg: currentUser?.avatarImg ?? '/assets/default_Avatar.jpg',
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
    const [loading, setLoading] = useState(false);
    const modalRef = useRef();
    const [showModalLogout, setShowModalLogout] = useState(false);

    // change password states
    const [modalVerifyResetPassword, setModalVerifyResetPassword] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [formPassword, setFormPassword] = useState({
        oldPassword: '',
        newPassword: '',
        verifyPassword: '',
    });
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [checkPasswordFail, setCheckPasswordFail] = useState(false);
    const [codeVerifyPassword, setCodeVerifyPassword] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // change address states
    const [modalChangeAddress, setModalChangeAddress] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // loading screen effect
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // ======================================== Fetch API ========================================
    // upload image to cloudinary
    useEffect(() => {
        const uploadImage = async () => {
            if (!imgFile) return;

            setImgUploadProgress(1);
            try {
                const uploadedUrl = await handleUploadToCloudinary(imgFile);
                if (uploadedUrl) {
                    setImgURL(uploadedUrl);
                    setFormData({ ...formData, avatarImg: uploadedUrl });
                    setImgUploadProgress(100);
                } else {
                    setImgUploadProgress(null);
                    setImgFile(null);
                    setImgURL(null);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
                setImgUploadProgress(null);
                setImgFile(null);
                setImgURL(null);
            }
        };

        uploadImage();
    }, [imgFile]);

    // get province from api
    useEffect(() => {
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

    // ======================================== Update user ========================================
    // handle change avatar function
    const handleChangeAvatar = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            setImgURL(URL.createObjectURL(file));
        }
    };

    // update user profile function
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (imgUploadProgress && imgUploadProgress < 100) {
            toast.error('Xin chờ hệ thống đang tải ảnh !!!');
            return;
        }

        try {
            const { street, ...updatedFormData } = formData.address;
            const dataUpdate = {
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                avatarImg: imgURL ?? formData.avatarImg,
                address: {
                    ...updatedFormData,
                },
            };
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
            toast.error('Hệ thống đang bận, vui lòng thử lại sau');
            console.log(error);
        }
    };

    // loading
    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        );
    }

    // ======================================== Reset password user ========================================
    // get strength of password
    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    // verify password function
    const handleVerifyResetPassword = async () => {
        if (!formPassword.oldPassword) {
            toast.error('Vui lòng nhập mật khẩu!');
            return;
        }
        try {
            setLoadingPassword(true);
            setModalVerifyResetPassword(false);
            setCheckPasswordFail(false);
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/profile/check-password`,
                { password: formPassword.oldPassword },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                setCodeVerifyPassword(res.data.code);
                setModalChangePassword(true);
                setLoadingPassword(false);
            }
        } catch (error) {
            console.log(error);
            setCheckPasswordFail(true);
        } finally {
            setFormPassword({ oldPassword: '', newPassword: '', verifyPassword: '' });
            setLoadingPassword(false);
        }
    };

    // reset password function
    const handleResetPassword = async () => {
        if (!formPassword.newPassword || !formPassword.verifyPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
                code: codeVerifyPassword,
                newPassword: formPassword.newPassword,
            });
            if (res?.status === 200) {
                toast.success('Đặt lại mật khẩu thành công!');
                setTimeout(() => {
                    dispatch(user_SignOut());
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            toast.error('Hệ thống đang bận, vui lòng thử lại!');
            console.log(error);
        }
    };

    // navigate to login page
    const handleNavigateUser = () => {
        dispatch(user_SignOut());
    };

    // ======================================== Update address user ========================================
    // update address function
    const handleUpdateAddress = async () => {
        if (
            !formData?.address.street ||
            !formData?.address.ward.label ||
            !formData?.address.district.label ||
            !formData?.address.province.label
        ) {
            toast.error('Vui lòng nhập đầy đủ thông tin địa chỉ!');
        } else {
            const newAddress = `${formData?.address.street}, ${formData?.address.ward.label}, ${formData?.address.district.label}, ${formData?.address.province.label}`;
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    fullAddress: newAddress,
                },
            });
            setModalChangeAddress(false);
        }
    };

    const handleSignOutAccount = async () => {
        dispatch(user_SignOut());
        dispatch(resetCart());
        dispatch(resetCheckout());
        dispatch(clearLikedProducts());
    };

    return (
        <div className='w-full flex justify-center items-center'>
            <Card className='max-w-4xl w-full mt-5 p-10 border-0'>
                <h1 className='text-center font-bold text-3xl mb-8'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600'>
                        Thông tin tài khoản
                    </span>
                </h1>

                <form className='grid grid-cols-1 md:grid-cols-2 gap-8' onSubmit={handleSubmitForm}>
                    <input type='file' accept='image/*' onChange={handleChangeAvatar} ref={fileRef} hidden />
                    <div className='flex flex-col items-center space-y-4'>
                        <div
                            className='relative w-48 h-48 cursor-pointer transition-transform hover:scale-105'
                            onClick={() => fileRef.current.click()}
                        >
                            {imgUploadProgress && imgUploadProgress < 100 && (
                                <CircularProgressbar
                                    value={imgUploadProgress || 0}
                                    text={`${imgUploadProgress === null ? '' : imgUploadProgress + '%'}`}
                                    strokeWidth={5}
                                    styles={{
                                        root: {
                                            width: '100%',
                                            height: '100%',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                        },
                                        path: {
                                            stroke: `rgba(59, 130, 246, ${imgUploadProgress / 100})`,
                                        },
                                    }}
                                />
                            )}
                            <img
                                src={imgURL || formData.avatarImg || '/assets/default_Avatar.jpg'}
                                className={`rounded-full h-full w-full object-cover border-8 border-blue-100 dark:border-blue-900 shadow-lg ${
                                    imgUploadProgress && imgUploadProgress < 100 && 'opacity-60'
                                }`}
                                alt='Avatar'
                            />
                        </div>
                        <p className='text-sm text-gray-500 dark:text-gray-400'>Nhấn vào ảnh để thay đổi</p>
                    </div>

                    {/* fields */}
                    <div className='grid grid-cols-1 gap-6'>
                        <TextInput
                            type='text'
                            icon={FaUser}
                            className='w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500'
                            placeholder='Họ và tên'
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextInput
                            type='text'
                            icon={FaEnvelope}
                            className='w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500'
                            placeholder='Email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                        />
                        <TextInput
                            type='text'
                            id='phone'
                            icon={FaPhone}
                            className='w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500'
                            value={formData.phone}
                            placeholder='Số điện thoại'
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                    setFormData({ ...formData, phone: value.trim() });
                                }
                            }}
                        />
                        <Tooltip
                            title={formData.address.fullAddress}
                            ref={modalRef}
                            onClick={() => setModalChangeAddress(true)}
                        >
                            <TextInput
                                type='text'
                                id='phone'
                                icon={FaHome}
                                className='w-full transition-all duration-200 focus:ring-2 focus:ring-blue-500'
                                value={formData.address.fullAddress}
                                placeholder='Địa chỉ'
                            />
                        </Tooltip>
                    </div>

                    {/* buttons with enhanced styling */}
                    <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4'>
                        <div className='flex justify-between items-center gap-x-4'>
                            <Button
                                outline
                                type='button'
                                color='blue'
                                className='w-full transform transition-all duration-200 hover:scale-105 !ring-0'
                                onClick={() => setModalVerifyResetPassword(true)}
                                disabled={imgUploadProgress && imgUploadProgress < 100}
                            >
                                Đổi mật khẩu
                            </Button>
                            <Button
                                outline
                                type='button'
                                className='w-full transform transition-all duration-200 hover:scale-105 !ring-0'
                                color='blue'
                                onClick={() => setModalChangeAddress(true)}
                                disabled={imgUploadProgress && imgUploadProgress < 100}
                            >
                                Cập nhật địa chỉ
                            </Button>
                        </div>

                        <Button
                            type='submit'
                            className='w-full transform transition-all duration-200 hover:scale-105 !ring-0'
                            color='blue'
                            disabled={imgUploadProgress && imgUploadProgress < 100}
                        >
                            {imgUploadProgress && imgUploadProgress < 100
                                ? 'Đang tải ảnh lên...'
                                : 'Cập nhật thông tin'}
                        </Button>
                    </div>
                </form>
                <div className='flex flex-col md:flex-row justify-between items-center text-black dark:text-white'>
                    <Button
                        className='focus:!ring-0'
                        as={Link}
                        to='/'
                        type='submit'
                        color='blue'
                        disabled={imgUploadProgress && imgUploadProgress < 100}
                    >
                        Quay lại cửa hàng
                    </Button>
                    <Button className='focus:!ring-0 px-4' color='failure' onClick={() => setShowModalLogout(true)}>
                        Đăng xuất
                    </Button>
                </div>
            </Card>

            {/* modal verify reset password */}
            <Modal
                show={modalVerifyResetPassword}
                size='md'
                popup
                className='backdrop-blur-sm'
                onClose={() => setModalVerifyResetPassword(false)}
            >
                <Modal.Header />
                <Modal.Body className='px-6 py-8'>
                    <div className='w-full flex flex-col justify-center items-center gap-y-6'>
                        <TfiLock className='text-blue-500 text-6xl' />

                        <div className='text-center space-y-2'>
                            <h3 className='text-2xl font-bold text-blue-500'>Xác thực bảo mật</h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Nhập mật khẩu hiện tại để xác nhận thay đổi
                            </p>
                        </div>

                        <div className='w-full space-y-2'>
                            <input
                                type='password'
                                className='w-full rounded-lg border-gray-200 dark:border-gray-700 p-2.5 
                                focus:border-gray-300 focus:ring-0 text-gray-700'
                                placeholder='Mật khẩu hiện tại'
                                value={formPassword.oldPassword}
                                onChange={(e) =>
                                    setFormPassword({
                                        ...formPassword,
                                        oldPassword: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className='w-full flex justify-between items-center gap-4 mt-4'>
                            <Button
                                color='gray'
                                onClick={() => {
                                    setFormPassword({
                                        oldPassword: '',
                                        newPassword: '',
                                        verifyPassword: '',
                                    });
                                    setModalVerifyResetPassword(false);
                                }}
                                className='w-full hover:shadow-sm hover:scale-105 transition-all duration-300 rounded-xl !text-black !ring-0'
                            >
                                Hủy
                            </Button>
                            <Button
                                color='blue'
                                onClick={handleVerifyResetPassword}
                                className='w-full hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl !ring-0'
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal loading */}
            <Modal
                show={loadingPassword}
                size='md'
                popup
                className='backdrop-blur-sm'
                onClose={() => setLoadingPassword(false)}
            >
                <Modal.Header />
                <Modal.Body className='p-8'>
                    <div className='w-full flex flex-col justify-center items-center gap-y-6'>
                        <Spinner size='xl' />
                        <span className='text-lg font-medium text-gray-800 dark:text-gray-200 text-center'>
                            Hệ thống đang xác thực
                            <span className='animate-pulse'>...</span>
                        </span>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal check password fail */}
            <Modal show={checkPasswordFail} size='md' popup onClose={() => setCheckPasswordFail(false)}>
                <Modal.Header />
                <Modal.Body className='px-6 py-10'>
                    <div className='w-full flex flex-col justify-center items-center gap-y-6'>
                        <div className='animate-bounce'>
                            <div className='relative'>
                                <FaBan size='60px' className='text-red-500/20' />
                                <FaBan size='60px' className='absolute top-0 left-0 text-red-500 animate-pulse' />
                            </div>
                        </div>

                        <div className='text-center space-y-2'>
                            <h3 className='text-2xl font-bold text-red-500'>Xác thực thất bại!</h3>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Mật khẩu không chính xác. Vui lòng thử lại.
                            </p>
                        </div>

                        <div className='w-full space-y-3'>
                            <Button
                                className='w-full transform transition-all duration-300 
                    hover:scale-105 bg-gradient-to-r from-red-500 to-red-600 
                    !ring-0 shadow-lg hover:shadow-xl'
                                onClick={handleNavigateUser}
                            >
                                Đăng nhập lại
                            </Button>
                            <Button
                                color='gray'
                                className='w-full transform transition-all duration-300 
                    hover:scale-105 !ring-0 !text-black'
                                onClick={() => {
                                    setFormPassword({
                                        oldPassword: '',
                                        newPassword: '',
                                        verifyPassword: '',
                                    });
                                    setCheckPasswordFail(false);
                                }}
                            >
                                Đóng
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal change password */}
            <Modal show={modalChangePassword} size='md' popup onClose={() => setModalChangePassword(false)}>
                <Modal.Header />
                <Modal.Body className='px-6 py-8'>
                    <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                        <TfiLock className='text-blue-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-blue-500'>Nhập mật khẩu mới</span>
                        <input
                            type='password'
                            id='newPassword'
                            className='w-full rounded-lg border-gray-200 dark:border-gray-700 p-2.5 
                                focus:border-gray-300 focus:ring-0 text-gray-700'
                            placeholder='Mật khẩu mới'
                            value={formPassword.newPassword}
                            onChange={(e) => {
                                setFormPassword({
                                    ...formPassword,
                                    newPassword: e.target.value,
                                });
                                setPasswordStrength(getStrength(e.target.value));
                            }}
                        />
                        {formPassword.newPassword && (
                            <div className='w-full'>
                                <PasswordStrengthMeter
                                    password={formPassword.newPassword}
                                    strength={passwordStrength}
                                />
                            </div>
                        )}
                        <input
                            type='password'
                            id='verifyPassword'
                            className='w-full rounded-lg border-gray-200 dark:border-gray-700 p-2.5 
                                focus:border-gray-300 focus:ring-0 text-gray-700'
                            placeholder='Xác thực mật khẩu mới'
                            value={formPassword.verifyPassword}
                            onChange={(e) =>
                                setFormPassword({
                                    ...formPassword,
                                    verifyPassword: e.target.value,
                                })
                            }
                        />
                        {formPassword.newPassword !== formPassword.verifyPassword && (
                            <Alert color='failure' className='w-full flex justify-center items-center font-semibold'>
                                Mật khẩu không khớp
                            </Alert>
                        )}

                        <div className='w-full flex justify-between items-center gap-5'>
                            <Button
                                color='gray'
                                onClick={() => {
                                    setModalChangePassword(false);
                                    setFormPassword({
                                        oldPassword: '',
                                        newPassword: '',
                                        verifyPassword: '',
                                    });
                                }}
                                className='w-full hover:shadow-sm hover:scale-105 transition-all duration-300 rounded-xl !text-black !ring-0'
                            >
                                Hủy
                            </Button>
                            <Button
                                color='blue'
                                onClick={handleResetPassword}
                                className='w-full hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl !ring-0'
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal change address */}
            <Modal show={modalChangeAddress} size='md' popup onClose={() => setModalChangeAddress(false)}>
                <Modal.Header />
                <Modal.Body className='px-5 py-10'>
                    <div className='w-full flex flex-col justify-center items-center gap-y-5'>
                        <div className='flex flex-col justify-center items-center gap-y-1'>
                            <PiHouseLineLight className='text-blue-500 text-6xl mx-auto' />
                            <span className='text-lg font-medium text-blue-500'>Cập nhật địa chỉ của bạn</span>
                        </div>
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
                                const selectedProvince = provinces.find((province) => province.ProvinceID === value);
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
                            onChange={(value) => {
                                const selectedDistrict = districts.find((district) => district.DistrictID === value);
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

                        <input
                            type='text'
                            className='w-full rounded-lg border-gray-200 dark:border-gray-700 p-2.5 
                                focus:border-gray-300 focus:ring-0 text-gray-700'
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

                        {formData?.address.street &&
                            formData?.address.ward.label &&
                            formData?.address.district.label &&
                            formData?.address.province.label && (
                                <div className='w-full p-2 border rounded-lg text-center'>
                                    <h4 className='font-semibold text-gray-800'>Địa chỉ của bạn:</h4>
                                    <p className='text-gray-600 break-words text-ellipsis overflow-hidden'>
                                        {`${formData.address.street}, ${formData.address.ward.label},
                                            ${formData.address.district.label},
                                            ${formData.address.province.label}`}
                                    </p>
                                </div>
                            )}

                        <div className='w-full flex justify-between items-center gap-5'>
                            <Button
                                color='gray'
                                onClick={() => setModalChangeAddress(false)}
                                className='w-full hover:shadow-sm hover:scale-105 transition-all duration-300 rounded-xl !text-black !ring-0'
                            >
                                Hủy
                            </Button>
                            <Button
                                color='blue'
                                onClick={handleUpdateAddress}
                                className='w-full hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl !ring-0'
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal logout */}
            <Modal show={showModalLogout} onClose={() => setShowModalLogout(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='text-yellow-400 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>Bạn có chắc chắn muốn đăng xuất?</span>
                        <div className='flex justify-between items-center mt-5'>
                            <Button className='focus:!ring-0' color='gray' onClick={() => setShowModalLogout(false)}>
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='warning' onClick={handleSignOutAccount}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
