import { Footer } from 'flowbite-react';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { SITEMAP } from '../Utils/infomationComponent';

export default function Footer_Component() {
    const currentYear = new Date().getFullYear();
    const { pathname } = useLocation();

    const shouldHideFooter =
        ['/register', '/cart', '/login', '/forgot-password', '/verify-email', '/dashboard'].includes(pathname) ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/reset-password');

    if (shouldHideFooter) {
        return null;
    }

    return (
        <Footer
            container
            className='border-t-8 border-gray-300 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800'
        >
            <div className='w-full px-4 md:px-8'>
                <div className='grid w-full grid-cols-1 gap-8 py-5 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                    {SITEMAP.map(({ title, links }, index) => (
                        <div key={index} className='hover:-translate-y-1 transition-transform duration-300 ease-in-out'>
                            <Footer.Title title={title} className='text-lg font-bold text-gray-800 mb-4' />
                            <Footer.LinkGroup col={true}>
                                {links.map((link, index) => (
                                    <Footer.Link
                                        key={index}
                                        href='#'
                                        className='hover:text-blue-600 duration-300 text-gray-600 hover:translate-x-1 
                                        transform transition-transform inline-block'
                                    >
                                        {link}
                                    </Footer.Link>
                                ))}
                            </Footer.LinkGroup>
                        </div>
                    ))}
                </div>

                <Footer.Divider className='opacity-50' />
                <div className='w-full flex flex-col items-center justify-center sm:flex-row sm:justify-between px-6 text-center'>
                    <div className='flex flex-col justify-center items-center mb-4 sm:mb-0 hover:scale-105 transition-transform duration-300'>
                        <span className='text-sm text-gray-700 font-semibold'>Trường Đại học Sư phạm Kỹ thuật</span>
                        <span className='text-sm text-gray-700 font-semibold'>Thành phố Hồ Chí Minh</span>
                    </div>
                    <span className='text-sm text-gray-700 font-semibold hover:text-blue-600 transition-colors duration-300'>
                        &copy; {currentYear}{' '}
                        <a href='https://material-tailwind.com/' className='hover:text-blue-700'>
                            Nguyễn Đức Huy
                        </a>{' '}
                        -{' '}
                        <a
                            href='https://www.facebook.com/profile.php?id=100011281114118'
                            className='hover:text-blue-700'
                        >
                            Huỳnh Lê Huy
                        </a>
                    </span>
                    <div className='mt-4 flex space-x-6 sm:mt-0'>
                        <Footer.Icon
                            href='https://www.facebook.com/Duc.Huy2102'
                            icon={FaFacebook}
                            className='hover:scale-125 transition-transform duration-300 text-gray-700 hover:text-blue-600'
                        />
                        <Footer.Icon
                            href='https://github.com/DucHuy2102/final_project_watchStore.git'
                            icon={FaGithub}
                            className='hover:scale-125 transition-transform duration-300 text-gray-700 hover:text-gray-900'
                        />
                    </div>
                </div>
            </div>
        </Footer>
    );

    // return (
    //     <Footer
    //         container
    //         className={`${
    //             pathname === '/register' ||
    //             pathname === '/cart' ||
    //             pathname === '/login' ||
    //             pathname === '/forgot-password' ||
    //             pathname === '/verify-email' ||
    //             pathname === '/dashboard' ||
    //             pathname.startsWith('/admin')
    //                 ? 'hidden sm:hidden md:hidden lg:hidden'
    //                 : 'block'
    //         } border border-t-8 border-gray-300`}
    //     >
    //         <div className='w-full px-4 md:px-8'>
    //             <div className='grid w-full grid-cols-1 gap-8 py-8 px-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
    //                 {SITEMAP.map(({ title, links }, index) => (
    //                     <div key={index}>
    //                         <Footer.Title title={title} />
    //                         <Footer.LinkGroup col={true}>
    //                             {links.map((link, index) => (
    //                                 <Footer.Link key={index} href='#' className='hover:text-gray-500'>
    //                                     {link}
    //                                 </Footer.Link>
    //                             ))}
    //                         </Footer.LinkGroup>
    //                     </div>
    //                 ))}
    //             </div>

    //             <Footer.Divider />
    //             <div className='w-full flex flex-col items-center justify-center sm:flex-row sm:justify-between py-4 px-6 text-center'>
    //                 <div className='flex flex-col justify-center items-center mb-2 sm:mb-0'>
    //                     <span className='text-sm text-gray-500 font-medium'>Trường Đại học Sư phạm Kỹ thuật</span>
    //                     <span className='text-sm text-gray-500 font-medium'>Thành phố Hồ Chí Minh</span>
    //                 </div>
    //                 <span className='text-sm text-gray-500 font-medium'>
    //                     &copy; {currentYear} <a href='https://material-tailwind.com/'>Nguyễn Đức Huy</a> -{' '}
    //                     <a href='https://www.facebook.com/profile.php?id=100011281114118'>Huỳnh Lê Huy</a>
    //                 </span>
    //                 <div className='mt-4 flex space-x-6 sm:mt-0'>
    //                     <Footer.Icon href='https://www.facebook.com/Duc.Huy2102' icon={FaFacebook} />
    //                     <Footer.Icon
    //                         href='https://github.com/DucHuy2102/final_project_watchStore.git'
    //                         icon={FaGithub}
    //                     />
    //                 </div>
    //             </div>
    //         </div>
    //     </Footer>
    // );
}
