export const formatWatchDescription = (description, watchName) => {
    if (!description) return '';

    let formatted = description
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/([.!?])\s*/g, '$1 ');

    const sentences = formatted.match(/[^.!?]+[.!?]+/g) || [];
    const chunks = [];
    let currentChunk = [];

    sentences.forEach((sentence, index) => {
        currentChunk.push(sentence.trim());
        if (currentChunk.length >= (index % 2 === 0 ? 2 : 3) || index === sentences.length - 1) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
        }
    });

    return chunks
        .map((chunk) => {
            const highlightedText = chunk.replace(
                new RegExp(watchName, 'gi'),
                `<span class="font-semibold text-gray-900 dark:text-white">${watchName}</span>`,
            );
            return highlightedText;
        })
        .join('\n');
};

export const prProduct = [
    {
        id: 1,
        url: '//timex.com/cdn/shop/files/Steel.svg?v=1688056464&width=40',
        title: 'Chất liệu vỏ đồng hồ',
        description: 'Vỏ đồng hồ được làm từ các chất liệu cao cấp, mang đến độ bền và sang trọng cho sản phẩm.',
    },
    {
        id: 2,
        url: '//timex.com/cdn/shop/files/Adjustable_Watch.svg?v=1688056476&width=40',
        title: 'Chất lượng dây đồng hồ',
        description:
            'Dây đồng hồ được làm từ các chất liệu chọn lọc, có khả năng chịu nước ở độ sâu nhất định, giúp thoải mái sử dụng trong mọi hoàn cảnh.',
    },
    {
        id: 3,
        url: '//timex.com/cdn/shop/files/Stopwatch_bc7a4d6c-d8af-4131-a0f5-a68fa54e5f5c.svg?v=1688056464&width=40',
        title: 'Đồng hồ bấm giờ',
        description:
            'Đồng hồ có tính năng bấm giờ chính xác, kích thước mặt đồng hồ phù hợp với cỡ cổ tay của bạn, giúp tự tin và thoải mái hơn khi đeo.',
    },
    {
        id: 4,
        url: '//timex.com/cdn/shop/files/Water_Resistant.svg?v=1687971970&width=40',
        title: 'Khả năng chống nước',
        description:
            'Đồng hồ có khả năng chống nước đáp ứng các tiêu chuẩn an toàn, dây đồng hồ được làm từ chất liệu cao cấp, giúp bạn thoải mái sử dụng trong thời gian dài.',
    },
    {
        id: 5,
        url: 'https://timex.com/cdn/shop/files/Calendar.svg?v=1687971335&width=40',
        title: 'Tính năng xem ngày',
        description:
            'Đồng hồ có tính năng xem ngày hiện đại và tiện dụng, độ dày phù hợp với cỡ cổ tay của bạn, giúp tự tin và thoải mái hơn khi sử dụng.',
    },
    {
        id: 6,
        url: 'https://timex.com/cdn/shop/files/Fits_Wrist.svg?v=1688403513&width=40',
        title: 'Tương thích với cỡ cổ tay',
        description:
            'Đồng hồ nhẹ và tương thích với mọi cỡ cổ tay, trọng lượng nhẹ giúp bạn thoải mái sử dụng trong thời gian dài mà không gây khó chịu.',
    },
];

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
