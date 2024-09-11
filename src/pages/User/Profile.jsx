import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { user_SignOut, user_UpdateProfile } from '../../redux/slices/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { TfiLock } from 'react-icons/tfi';
import { GoLock } from 'react-icons/go';
import { PasswordStrengthMeter } from '../../components/exportComponent';
import { PiHouseLineLight } from 'react-icons/pi';
import { Select } from 'antd';

export default function Profile_Component() {
    // get token user from redux store
    const currentUser = useSelector((state) => state.user.currentUser);
    const tokenUser = currentUser?.access_token;

    // states
    const dispatch = useDispatch();
    const fileRef = useRef();
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        avatarImg: '',
    });
    console.log('formData', formData);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // change password states
    const [modalVerifyResetPassword, setModalVerifyResetPassword] = useState(false);
    const [modalChangePassword, setModalChangePassword] = useState(false);
    const [formPassword, setFormPassword] = useState({
        oldPassword: '',
        newPassword: '',
        verifyPassword: '',
    });
    const [loadingPassword, setLoadingPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    // change address states
    const [modalChangeAddress, setModalChangeAddress] = useState(false);
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

    // ======================================== Fetch API ========================================
    // get user from api and update to redux store
    useEffect(() => {
        const getUser = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                });
                if (res?.status === 200) {
                    const updatedUser = res?.data;
                    setFormData({
                        fullName: updatedUser.fullName,
                        email: updatedUser.email,
                        phone: updatedUser.phone,
                        address: updatedUser.address,
                        avatarImg: updatedUser.avatarImg,
                    });
                }
            } catch (error) {
                console.log('Error get user profile: ', error);
            } finally {
                setLoading(false);
            }
        };
        getUser();
    }, [dispatch, tokenUser]);

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
                    }
                );
            };

            uploadImage();
        }
    }, [imgFile]);

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
            if (!formAddress.province.value) return;
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
    }, [formAddress.province.value]);

    // get ward from api
    useEffect(() => {
        const getWard = async () => {
            if (!formAddress.district.value) return;
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
    }, [formAddress.district.value]);

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
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/profile/update`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                }
            );
            if (res?.status === 200) {
                const updatedUser = res.data;
                toast.success('Cập nhật thông tin thành công');
                // dispatch(user_UpdateProfile(updatedUser));
            }
        } catch (error) {
            toast.error('Hệ thống đang bận, vui lòng thử lại sau');
            console.log(error);
        }
    };

    // sign out function
    const handleSignOutAccount = async () => {
        try {
            dispatch(user_SignOut());
            console.log('sign out');
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
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>
                        Vui lòng chờ trong giây lát...
                    </p>
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
    const handleVerifyResetPassword = () => {
        if (!formPassword.oldPassword) {
            toast.error('Vui lòng nhập mật khẩu !!!');
            return;
        }
        try {
            // nếu lỗi tạo thêm modal hiện thông báo lỗi
            setLoadingPassword(true);
            setTimeout(() => {
                setModalChangePassword(true);
                setLoadingPassword(false);
            }, 5000);
        } catch (error) {
            console.log(error);
        } finally {
            setFormPassword({ oldPassword: '', newPassword: '', verifyPassword: '' });
            setModalVerifyResetPassword(false);
        }
    };

    // reset password function
    const handleResetPassword = async () => {
        if (!formPassword.newPassword || !formPassword.verifyPassword) {
            toast.error('Vui lòng nhập mật khẩu mới !!!');
            return;
        }
        try {
            console.log('reset password');
            // const res = await axios.post(
            //     `${import.meta.env.VITE_API_URL}/api/profile/reset-password`,
            //     { password: formPassword.newPassword },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${tokenUser}`,
            //         },
            //     }
            // );
            // if (res?.status === 200) {
            //     toast.success('Đổi mật khẩu thành công');
            //     setModalChangePassword(false);
            // }
        } catch (error) {
            toast.error('Hệ thống đang bận, vui lòng thử lại sau');
            console.log(error);
        } finally {
            setModalChangePassword(false);
            setFormPassword({ newPassword: '', verifyPassword: '' });
        }
    };

    // ======================================== Update address user ========================================
    // update address function
    const handleUpdateAddress = async () => {
        const newAddress = `${formAddress.street}, ${formAddress.ward.label}, ${formAddress.district.label}, ${formAddress.province.label}`;
        setFormData({
            ...formData,
            address: newAddress,
        });
        setModalChangeAddress(false);
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
    };

    return (
        <div className='w-full my-auto max-w-5xl mx-auto'>
            <div className='p-10 border border-gray-100 dark:border-gray-700 shadow-lg rounded-2xl'>
                <h1 className='text-center font-semibold text-3xl my-7'>Trang cá nhân</h1>

                {/* form */}
                <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleSubmitForm}>
                    {/* avatar */}
                    <input
                        type='file'
                        accept='image/*'
                        onChange={handleChangeAvatar}
                        ref={fileRef}
                        hidden
                    />
                    <div
                        className='relative w-40 h-40 mx-auto cursor-pointer'
                        onClick={() => fileRef.current.click()}
                    >
                        {imgUploadProgress && imgUploadProgress < 100 && (
                            <CircularProgressbar
                                value={imgUploadProgress || 0}
                                text={`${
                                    imgUploadProgress === null ? '' : imgUploadProgress + '%'
                                }`}
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
                            src={
                                imgURL ||
                                formData.avatarImg ||
                                'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'
                            }
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
                            // id='fullname'
                            icon={CiUser}
                            className='w-full'
                            placeholder='Họ và tên'
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                        <TextInput
                            type='text'
                            // id='email'
                            icon={CiMail}
                            className='w-full'
                            placeholder='Email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextInput
                            type='text'
                            id='phone'
                            icon={CiPhone}
                            className='w-full'
                            value={formData.phone}
                            placeholder='Số điện thoại'
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <TextInput
                            disabled
                            type='text'
                            id='address'
                            icon={CiHome}
                            className='w-full'
                            value={formData.address}
                            placeholder='Địa chỉ'
                        />
                    </div>

                    {/* buttons: reset password, update address and update profile */}
                    <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex justify-between items-center gap-x-4'>
                            <Button
                                outline
                                type='button'
                                className='w-full'
                                gradientDuoTone='cyanToBlue'
                                onClick={() => setModalVerifyResetPassword(true)}
                                disabled={imgUploadProgress && imgUploadProgress < 100}
                            >
                                Đổi mật khẩu
                            </Button>
                            <Button
                                outline
                                type='button'
                                className='w-full'
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
                            className='w-full'
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

                {/* confirm change password */}
                <Modal
                    show={modalVerifyResetPassword}
                    onClose={() => setModalVerifyResetPassword(false)}
                    size='md'
                    popup
                >
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
                                    color='gray'
                                    onClick={() => setModalVerifyResetPassword(false)}
                                >
                                    Hủy
                                </Button>
                                <Button color='blue' onClick={handleVerifyResetPassword}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* loading confirm password */}
                <Modal show={loadingPassword} size='md' popup>
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

                {/* change password modal */}
                <Modal
                    show={modalChangePassword}
                    onClose={() => setModalChangePassword(false)}
                    size='md'
                    popup
                >
                    <Modal.Header />
                    <Modal.Body>
                        <div className='w-full flex flex-col justify-center items-center gap-y-3'>
                            <TfiLock className='text-blue-500 text-5xl mx-auto' />
                            <span className='text-lg font-medium text-black'>
                                Nhập mật khẩu mới
                            </span>
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
                                <Alert
                                    color='failure'
                                    className='w-full flex justify-center items-center'
                                >
                                    Mật khẩu không khớp
                                </Alert>
                            )}

                            <div className='w-full flex justify-between items-center'>
                                <Button color='gray' onClick={() => setModalChangePassword(false)}>
                                    Hủy
                                </Button>
                                <Button color='blue' onClick={handleResetPassword}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* change address modal */}
                <Modal
                    show={modalChangeAddress}
                    onClose={() => setModalChangeAddress(false)}
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
                                showSearch
                                placeholder='Chọn Thành Phố'
                                className='w-full h-10'
                                filterOption={(input, option) =>
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
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
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
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
                                    (option?.label ?? '')
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
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
                                <Button color='gray' onClick={() => setModalChangeAddress(false)}>
                                    Hủy
                                </Button>
                                <Button color='blue' onClick={handleUpdateAddress}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* delete account modal */}
                <Modal show={showModal} onClose={() => setShowModal(false)} size='md' popup>
                    <Modal.Header />
                    <Modal.Body>
                        <div className='text-center'>
                            <HiOutlineExclamationCircle className='text-red-500 text-5xl mx-auto' />
                            <span className='text-lg font-medium text-black'>
                                Bạn có chắc chắn muốn đăng xuất?
                            </span>
                            <div className='flex justify-between items-center mt-5'>
                                <Button color='gray' onClick={() => setShowModal(false)}>
                                    Hủy
                                </Button>
                                <Button color='warning' onClick={handleSignOutAccount}>
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
}
