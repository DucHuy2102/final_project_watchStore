import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import { user_DeleteAccount, user_SignOut, user_UpdateProfile } from '../../redux/slices/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { CiHome, CiMail, CiPhone, CiUser } from 'react-icons/ci';
import { toast } from 'react-toastify';

export default function Profile_Component() {
    // get token user from redux store
    const tokenUser = useSelector((state) => state.user.accessToken);

    // states
    const dispatch = useDispatch();
    const fileRef = useRef();
    const [imgFile, setImgFile] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [imgUploadProgress, setImgUploadProgress] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

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

    // ======================================== Update user ========================================
    // handle change input function
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

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
        // if (Object.keys(formData).length === 5) {
        //     toast.error('Không có gì thay đổi !!!');
        //     return;
        // }

        // if (imgUploadProgress && imgUploadProgress < 100) {
        //     toast.error('Xin chờ hệ thống đang tải ảnh !!!');
        //     return;
        // }
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
                dispatch(user_UpdateProfile(updatedUser));
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
                            id='fullname'
                            icon={CiUser}
                            className='w-full'
                            placeholder='Họ và tên'
                            defaultValue={formData.fullName || ''}
                            onChange={handleChange}
                        />
                        <TextInput
                            type='text'
                            id='email'
                            icon={CiMail}
                            className='w-full'
                            placeholder='Email'
                            defaultValue={formData.email || ''}
                            onChange={handleChange}
                        />
                        <TextInput
                            type='text'
                            id='phone'
                            icon={CiPhone}
                            className='w-full'
                            defaultValue={formData.phone || ''}
                            placeholder='Số điện thoại'
                            onChange={handleChange}
                        />
                        <TextInput
                            type='text'
                            id='address'
                            icon={CiHome}
                            className='w-full'
                            defaultValue={formData.address || ''}
                            placeholder='Địa chỉ'
                            onChange={handleChange}
                        />
                    </div>

                    {/* button update profile */}
                    <div className='col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Button
                            as={Link}
                            to={'/dashboard?tab=change-password'}
                            outline
                            type='button'
                            className='w-full'
                            gradientDuoTone='cyanToBlue'
                            disabled={imgUploadProgress && imgUploadProgress < 100}
                        >
                            Đổi mật khẩu
                        </Button>
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
                        className='bg-red-500 hover:bg-red-600 hover:text-white border dark:border-none px-10 py-2 rounded-lg transition duration-200 cursor-pointer'
                        disabled={imgUploadProgress && imgUploadProgress < 100}
                    >
                        Đăng xuất
                    </button>
                </div>

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
