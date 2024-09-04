import React from 'react';

const SayThanks = () => {
    return (
        <div className='w-[60vw] border-2 border-blue-500 rounded-lg border-dashed mx-auto mt-5 mb-8 px-8 py-10 font-sans'>
            <p className='font-bold text-blue-500 text-2xl pb-4 text-center'>
                Những điều nhỏ bé{' '}
                <span
                    className='font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 
                dark:from-gray-500 dark:to-white italic'
                >
                    WatcHes
                </span>{' '}
                muốn gửi đến bạn
            </p>
            <ul className='list-disc text-lg font-sans pl-6'>
                <li className='pb-4'>
                    WatcHes hiểu rằng hành trình hoàn thiện trải nghiệm khách hàng là một thử thách
                    lớn lao. Tuy nhiên, với tâm huyết từ đội ngũ của mình và sự đóng góp quý báu từ
                    bạn, chúng tôi luôn nỗ lực không ngừng để mang đến sự hoàn thiện trong từng bước
                    đi.
                </li>
                <li>
                    Dù không phải là một hệ thống quá lớn, WatcHes cam kết rằng từ những chi tiết
                    nhỏ nhất đến từng khách hàng đơn lẻ, chúng tôi sẽ từng ngày, từng ngày nỗ lực
                    xây dựng đội ngũ, mang đến cho bạn trải nghiệm tuyệt vời nhất &#8209; tiếp nối
                    và phát huy những giá trị văn hóa phục vụ mà các thương hiệu lớn như MWG, The
                    Coffee House… đã gây dựng.
                </li>
            </ul>
        </div>
    );
};

export default SayThanks;
