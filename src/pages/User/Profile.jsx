import { Alert, Button, Card, Modal, Spinner, TextInput } from 'flowbite-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../services/firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { user_SignOut, user_UpdateProfile } from '../../services/redux/slices/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { TfiLock } from 'react-icons/tfi';
import { GoLock } from 'react-icons/go';
import { PasswordStrengthMeter } from '../Auth/components/exportCom_Auth';
import { PiHouseLineLight } from 'react-icons/pi';
import { Select } from 'antd';
import { FaBan } from 'react-icons/fa';
import { resetCheckout } from '../../services/redux/slices/checkoutSlice';
import { resetCart } from '../../services/redux/slices/cartSlice';

export default function Profile_Component() {
    // get token user from redux store
    const currentUser = useSelector((state) => state.user.user);
    const tokenUser = useSelector((state) => state.user.access_token);
    const navigate = useNavigate();

    // states
    const dispatch = useDispatch();
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
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();
    const [initialFormData, setInitialFormData] = useState(formData);

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
    }, []);

    // get strength of password
    const getStrength = useCallback((pass) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
        if (pass.match(/\d/)) strength++;
        if (pass.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    }, []);

    // ======================================== Fetch API ========================================
    // upload image to firebase storage
    useEffect(() => {
        if (imgFile) {
            const uploadImage = async () => {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + imgFile.name;
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef, imgFile);
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setImgUploadProgress(progress.toFixed(0));
                        console.log('Upload is ' + progress + '% done');
                    },
                    () => {
                        toast.error('Kích thước ảnh quá lớn, vui lòng chọn ảnh khác !!!');
                        setImgUploadProgress(null);
                        setImgFile(null);
                        setImgURL(null);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            setImgURL(downloadURL);
                            setFormData({ ...formData, avatarImg: downloadURL });
                        });
                    },
                );
            };

            uploadImage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const handleChangeAvatar = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            setImgFile(file);
            setImgURL(URL.createObjectURL(file));
        }
    }, []);

    // update user profile function
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        if (imgUploadProgress && imgUploadProgress < 100) {
            toast.error('Xin chờ hệ thống đang tải ảnh !!!');
            return;
        }
        const isFormChanged = Object.keys(formData).some((key) => formData[key] !== initialFormData[key]);

        if (!isFormChanged) {
            toast.info('Không có gì thay đổi để cập nhật!');
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

    // sign out function
    const handleSignOutAccount = async () => {
        dispatch(user_SignOut());
        dispatch(resetCart());
        dispatch(resetCheckout());
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
                }, 3000);
            }
        } catch (error) {
            toast.error('Hệ thống đang bận, vui lòng thử lại!');
            console.log(error);
        }
    };

    // navigate to login page
    const handleNavigateUser = () => {
        dispatch(user_SignOut());
        navigate('/login');
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

    return (
        <div className='w-full mt-10 my-auto max-w-5xl mx-auto'>
            {/* <div className='p-10 border border-gray-100 dark:border-gray-700 shadow-lg rounded-2xl'> */}
            <Card className='p-6 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl'>
                <h1 className='text-center font-semibold text-3xl my-7'>Trang cá nhân</h1>

                {/* form */}
                <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmitForm}>
                    {/* avatar */}
                    <input type='file' accept='image/*' onChange={handleChangeAvatar} ref={fileRef} hidden />
                    <div className='relative w-40 h-40 mx-auto cursor-pointer' onClick={() => fileRef.current.click()}>
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
                                    path: { stroke: `rgba(0,255,0,${imgUploadProgress / 100})` },
                                }}
                            />
                        )}
                        <img
                            src={imgURL || formData.avatarImg || '/assets/default_Avatar.jpg'}
                            className={`rounded-full h-full w-full object-cover border-8 border-[lightgray] ${
                                imgUploadProgress && imgUploadProgress < 100 && 'opacity-60'
                            }`}
                            alt='Avatar'
                        />
                    </div>

                    {/* input fields */}
                    <div className='grid grid-cols-1 gap-5'>
                        <TextInput
                            type='text'
                            icon={CiUser}
                            className='w-full'
                            placeholder='Họ và tên'
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextInput
                            type='text'
                            icon={CiMail}
                            className='w-full'
                            placeholder='Email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                        />
                        <TextInput
                            type='text'
                            id='phone'
                            icon={CiPhone}
                            className='w-full'
                            value={formData.phone}
                            placeholder='Số điện thoại'
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value) && value.length <= 10) {
                                    setFormData({ ...formData, phone: value.trim() });
                                }
                            }}
                        />
                        <div
                            ref={modalRef}
                            onClick={() => setModalChangeAddress(true)}
                            className='flex items-center gap-x-2 rounded-lg bg-[#F9FAFB] dark:bg-[#374151]
                        border border-gray-300 dark:border-gray-700 py-[7px] px-3 cursor-pointer'
                        >
                            <CiHome className='text-gray-500 dark:text-gray-400' size={20} />
                            <span className='text-gray-800 dark:text-gray-200 text-sm'>
                                {formData.address.fullAddress ? formData.address.fullAddress : 'Địa chỉ của bạn'}
                            </span>
                        </div>
                    </div>

                    {/* buttons: reset password, update address and update profile */}
                    <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex justify-between items-center gap-x-4'>
                            <Button
                                outline
                                type='button'
                                className='w-full focus:!ring-0'
                                gradientDuoTone='cyanToBlue'
                                onClick={() => setModalVerifyResetPassword(true)}
                                disabled={imgUploadProgress && imgUploadProgress < 100}
                            >
                                Đổi mật khẩu
                            </Button>
                            <Button
                                outline
                                type='button'
                                className='w-full focus:!ring-0'
                                gradientDuoTone='cyanToBlue'
                                onClick={() => setModalChangeAddress(true)}
                                disabled={imgUploadProgress && imgUploadProgress < 100}
                            >
                                Cập nhật địa chỉ
                            </Button>
                        </div>

                        <Button
                            outline
                            type='submit'
                            className='w-full focus:!ring-0'
                            gradientDuoTone='purpleToBlue'
                            disabled={imgUploadProgress && imgUploadProgress < 100}
                        >
                            {imgUploadProgress && imgUploadProgress < 100
                                ? 'Đang tải ảnh lên...'
                                : 'Cập nhật thông tin'}
                        </Button>
                    </div>
                </form>

                {/* buttons: return to shop & sign out */}
                <div className='flex flex-col md:flex-row justify-between items-center mt-8 text-black dark:text-white'>
                    <Button
                        className='focus:!ring-0'
                        as={Link}
                        to='/'
                        type='submit'
                        gradientDuoTone='cyanToBlue'
                        disabled={imgUploadProgress && imgUploadProgress < 100}
                    >
                        Quay lại cửa hàng
                    </Button>
                    <button
                        onClick={() => setShowModal(true)}
                        className='bg-red-500 hover:bg-red-600 text-white border dark:border-none px-10 py-2 rounded-lg transition duration-200 cursor-pointer'
                        disabled={imgUploadProgress && imgUploadProgress < 100}
                    >
                        Đăng xuất
                    </button>
                </div>
            </Card>

            {/* confirm change password */}
            <Modal show={modalVerifyResetPassword} onClose={() => setModalVerifyResetPassword(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                        <TfiLock className='text-blue-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>
                            Nhập mật khẩu hiện tại để xác nhận thay đổi
                        </span>
                        <TextInput
                            type='password'
                            icon={GoLock}
                            className='w-full'
                            placeholder='Mật khẩu hiện tại'
                            value={formPassword.oldPassword}
                            onChange={(e) =>
                                setFormPassword({
                                    ...formPassword,
                                    oldPassword: e.target.value,
                                })
                            }
                        />

                        <div className='w-full flex justify-between items-center'>
                            <Button
                                className='focus:!ring-0'
                                color='gray'
                                onClick={() => setModalVerifyResetPassword(false)}
                            >
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='blue' onClick={handleVerifyResetPassword}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal loading confirm password */}
            {loadingPassword && (
                <Modal show={loadingPassword} size='md' popup onClose={() => setLoadingPassword(false)}>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                            <Spinner size='xl' color='info' />
                            <span className='text-lg font-medium text-black'>
                                Hệ thống đang xác thực. Vui lòng chờ...
                            </span>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {/* modal check password fail */}
            {checkPasswordFail && (
                <Modal show={checkPasswordFail} size='md' popup onClose={() => setCheckPasswordFail(false)}>
                    <Modal.Body>
                        <div className='mt-7 w-full flex flex-col justify-center items-center gap-y-3'>
                            <FaBan size='50px' color='red' />
                            <span className='text-lg font-medium text-black'>Xác thực mật khẩu thất bại !!!</span>
                            <Button className='w-full focus:!ring-0' onClick={handleNavigateUser}>
                                Đăng nhập
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {/* change password modal */}
            <Modal show={modalChangePassword} onClose={() => setModalChangePassword(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                        <TfiLock className='text-blue-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>Nhập mật khẩu mới</span>
                        <TextInput
                            type='password'
                            id='newPassword'
                            icon={GoLock}
                            className='w-full'
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
                        <TextInput
                            type='password'
                            id='verifyPassword'
                            icon={GoLock}
                            className='w-full'
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
                            <Alert color='failure' className='w-full flex justify-center items-center'>
                                Mật khẩu không khớp
                            </Alert>
                        )}

                        <div className='w-full flex justify-between items-center'>
                            <Button
                                className='focus:!ring-0'
                                color='gray'
                                onClick={() => setModalChangePassword(false)}
                            >
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='blue' onClick={handleResetPassword}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* change address modal */}
            <Modal show={modalChangeAddress} onClose={() => setModalChangeAddress(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                        <PiHouseLineLight className='text-blue-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>Cập nhật địa chỉ của bạn</span>
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

                        <div className='w-full flex justify-between items-center'>
                            <Button className='focus:!ring-0' color='gray' onClick={() => setModalChangeAddress(false)}>
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='blue' onClick={handleUpdateAddress}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* logout account modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='text-red-500 text-5xl mx-auto' />
                        <span className='text-lg font-medium text-black'>Bạn có chắc chắn muốn đăng xuất?</span>
                        <div className='flex justify-between items-center mt-5'>
                            <Button className='focus:!ring-0' color='gray' onClick={() => setShowModal(false)}>
                                Hủy
                            </Button>
                            <Button className='focus:!ring-0' color='warning' onClick={handleSignOutAccount}>
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            {/* </div> */}
        </div>
    );
}
