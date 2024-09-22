import { Modal } from 'flowbite-react';
import { useState } from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import { RiCoupon3Fill } from 'react-icons/ri';

const CardVoucherMini = ({ voucher }) => {
    return (
        <div
            className='w-full border dark:border-gray-700 shadow-sm shadow-gray-200 
        rounded-lg p-3 flex items-center justify-between gap-x-2'
        >
            <div className='flex items-center justify-between gap-x-3'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-12 h-12 object-cover rounded-lg'
                />
                <span className='font-medium'>Giamr gias</span>
            </div>
            <button className='rounded-lg bg-blue-500 text-white px-3 py-1'>Áp dụng</button>
        </div>
    );
};

const CardVoucherFull = ({ voucher }) => {
    return (
        <div
            className='w-full border dark:border-gray-700 shadow-sm shadow-gray-200
        rounded-lg p-3 flex items-center justify-between gap-x-2 relative group'
        >
            <div className='w-1/4 group-hover:opacity-20 transition-opacity duration-300'>
                <img
                    src='https://salt.tikicdn.com/cache/128x128/ts/upload/b4/57/39/dde396bd53a086adf9d421877ad9259a.jpg'
                    alt='Logo Voucher'
                    className='w-full h-auto object-cover rounded-lg'
                />
            </div>

            <div className='w-3/4 flex flex-col gap-y-2 group-hover:opacity-20 transition-opacity duration-300'>
                <div className='flex justify-between'>
                    <div className='flex flex-col items-start'>
                        <span className='text-lg font-medium'>Giảm 25K phí vận chuyển</span>
                        <div className='flex'>
                            <span className='text-gray-400 text-sm'>Cho đơn hàng từ 100K</span>
                        </div>
                    </div>
                    <span className='text-blue-600 mt-1 cursor-pointer rounded-full border border-blue-600 w-5 h-5 flex justify-center items-center'>
                        i
                    </span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='text-gray-500'>HSD: 24/09/24</span>
                    <button className='rounded-lg bg-blue-500 text-white px-3 py-1'>Áp dụng</button>
                </div>
            </div>

            <div className='absolute z-50 hidden group-hover:flex flex-col bg-white border border-gray-300 p-3 rounded-lg shadow-lg top-9 right-5 w-60 opacity-100'>
                <span className='font-medium text-sm'>Chi tiết mã giảm giá:</span>
                <span className='text-gray-600 text-sm'>
                    Mã giảm giá: <strong>FREESHIP25K</strong>
                </span>
                <span className='text-gray-600 text-sm'>Hạn sử dụng: 24/09/24</span>
                <span className='text-gray-600 text-sm'>Điều kiện: Đơn hàng từ 100K</span>
            </div>
        </div>
    );
};

export default function Vouchers() {
    // state
    const [showModalVoucher, setShowModalVoucher] = useState(false);

    const applyVoucher = () => {};

    return (
        <>
            <div
                className='w-full shadow-sm border border-gray-200 dark:border-none dark:bg-gray-800 
            rounded-lg p-6 flex flex-col justify-center gap-y-3 relative'
            >
                <div className='flex justify-between items-center text-md'>
                    <span className='font-medium'>Mã khuyến mãi</span>
                    <span className='text-gray-500'>Có thể chọn</span>
                </div>
                <CardVoucherMini />
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
                    {/* <h1 className='text-xl font-medium'>Chọn hoặc nhập Khuyến mãi khác</h1> */}
                    <div className='flex flex-col gap-y-3 mt-3'>
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                        <CardVoucherFull />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={applyVoucher}
                        className='w-full rounded-lg bg-blue-500 text-white py-2'
                    >
                        Xong
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
