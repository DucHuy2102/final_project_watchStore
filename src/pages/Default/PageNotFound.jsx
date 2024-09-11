import { Link } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <div className='h-screen flex flex-col items-center justify-center'>
            <p className='text-[10rem] font-bold mb-3 text-transparent bg-gradient-to-r from-sky-500 to-red-500 bg-clip-text'>
                Lỗi!
            </p>
            <p className='uppercase text-xl font-bold mb-3'>404 - Không tìm thấy trang</p>
            <p className='mb-3 text-lg'>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link
                to='/'
                className='transition ease-in-out duration-300 hover:scale-110 hover:bg-blue-500 uppercase text-lg px-7 py-4 text-center rounded-xl bg-black text-white hover:border-none'
            >
                trở lại trang chủ
            </Link>
        </div>
    );
}
