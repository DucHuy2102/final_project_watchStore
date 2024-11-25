import React from 'react';

const SayThanks = () => {
    return (
        <div className='max-w-4xl mx-auto my-16 px-4 sm:px-6 lg:px-8'>
            <div
                className='relative p-8 sm:p-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl
        border-2 border-blue-500/30 dark:border-blue-400/30'
            >
                <div
                    className='absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 
            rounded-2xl opacity-10 blur'
                ></div>
                <div className='relative'>
                    <p
                        className='font-bold text-3xl pb-6 text-center bg-clip-text text-transparent 
                bg-gradient-to-r from-blue-600 to-blue-400'
                    >
                        Những điều nhỏ bé{' '}
                        <span
                            className='font-semibold italic bg-clip-text text-transparent 
                    bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 
                    dark:from-gray-300 dark:to-gray-100'
                        >
                            WatcHes
                        </span>{' '}
                        muốn gửi đến bạn
                    </p>
                    <ul className='list-disc text-lg font-sans pl-6'>
                        <li className='pb-4'>
                            WatcHes hiểu rằng hành trình hoàn thiện trải nghiệm khách hàng là một thử thách lớn lao. Tuy
                            nhiên, với tâm huyết từ đội ngũ của mình và sự đóng góp quý báu từ bạn, chúng tôi luôn nỗ
                            lực không ngừng để mang đến sự hoàn thiện trong từng bước đi.
                        </li>
                        <li>
                            Dù không phải là một hệ thống quá lớn, WatcHes cam kết rằng từ những chi tiết nhỏ nhất đến
                            từng khách hàng đơn lẻ, chúng tôi sẽ từng ngày, từng ngày nỗ lực xây dựng đội ngũ, mang đến
                            cho bạn trải nghiệm tuyệt vời nhất &#8209; tiếp nối và phát huy những giá trị văn hóa phục
                            vụ mà các thương hiệu lớn như MWG, The Coffee House… đã gây dựng.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SayThanks;
