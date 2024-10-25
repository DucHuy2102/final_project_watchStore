import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
    return (
        <div
            className='h-screen max-w-md w-full mx-auto 
            flex flex-col items-center justify-center gap-y-1'
        >
            <img src={'/assets/pageNotFound.jpg'} alt='Image page not found' />
            <span className='text-lg font-semibold'>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</span>
            <Link className='w-full py-1' to={'/'}>
                <Button className='w-full transition ease-in-out duration-300 hover:scale-110' outline>
                    Trở lại trang chủ
                </Button>
            </Link>
        </div>
    );
}
