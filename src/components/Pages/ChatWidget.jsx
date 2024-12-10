import { Input } from 'antd';
import { Button, Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { CgPhone } from 'react-icons/cg';
import { FaRocketchat } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [modalTele, setModalTele] = useState(false);
    const wrapperRef = useRef(null);

    const chatOptions = [
        {
            id: 1,
            title: 'Chat trên Zalo',
            icon: <img src={'./assets/zalo.png'} alt='Zalo' className='w-6 h-6' />,
            link: `https://zalo.me/${import.meta.env.VITE_ZALO_ID}`,
        },
        // {
        //     id: 2,
        //     title: 'Yêu cầu gọi lại',
        //     icon: <CgPhone className='text-blue-600 w-5 h-5 group-hover:text-white transition-all duration-200' />,
        //     link: 'tel:your-phone-number',
        // },
    ];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = (option) => {
        if (option.id === 2) {
            setModalTele(true);
        } else {
            window.open(option.link, '_blank');
        }
    };

    return (
        <div ref={wrapperRef} className='fixed bottom-6 right-6 z-50 flex flex-col items-end'>
            {isOpen && (
                <div className='bg-white rounded-xl shadow-2xl p-4 mb-4 transform transition-all duration-300 ease-in-out w-58'>
                    <div className='mb-3 pb-2 border-b border-gray-100'>
                        <h3 className='text-lg text-center font-semibold text-gray-800'>Liên hệ với chúng tôi</h3>
                    </div>
                    {chatOptions.map((option) => (
                        <div
                            key={option.id}
                            className='flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg mb-2 transition-all duration-200 group cursor-pointer'
                            onClick={() => handleClick(option)}
                        >
                            <span className='w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-all duration-200'>
                                {option.icon}
                            </span>
                            <span className='font-medium text-gray-700 hover:text-blue-600 transition-colors'>
                                {option.title}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className='w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl self-end'
            >
                {isOpen ? <IoMdClose className='text-2xl' /> : <FaRocketchat className='text-2xl' />}
            </button>

            {/* <Modal show={modalTele} onClose={() => setModalTele(false)} popup size={'md'} className='backdrop-blur-sm'>
                <Modal.Header />
                <Modal.Body className='px-6 pb-8'>
                    <div className='flex flex-col items-center gap-6'>
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold text-gray-800 mb-3'>Yêu cầu gọi lại</h1>
                            <p className='text-gray-600 text-sm leading-relaxed max-w-md'>
                                Vui lòng nhập số điện thoại bên dưới để chúng tôi gọi lại cho bạn trong thời gian sớm
                                nhất
                            </p>
                        </div>

                        <div className='w-full space-y-4'>
                            <Input
                                autoFocus
                                type='tel'
                                placeholder='Nhập số điện thoại'
                                className='py-2.5 text-lg rounded-lg shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            />
                            <p className='text-gray-600 text-sm text-center leading-relaxed max-w-md'>
                                Gọi Hotline tư vấn miễn phí{' '}
                                <span className='font-bold text-blue-500'>039 484 9668</span>
                            </p>
                            <Button type='primary' color={'blue'} className='w-full py-2.5'>
                                Gửi yêu cầu
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal> */}
        </div>
    );
}
