import { Footer } from 'flowbite-react';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

export const SITEMAP = [
    {
        title: 'Công ty',
        links: ['Về chúng tôi', 'Sự phát triển', 'Đội ngũ hoạt động', 'Các dự án'],
    },
    {
        title: 'Trung tâm trợ giúp',
        links: ['Discord', 'Twitter', 'GitHub', 'Facebook'],
    },
    {
        title: 'Tài nguyên khác',
        links: ['Các bài blog', 'Tin tức đồng hồ', 'Sản phẩm trải nghiệm', 'Dịch vụ quảng cáo'],
    },
    {
        title: 'Thông tin liên hệ',
        links: [
            'Địa chỉ: 1 Võ Văn Ngân, Phường Linh Chiểu, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
            'Số điện thoại: 0979657587',
            'Email: cskh-watcHes@gmail.com',
            'Giờ mở cửa: 8h - 22h00, Thứ 2 - Thứ 7',
        ],
    },
];

export default function Footer_Component() {
    // get current year
    const currentYear = new Date().getFullYear();
    const { pathname } = useLocation();

    return (
        <Footer
            container
            className={`${
                pathname === '/register' ||
                pathname === '/login' ||
                pathname === '/forgot-password' ||
                pathname === '/verify-email'
                    ? 'hidden sm:hidden md:hidden lg:hidden'
                    : 'block'
            } border border-t-8 border-gray-500`}
        >
            <div className='w-full px-4 md:px-8'>
                <div className='grid w-full grid-cols-1 gap-8 py-8 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {SITEMAP.map(({ title, links }, index) => (
                        <div key={index}>
                            <Footer.Title title={title} />
                            <Footer.LinkGroup col={true}>
                                {links.map((link, index) => (
                                    <Footer.Link
                                        key={index}
                                        href='#'
                                        className='hover:text-gray-500'
                                    >
                                        {link}
                                    </Footer.Link>
                                ))}
                            </Footer.LinkGroup>
                        </div>
                    ))}
                </div>

                <Footer.Divider />
                <div className='w-full flex flex-col items-center justify-center sm:flex-row sm:justify-between py-4 px-6 text-center'>
                    <div className='flex flex-col justify-center items-center mb-2 sm:mb-0'>
                        <span className='text-sm text-gray-500 font-medium'>
                            Trường Đại học Sư phạm Kỹ thuật
                        </span>
                        <span className='text-sm text-gray-500 font-medium'>
                            Thành phố Hồ Chí Minh
                        </span>
                    </div>
                    <span className='text-sm text-gray-500 font-medium'>
                        &copy; {currentYear}{' '}
                        <a href='https://material-tailwind.com/'>Nguyễn Đức Huy</a> -{' '}
                        <a href='https://www.facebook.com/profile.php?id=100011281114118'>
                            Huỳnh Lê Huy
                        </a>
                    </span>
                    <div className='mt-4 flex space-x-6 sm:mt-0'>
                        <Footer.Icon
                            href='https://www.facebook.com/Duc.Huy2102'
                            icon={FaFacebook}
                        />
                        <Footer.Icon
                            href='https://github.com/DucHuy2102/final_project_watchStore.git'
                            icon={FaGithub}
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );
}
