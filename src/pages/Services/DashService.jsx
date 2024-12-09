import { Card, Input, Button, Upload, Modal } from 'antd';
import {
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    MessageOutlined,
    SwapOutlined,
    InboxOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircleFilled } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const SHOP_INFO_DATA = [
    {
        title: 'Giờ làm việc',
        data: [
            { title: 'Thứ 2 - Thứ 6', content: '8:00 - 20:00' },
            { title: 'Thứ 7 - Chủ nhật', content: '9:00 - 17:00' },
        ],
    },
    {
        title: 'Liên hệ với chúng tôi',
        data: [
            { title: 'Hotline', content: '1900 1234' },
            { title: 'Email', content: 'support@watches.vn' },
        ],
    },
];

const SHOP_INFO = ({ title, data }) => {
    return (
        <div className='space-y-5'>
            <div>
                <h4 className='font-medium bg-gradient-to-r from-amber-700 to-amber-600 text-transparent bg-clip-text text-lg'>
                    {title}
                </h4>
                <div className='w-24 h-px bg-gradient-to-r from-amber-500 to-amber-300' />
            </div>
            <ul className='space-y-4'>
                {data?.map((item, index) => (
                    <li
                        key={index}
                        className='cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-transparent transition-all duration-300 border border-transparent hover:border-amber-100/50'
                    >
                        <p className='text-sm text-amber-700 font-bold mb-1'>{item.title}</p>
                        <p className='text-amber-800 font-medium tracking-wide'>{item.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function DashService() {
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        type: 'feedback',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateVietnamesePhone = (phone) => {
        const phoneRegex = /(84|0)[35789][0-9]{8}$/;
        return phoneRegex.test(phone);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Remove leading/trailing spaces for email and phone
        const trimmedValue = ['email', 'phone'].includes(name) ? value.trim() : value;

        setFormData((prev) => ({
            ...prev,
            [name]: trimmedValue,
        }));

        // Real-time validation feedback
        if (name === 'email' && trimmedValue) {
            if (!validateEmail(trimmedValue)) {
                toast.warn('Email không hợp lệ!', {
                    toastId: 'email-validation', // Prevent duplicate toasts
                    autoClose: 2000,
                });
            }
        }

        if (name === 'phone' && trimmedValue) {
            if (!validateVietnamesePhone(trimmedValue)) {
                toast.warn('Số điện thoại không hợp lệ!', {
                    toastId: 'phone-validation', // Prevent duplicate toasts
                    autoClose: 2000,
                });
            }
        }
    };

    const handleTypeChange = (type) => {
        setFormData((prev) => ({
            ...prev,
            type,
        }));
    };

    const handleFileChange = ({ fileList }) => {
        setFiles(fileList);
    };

    const handleUploadImageCloudinary = useCallback(async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'images_service');

            const response = await axios.post(`https://api.cloudinary.com/v1_1/dajzl4hdt/image/upload`, formData);

            if (response.data?.secure_url) {
                return response.data.secure_url;
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Không thể tải ảnh lên. Vui lòng thử lại!');
            return null;
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Vui lòng nhập họ và tên!');
            return;
        }

        // check phone
        if (!formData.phone.trim()) {
            toast.error('Vui lòng nhập số điện thoại!');
            return;
        }
        if (!validateVietnamesePhone(formData.phone.trim())) {
            toast.error('Số điện thoại không hợp lệ!');
            return;
        }

        // check email
        if (!formData.email.trim()) {
            toast.error('Vui lòng nhập email!');
            return;
        }
        if (!validateEmail(formData.email.trim())) {
            toast.error('Email không hợp lệ!');
            return;
        }

        if (!formData.message.trim()) {
            toast.error('Vui lòng nhập nội dung tin nhắn!');
            return;
        }

        try {
            setLoading(true);
            const uploadPromises = files.map((file) => handleUploadImageCloudinary(file.originFileObj));
            const uploadedUrls = await Promise.all(uploadPromises);
            const validUrls = uploadedUrls.filter((url) => url !== null);

            const submitData = {
                ...formData,
                img: validUrls,
            };

            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/service/create-service`, submitData, {
                headers: {
                    Authorization: `Bearer ${tokenUser}`,
                },
            });
            if (res?.status === 200) {
                setShowSuccess(true);
                setFormData({
                    name: '',
                    phone: '',
                    email: '',
                    message: '',
                    type: 'feedback',
                });
                setFiles([]);
            }
        } catch (error) {
            console.error('Submission failed:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='mx-auto min-h-screen bg-gray-50'>
                <div className='relative h-[240px] lg:h-[280px] overflow-hidden'>
                    <img
                        src={'../assets/suaDongHo.avif'}
                        alt='Watch Service Banner'
                        className='w-full h-full object-cover filter brightness-[0.85]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/50 to-transparent' />
                    <div className='absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/90' />
                    <div className='absolute inset-0'>
                        <div className='max-w-6xl h-full mx-auto px-4 lg:px-8 flex items-center'>
                            <div className='relative z-10 max-w-xl'>
                                <h1 className='text-3xl lg:text-4xl font-serif text-white mb-4'>
                                    Dịch Vụ Của Chúng Tôi
                                </h1>
                                <div className='w-24 h-1 bg-amber-500 mb-4' />
                                <p className='text-gray-100 text-sm lg:text-base leading-relaxed'>
                                    Chuyên nghiệp - Uy tín - Chất lượng
                                </p>
                            </div>
                            <div className='absolute top-8 right-8 w-24 h-24 border-2 border-white/10 rounded-full' />
                            <div className='absolute top-16 right-16 w-16 h-16 border border-amber-500/20 rounded-full' />
                        </div>
                    </div>
                </div>

                <div className='px-4 py-8 -mt-16 relative'>
                    <div className='max-w-6xl mx-auto px-4 lg:px-8'>
                        <div className='bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-md mb-8 max-w-3xl mx-auto'>
                            <p className='text-lg italic text-gray-700 leading-relaxed'>
                                Cửa hàng đồng hồ{' '}
                                <span
                                    className='text-amber-600 font-semibold tracking-wide 
                                    bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent'
                                >
                                    WatcHes
                                </span>{' '}
                                - Chuyên cung cấp các dòng đồng hồ phù hợp với nhiều khách hàng, cùng với nhiều sản phẩm
                                nhập khẩu chính hãng và chế độ bảo hành lên đến{' '}
                                <span className='font-semibold text-amber-700'>24 tháng</span>. Cửa hàng cam kết mang
                                lại trải nghiệm mua sắm thoải mái và dịch vụ chăm sóc khách hàng tận tâm, đảm bảo bạn
                                nhận được sự tư vấn rõ ràng, chu đáo từ những nhân viên chuyên nghiệp. Hãy đến với{' '}
                                <span
                                    className='text-amber-600 font-semibold tracking-wide 
                                    bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent'
                                >
                                    WatcHes
                                </span>{' '}
                                để tìm chiếc đồng hồ phù hợp, khẳng định phong cách và sự đẳng cấp của bạn!
                            </p>
                        </div>

                        <div className='grid lg:grid-cols-2 gap-8 items-start'>
                            {/* Contact Info */}
                            <div className='space-y-6'>
                                <div className='relative h-56 rounded-2xl overflow-hidden group'>
                                    <img
                                        src={'../assets/storeService.jpg'}
                                        alt='Watch Store'
                                        className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700'
                                    />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                                    <div className='absolute bottom-6 left-6 right-6'>
                                        <h3 className='font-serif text-2xl text-white mb-2'>Watches Store</h3>
                                        <p className='text-gray-200 text-sm'>
                                            <span className='text-amber-400'>●</span> Chuyên nghiệp
                                            <span className='mx-2'>|</span>
                                            <span className='text-amber-400'>●</span> Uy tín
                                            <span className='mx-2'>|</span>
                                            <span className='text-amber-400'>●</span> Chất lượng
                                        </p>
                                    </div>
                                </div>

                                <div className='bg-gradient-to-br from-white via-gray-50 to-white backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100/50'>
                                    <h3 className='font-serif text-2xl bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 bg-clip-text text-transparent mb-7'>
                                        Thông tin liên hệ
                                    </h3>
                                    <div className='grid grid-cols-2 gap-8'>
                                        {SHOP_INFO_DATA.map((item, index) => (
                                            <SHOP_INFO key={index} title={item.title} data={item.data} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Form */}
                            <div className='relative'>
                                <Card
                                    className='border-none rounded-2xl overflow-hidden
                                    bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] 
                                    from-gray-50 via-white to-gray-50
                                    shadow-[0_8px_40px_rgb(0,0,0,0.12)] backdrop-blur-sm'
                                >
                                    <div
                                        className='absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-200/20 via-yellow-100/10 to-transparent 
                                        rounded-full blur-3xl transform translate-x-20 -translate-y-20'
                                    />
                                    <div
                                        className='absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/20 via-amber-100/10 to-transparent 
                                        rounded-full blur-3xl transform -translate-x-20 translate-y-20'
                                    />
                                    <div className='absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl' />
                                    <div className='relative space-y-6'>
                                        <div className='text-center mb-8'>
                                            <h3
                                                className='font-serif text-2xl text-transparent bg-clip-text bg-gradient-to-r 
                                                from-amber-700 via-yellow-600 to-amber-700 animate-shimmer'
                                            >
                                                Dịch Vụ Chăm Sóc Khách Hàng
                                            </h3>
                                            <div className='w-20 h-0.5 mx-auto mt-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
                                        </div>

                                        <form className='flex flex-col space-y-5' onSubmit={handleSubmit}>
                                            <div className='space-y-4'>
                                                <Input
                                                    prefix={<UserOutlined className='text-amber-600' />}
                                                    placeholder='Họ và tên *'
                                                    name='name'
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className='h-12 rounded-xl border-gray-200 hover:border-amber-500 focus:border-amber-500'
                                                    required
                                                    autoFocus
                                                />
                                                <Input
                                                    prefix={<PhoneOutlined className='text-amber-600' />}
                                                    placeholder='Số điện thoại * (VD: 0912345678)'
                                                    name='phone'
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className='h-12 rounded-xl border-gray-200 hover:border-amber-500 focus:border-amber-500'
                                                    required
                                                    maxLength={10}
                                                />
                                                <Input
                                                    prefix={<MailOutlined className='text-amber-600' />}
                                                    placeholder='Email *'
                                                    name='email'
                                                    type='email'
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className='h-12 rounded-xl border-gray-200 hover:border-amber-500 focus:border-amber-500'
                                                    required
                                                />
                                            </div>

                                            <div className='flex gap-4'>
                                                <Button
                                                    type={formData.type === 'feedback' ? 'primary' : 'default'}
                                                    className={`flex-1 h-12 border-none rounded-xl font-medium
                                                        ${
                                                            formData.type === 'feedback'
                                                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => handleTypeChange('feedback')}
                                                >
                                                    <MessageOutlined className='mr-2' />
                                                    Phản Ánh & Góp Ý
                                                </Button>
                                                <Button
                                                    type={formData.type === 'return' ? 'primary' : 'default'}
                                                    className={`flex-1 h-12 border-none rounded-xl font-medium
                                                        ${
                                                            formData.type === 'return'
                                                                ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                    onClick={() => handleTypeChange('return')}
                                                >
                                                    <SwapOutlined className='mr-2' />
                                                    Yêu Cầu Tư Vấn
                                                </Button>
                                            </div>

                                            <Input.TextArea
                                                rows={3}
                                                placeholder='Mời bạn nhập nội dung để chúng tôi phản hồi chính xác'
                                                name='message'
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className='rounded-xl border-gray-200 hover:border-amber-500 focus:border-amber-500
                                                    min-h-[120px] resize-none'
                                            />

                                            <Upload.Dragger
                                                multiple
                                                listType='picture'
                                                fileList={files}
                                                onChange={handleFileChange}
                                                beforeUpload={() => false}
                                                showUploadList={{ showPreviewIcon: true, showRemoveIcon: true }}
                                            >
                                                <p className='ant-upload-drag-icon'>
                                                    <InboxOutlined className='text-3xl text-amber-600' />
                                                </p>
                                                <p className='ant-upload-text font-medium'>
                                                    Kéo thả hoặc click để tải ảnh lên
                                                </p>
                                                <p className='ant-upload-hint text-gray-500'>
                                                    Hỗ trợ tải nhiều ảnh cùng lúc
                                                </p>
                                            </Upload.Dragger>

                                            <Button
                                                type='primary'
                                                htmlType='submit'
                                                size='large'
                                                loading={loading}
                                                block
                                                className='h-14 border-none rounded-xl font-medium tracking-wide
                                                    bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 
                                                    hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700
                                                    shadow-lg hover:shadow-amber-200/50 transition-all duration-300'
                                            >
                                                <div className='relative z-10 flex items-center justify-center gap-2 text-base'>
                                                    <SendOutlined />
                                                    Gửi yêu cầu
                                                </div>
                                            </Button>
                                        </form>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                open={showSuccess}
                footer={null}
                onCancel={() => setShowSuccess(false)}
                width={400}
                centered
                className='success-modal'
            >
                <div className='text-center py-6'>
                    <CheckCircleFilled className='text-6xl text-green-500 mb-4' />
                    <h3 className='text-2xl font-serif text-gray-800 mb-2'>Gửi thông tin thành công!</h3>
                    <p className='text-gray-600 mb-6'>Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                    <Button
                        type='primary'
                        onClick={() => setShowSuccess(false)}
                        className='h-10 px-8 rounded-lg !bg-gradient-to-r from-green-600 to-green-500 
                        hover:!from-green-700 hover:!to-green-600 border-none'
                    >
                        Đóng
                    </Button>
                </div>
            </Modal>
        </>
    );
}
