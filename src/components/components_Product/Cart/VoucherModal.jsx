import { useState, useEffect, useMemo } from 'react';
import { Modal, TextInput, Button } from 'flowbite-react';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';

const VoucherModal_Component = ({ isOpen, onClose, onApplyVoucher }) => {
    const [vouchers, setVouchers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Get all vouchers
    useEffect(() => {
        const getAllVouchers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/client/get-all-coupon`);
                if (res?.status === 200) {
                    setVouchers(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllVouchers();
    }, []);

    const filteredVouchers = useMemo(() => {
        return vouchers.filter(
            (voucher) =>
                voucher.couponName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.description.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [vouchers, searchTerm]);

    return (
        <Modal show={isOpen} onClose={onClose} size='lg'>
            <Modal.Header>
                Watc<span className='text-yellow-400 font-bold'>H</span>es Khuyến mãi
            </Modal.Header>
            <Modal.Body>
                <div className='mb-4'>
                    <TextInput
                        type='text'
                        placeholder='Tìm kiếm mã giảm giá...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        icon={FiSearch}
                    />
                </div>
                <div className='space-y-4 max-h-[60vh] overflow-y-auto pr-2'>
                    {filteredVouchers.map((voucher) => (
                        <VoucherCard
                            key={voucher.id}
                            voucher={voucher}
                            onApplyVoucher={() => {
                                onApplyVoucher(voucher);
                                onClose();
                            }}
                        />
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onClose} className='w-full'>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const VoucherCard = ({ voucher, onApplyVoucher }) => {
    const formattedDate = new Date(voucher.expiryDate).toLocaleDateString('vi-VN');

    return (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-start space-x-4'>
            <div className='w-1/4 flex-shrink-0'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-full h-auto object-cover rounded-lg'
                />
            </div>
            <div className='flex-grow'>
                <h4 className='text-lg font-semibold'>{voucher.couponName}</h4>
                <p className='text-sm text-gray-600 dark:text-gray-300'>{voucher.description}</p>
                <div className='mt-2 flex items-center justify-between'>
                    <span className='text-sm text-gray-500'>HSD: {formattedDate}</span>
                    <Button onClick={onApplyVoucher} size='sm'>
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default VoucherModal_Component;
