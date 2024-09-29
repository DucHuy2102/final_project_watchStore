import axios from 'axios';
import { Modal } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { RiCoupon3Fill } from 'react-icons/ri';
import CardVoucherFull from './CardVoucherFull';
import CardVoucherMini from './CardVoucherMini';

export default function Vouchers() {
    // state
    const [showModalVoucher, setShowModalVoucher] = useState(false);
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const getAllVouchers = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/client/get-all-coupon`
                );
                if (res.status === 200) {
                    setVouchers(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllVouchers();
    }, []);

    const applyVoucher = () => {
        console.log('Apply voucher');
    };

    return (
        <>
            <div
                className='w-full shadow-sm border border-gray-200 dark:border-none dark:bg-gray-800 
            rounded-lg p-6 flex flex-col justify-center gap-y-3 relative'
            >
                <div className='flex justify-between items-center text-md'>
                    <span className='font-medium'>Mã khuyến mãi</span>
                    <span className='text-gray-500'>
                        Có thể chọn{' '}
                        <span className='font-bold text-blue-500'>{vouchers.length}</span> mã
                    </span>
                </div>
                {vouchers?.length > 0 && (
                    <CardVoucherMini voucher={vouchers[0]} onApplyVoucher={applyVoucher} />
                )}
                <div
                    onClick={() => setShowModalVoucher(true)}
                    className='flex items-center gap-x-1'
                >
                    <RiCoupon3Fill className='text-blue-600' />
                    <span className='cursor-pointer text-blue-600'>
                        Chọn hoặc nhập Khuyến mãi khác
                    </span>
                </div>
            </div>

            {/* Modal change address */}
            <Modal
                show={showModalVoucher}
                onClose={() => setShowModalVoucher(false)}
                size='md'
                popup
                className='overflow-visible'
            >
                <Modal.Header>
                    Watc<span className='text-yellow-400 font-bold'>H</span>es Khuyến mãi
                </Modal.Header>
                <Modal.Body>
                    <div className='flex flex-col gap-y-3 mt-3'>
                        {vouchers?.map((voucher) => {
                            return (
                                <CardVoucherFull
                                    key={voucher.id}
                                    voucher={voucher}
                                    onApplyVoucher={applyVoucher}
                                />
                            );
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => setShowModalVoucher(false)}
                        className='w-full rounded-lg bg-blue-500 text-white py-2'
                    >
                        Xong
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
