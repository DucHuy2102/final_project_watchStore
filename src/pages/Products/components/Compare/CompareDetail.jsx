import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'flowbite-react';
import { BsArrowLeft } from 'react-icons/bs';
import { motion } from 'framer-motion';
import { Image } from 'antd';
import { useEffect, useState } from 'react';
import { clearCompare } from '../../../../services/redux/slices/productSlice';

const priceFormat = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price);
};

const sizeFormat = (length, width, height) => {
    return `${height} x ${width} x ${length} mm`;
};

export default function CompareDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { compareProducts } = useSelector((state) => state.product);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>
                        Hệ thống đang tải. Vui lòng chờ trong giây lát...
                    </p>
                </div>
            </div>
        );
    }

    if (compareProducts.length === 0) {
        return (
            <div className='h-screen flex flex-col items-center justify-center relative'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='space-y-6 flex flex-col items-center justify-center relative z-10'
                >
                    <img src='/assets/compare.jpg' alt='compare' className='w-[35vw] h-auto object-cover' />
                    <p className='text-2xl font-serif text-amber-600 dark:text-amber-300/80'>
                        Không có sản phẩm để so sánh
                    </p>
                    <button
                        onClick={() => navigate('/products')}
                        className='!bg-transparent hover:!bg-amber-400/10 border border-amber-400/20 flex items-center
                        text-amber-600 dark:text-amber-300 transition-all duration-300 rounded-lg px-5 py-1.5'
                    >
                        <BsArrowLeft className='mr-2' /> Trở lại trang sản phẩm
                    </button>
                </motion.div>
            </div>
        );
    }

    const getAIComparison = (products) => {
        const differences = [];

        // price
        const priceDiff = Math.abs(products[0].option[0].value.price - products[1].option[0].value.price);
        const expensiveProduct =
            products[0].option[0].value.price > products[1].option[0].value.price ? products[0] : products[1];
        const cheaperProduct =
            products[0].option[0].value.price > products[1].option[0].value.price ? products[1] : products[0];
        if (products[0].option[0].value.price === products[1].option[0].value.price) {
            differences.push({
                title: 'Chênh lệch giá',
                description: `Đồng hồ ${expensiveProduct.productName} và đồng hồ ${cheaperProduct.productName} là hai sản phầm đồng giá`,
                recommendation:
                    priceDiff >= 1000000
                        ? `Sản phẩm tuy đồng giá tiền (${priceFormat(
                              products[0].option[0].value.price,
                          )}) nhưng xét về mặt giá trị của chúng lại có nhiều điểm khác nhau, hãy xem xét các tiêu chí khác để lựa chọn sản phẩm phù hợp với bạn nhé!`
                        : `Sản phẩm có giá trị tương đối phù hợp với tài chính của bạn (chỉ ${priceFormat(
                              products[0].option[0].value.price,
                          )}). Nhớ xem xét thêm các tiêu chí khác để lựa chọn sản phẩm phù hợp với nhu cầu của bạn nhé!`,
            });
        } else {
            differences.push({
                title: 'Chênh lệch giá',
                description: `Đồng hồ ${expensiveProduct.productName} đắt hơn ${priceFormat(
                    priceDiff,
                )} so với đồng hồ ${cheaperProduct.productName}`,
                recommendation:
                    priceDiff >= 1000000
                        ? 'Chênh lệch giá đáng kể (hơn 1 triệu đồng), cần cân nhắc kỹ về ngân sách và nhu cầu sử dụng bạn nhé'
                        : `Chênh lệch giá không quá lớn (chỉ ${priceFormat(
                              priceDiff,
                          )}), có thể quyết định mua đồng hồ phù hợp với nhu cầu sử dụng của bạn.`,
            });
        }

        // style
        if (products[0].style === products[1].style) {
            differences.push({
                title: 'Phong cách thiết kế',
                description: `Sản phẩm ${products[0].productName} và sản phẩm ${products[1].productName} đều có cùng một phong cách thiết kế là ${products[0].style}`,
                recommendation: `Phong cách thiết kế ${products[0].style} là lựa chọn phổ biến, phù hợp với nhiều phong cách và dễ kết hợp trang phục, thích hợp cho các dịp sự kiện và các hoạt động thường ngày.`,
            });
        } else {
            differences.push({
                title: 'Phong cách thiết kế',
                description: `${products[0].productName} mang phong cách ${products[0].style}, trong khi ${products[1].productName} theo phong cách ${products[1].style}`,
                recommendation: `Nếu bạn thích phong cách ${products[0].style}, hãy chọn ${products[0].productName}. Nhưng hãy nhớ lựa chọn phù hợp với mục đích sử dụng của bạn nhé`,
            });
        }

        // wire material
        if (products[0].wireMaterial === products[1].wireMaterial) {
            differences.push({
                title: 'Chất liệu dây',
                description: `Cả hai sản phẩm ${products[0].productName} và ${products[1].productName} có cùng chất liệu dây là ${products[0].wireMaterial}`,
                recommendation: `${products[0].wireMaterial} là lựa chọn phổ biến cho đồng hồ, đảm bảo cho ${
                    products[0].wireMaterial === 'Dây cao su'
                        ? 'sự mềm mại, bền bỉ, phù hợp cho hoạt động thể thao và chống nước,'
                        : products[0].wireMaterial === 'Dây nhựa'
                        ? 'sự nhẹ nhàng, thoải mái, phù hợp cho hoạt động sinh hoạt hàng ngày,'
                        : products[0].wireMaterial === 'Dây da'
                        ? 'sự thanh lịch, cổ điển, phù hợp cho những dịp sang trọng,'
                        : products[0].wireMaterial === 'Dây kim loại'
                        ? 'sự bền bỉ, chống nước tốt, phù hợp với phong cách năng động, lịch lãm,'
                        : products[0].wireMaterial === 'Dây dù/vải'
                        ? 'sự đẹp mắt, thoải mái và nhẹ nhàng, phù hợp cho phong cách năng động và các hoạt động thường ngày,'
                        : products[0].wireMaterial === 'Dây thép không gỉ'
                        ? 'sự bền bỉ, độ bền cao, chống nước tốt, phù hợp với nhiều hoạt động,'
                        : products[0].wireMaterial === 'Dây dù/vải'
                        ? 'sự đẹp mắt, thoải mái và nhẹ nhàng, phù hợp cho phong cách năng động và các hoạt động thường ngày,'
                        : 'sự sang trọng, đẳng cấp, thể hiện sự tinh tế và quý phái,'
                } nhưng hãy cân nhắc lựa chọn sản phẩm phù hợp nhu cầu và môi trường sử dụng của bạn`,
            });
        } else {
            differences.push({
                title: 'Chất liệu dây',
                description: `Dây đồng hồ: ${products[0].productName} (${products[0].wireMaterial}) vs ${products[1].productName} (${products[1].wireMaterial})`,
                recommendation:
                    products[0].wireMaterial === 'Dây cao su'
                        ? `Dành cho những bạn thích sự mềm mại, bền bỉ, phù hợp cho hoạt động thể thao và chống nước, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : products[0].wireMaterial === 'Dây nhựa'
                        ? `Dành cho những bạn thích sự nhẹ nhàng, thoải mái, phù hợp cho hoạt động sinh hoạt hàng ngày, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : products[0].wireMaterial === 'Dây da'
                        ? `Dành cho những bạn thích sự thanh lịch, cổ điển, phù hợp cho những dịp sang trọng, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : products[0].wireMaterial === 'Dây kim loại'
                        ? `Dành cho những bạn thích sự bền bỉ, chống nước tốt, phù hợp với phong cách năng động, lịch lãm thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : products[0].wireMaterial === 'Dây thép không gỉ'
                        ? `Dành cho những bạn thích sự bền bỉ, độ bền cao, chống nước tốt, phù hợp với nhiều hoạt động, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : products[0].wireMaterial === 'Dây dù/vải'
                        ? `Dành cho những bạn thích sự đẹp mắt, thoải mái và nhẹ nhàng, phù hợp cho phong cách năng động và các hoạt động thường ngày, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợp nhu cầu của bạn nhé`
                        : `Dành cho những bạn thích sự sang trọng, đẳng cấp, thể hiện sự tinh tế và quý phái, thì ${products[0].productName} là lựa chọn tốt dành cho bạn. Nhưng nhớ cân nhắc theo lựa chọn phù hợpnhu cầu của bạn nhé`,
            });
        }

        // shape
        if (products[0].shape === products[1].shape) {
            differences.push({
                title: 'Hình dạng mặt đồng hồ',
                description: `Cả hai sản phẩm ${products[0].productName} và ${
                    products[1].productName
                } đều có ${products[0].shape.toLowerCase()}`,
                recommendation: `${products[0].shape} là lựa chọn phổ biến và an toàn, phù hợp với mọi phong cách và dễ kết hợp trang phục. Hình dạng mặt đồng hồ này sẽ rất phù hợp với phong cách của bạn, nhưng hãy nhớ cân nhắc các tiêu chí khác nữa nhé!`,
            });
        } else {
            differences.push({
                title: 'Hình dạng mặt đồng hồ',
                description: `${products[0].productName} có ${products[0].shape.toLowerCase()}, trong khi ${
                    products[1].productName
                } có ${products[1].shape.toLowerCase()}`,
                recommendation:
                    products[0].shape === 'Mặt vuông'
                        ? 'Dành cho người yêu thích sự cá tính và phá cách. Tạo ấn tượng khác biệt nhưng vẫn giữ nét sang trọng, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt vuông'
                        : products[0].shape === 'Mặt tròn'
                        ? 'Phù hợp với mọi phong cách và dễ kết hợp trang phục. Lựa chọn an toàn cho người thích sự cổ điển, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt tròn'
                        : products[0].shape === 'Mặt hình chữ nhật'
                        ? 'Thiết kế thanh lịch, tinh tế, phù hợp cho người thích vẻ đẹp cổ điển hoặc phong cách lịch lãm, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt hình chữ nhật'
                        : products[0].shape === 'Mặt tam giác'
                        ? 'Lựa chọn độc đáo và hiếm gặp, dành cho những ai thích thể hiện cá tính mạnh mẽ và khác biệt, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt tam giác'
                        : products[0].shape === 'Mặt bầu dục'
                        ? 'Mang lại sự mềm mại, thanh thoát, phù hợp với người thích sự tinh tế và nhẹ nhàng, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt bầu dục'
                        : products[0].shape === 'Mặt Tonneau'
                        ? 'Thiết kế lạ mắt và sang trọng, thích hợp cho người tìm kiếm phong cách khác biệt nhưng không quá phô trương, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt Tonneau'
                        : products[0].shape === 'Mặt Carage'
                        ? 'Hiếm và độc đáo, lựa chọn lý tưởng cho người thích sưu tầm và muốn sở hữu mẫu đồng hồ độc nhất, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt Carage'
                        : products[0].shape === 'Mặt Cushion'
                        ? 'Kết hợp hài hòa giữa cổ điển và hiện đại, phù hợp cho người muốn một thiết kế khác lạ nhưng không quá nổi bật, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt Cushion'
                        : 'Phong cách mạnh mẽ, sắc nét, lý tưởng cho người yêu thích sự góc cạnh và muốn thể hiện bản lĩnh, thì gợi ý tốt nhất dành cho bạn là chọn đồng hồ mặt Cushion',
            });
        }

        // recommendation
        differences.push({
            title: 'Đề xuất sử dụng',
            description: `Dựa trên các thông số kỹ thuật và phong cách`,
            recommendation: `${products[0].productName} ${
                products[0].waterproof > 10
                    ? 'thích hợp cho người năng động, thường xuyên vận động và có thể sử dụng trong môi trường ẩm ướt'
                    : products[0].style === 'Thể thao'
                    ? 'phù hợp với phong cách năng động, lý tưởng cho các hoạt động thể thao'
                    : 'phù hợp với phong cách lịch lãm, thích hợp cho các sự kiện trang trọng'
            }, trong khi ${products[1].productName} ${
                products[1].waterproof > 10
                    ? 'thích hợp cho người năng động, thường xuyên vận động và có thể sử dụng trong môi trường ẩm ướt'
                    : products[1].style === 'Thể thao'
                    ? 'phù hợp với phong cách năng động, lý tưởng cho các hoạt động thể thao'
                    : 'phù hợp với phong cách lịch lãm, thích hợp cho các sự kiện trang trọng'
            }. Hãy cân nhắc nhu cầu sử dụng và môi trường hoạt động của bạn để lựa chọn sản phẩm phù hợp.`,
        });

        // value assessment
        const priceRatio =
            Math.max(products[0].option[0].value.price, products[1].option[0].value.price) /
            Math.min(products[0].option[0].value.price, products[1].option[0].value.price);
        if (priceRatio > 1.2) {
            const expensiveProduct =
                products[0].option[0].value.price > products[1].option[0].value.price ? products[0] : products[1];
            const cheaperProduct =
                products[0].option[0].value.price > products[1].option[0].value.price ? products[1] : products[0];

            const expensiveFeatures = expensiveProduct?.feature?.split(', ') || [];
            const cheaperFeatures = cheaperProduct?.feature?.split(', ') || [];

            differences.push({
                title: 'Đánh giá giá trị',
                description: 'Phân tích chi phí - lợi ích dựa trên tính năng và chất lượng',
                recommendation: `${cheaperProduct.productName} có giá trị tốt hơn về mặt chi phí. Tuy nhiên, ${
                    expensiveProduct.productName
                } ${
                    expensiveProduct?.waterproof > cheaperProduct?.waterproof
                        ? 'có khả năng chống nước tốt hơn và '
                        : ''
                }${
                    expensiveFeatures.length > cheaperFeatures.length
                        ? 'có nhiều tính năng hơn, bao gồm: ' + expensiveProduct.feature
                        : 'có thiết kế cao cấp hơn, với chất liệu và hoàn thiện tốt hơn'
                }. Hãy cân nhắc giữa chi phí và các tính năng bổ sung để đưa ra quyết định phù hợp.`,
            });
        }

        return differences;
    };

    const ComparisonRow = ({ value, className = '' }) => (
        <div
            className={`p-6 bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 
            dark:border-white/10 rounded-xl transition-all duration-300 hover:border-amber-400/30
            min-h-[80px] flex items-center ${className}`}
        >
            <span className='text-gray-800 dark:text-white/80 font-medium'>{value}</span>
        </div>
    );

    return (
        <div className='min-h-screen bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white/90 p-8'>
            <div className='max-w-7xl mx-auto'>
                {/* header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='flex justify-between items-center mb-12 pb-5 border-b border-gray-200 dark:border-gray-700/50'
                >
                    <div className='flex items-center gap-4'>
                        <button
                            onClick={() => navigate('/products')}
                            className='!bg-transparent hover:!bg-amber-400/10 border border-amber-400/20 
                            text-amber-600 dark:text-amber-300 transition-all duration-300 flex items-center rounded-lg px-5 py-1.5'
                        >
                            <BsArrowLeft className='mr-2' /> Trở lại
                        </button>
                        <h1 className='text-3xl font-serif tracking-wide bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-200 dark:to-yellow-400 bg-clip-text text-transparent'>
                            So sánh sản phẩm
                        </h1>
                    </div>
                    <Button color='failure' onClick={() => dispatch(clearCompare())} className='px-5 py-1.5'>
                        Xóa so sánh
                    </Button>
                </motion.div>

                {/* body */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className='grid grid-cols-3 gap-6'
                >
                    <div className='space-y-6'>
                        <div className='h-[400px]'>
                            <img
                                src='/assets/compareStore.jpg'
                                alt='compare'
                                className='w-full h-full object-cover rounded-lg'
                            />
                        </div>
                        {[
                            'Tên sản phẩm',
                            'Giá',
                            'Kích thước',
                            'Chất liệu dây',
                            'Chất liệu vỏ',
                            'Hình dạng mặt',
                            'Độ chống nước',
                            'Trọng lượng',
                            'Kiểu dáng',
                        ].map((label, index) => (
                            <div
                                key={index}
                                className='font-montserrat text-lg p-6 bg-gray-50 dark:bg-white/5 backdrop-blur-sm min-h-[80px]
                                border border-gray-200 dark:border-white/10 rounded-xl text-amber-600 dark:text-amber-200'
                            >
                                {label}
                            </div>
                        ))}
                    </div>

                    {compareProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='space-y-6'
                        >
                            <div className='h-[400px] group'>
                                <Image
                                    src={product.img[0]}
                                    alt={product.productName}
                                    className='w-full h-full p-5 object-cover transition-transform duration-500 group-hover:scale-110'
                                    preview={{
                                        mask: (
                                            <div
                                                className='text-sm font-medium bg-black/50 backdrop-blur-sm 
                                                text-white px-3 py-1 rounded-full'
                                            >
                                                Xem ảnh
                                            </div>
                                        ),
                                    }}
                                />
                            </div>

                            <ComparisonRow value={product.productName} className='font-semibold' />
                            <ComparisonRow
                                value={priceFormat(product.option[0].value.price - product.option[0].value.discount)}
                            />
                            <ComparisonRow value={sizeFormat(product.length, product.width, product.height)} />
                            <ComparisonRow value={product.wireMaterial} />
                            <ComparisonRow value={product.shellMaterial} />
                            <ComparisonRow value={product.shape} />
                            <ComparisonRow value={`${product.waterproof} ATM`} />
                            <ComparisonRow value={`${product.weight} gram`} />
                            <ComparisonRow value={product.style} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* analysis */}
                {compareProducts.length === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className='mt-12 space-y-6'
                    >
                        <h2 className='text-2xl font-serif tracking-wide bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-200 dark:to-yellow-400 bg-clip-text text-transparent'>
                            Nhận định sau khi so sánh sản phẩm
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {getAIComparison(compareProducts).map((difference, index) => (
                                <div
                                    key={index}
                                    className='p-6 bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 
                                    rounded-xl transition-all duration-300 hover:border-amber-400/30 space-y-3'
                                >
                                    <h3 className='text-lg font-medium text-amber-600 dark:text-amber-300'>
                                        {difference.title}
                                    </h3>
                                    <p className='text-gray-700 dark:text-gray-300'>{difference.description}</p>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 italic'>
                                        💡 {difference.recommendation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
