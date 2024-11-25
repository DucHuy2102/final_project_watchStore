import { useCallback, useEffect, useMemo, useState } from 'react';
import { PieChart, LineChart, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import { Package2, ShoppingCart, CreditCard, Clock, MapPin, Mail, Phone, CircleX } from 'lucide-react';
import { Card, Image } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner } from 'flowbite-react';

export default function Dashboard() {
    const { access_token: tokenUser, user } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    console.log(orders);

    // get all orders from api
    useEffect(() => {
        const getAllOrders = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/api/order`,

                    {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    },
                );
                if (res.status === 200) {
                    setOrders(res.data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getAllOrders();
    }, [tokenUser]);

    const orderProcessing = useMemo(() => orders.filter((order) => order.status === 'processing'), [orders]);
    // const orderDelivery = useMemo(() => orders.filter((order) => order.status === 'delivery'), [orders]);
    const orderComplete = useMemo(() => orders.filter((order) => order.status === 'complete'), [orders]);
    const orderCancel = useMemo(() => orders.filter((order) => order.status === 'cancel'), [orders]);
    const totalAmount = useMemo(() => orders.reduce((acc, order) => acc + order.totalPrice, 0), [orders]);

    // Mock data for charts - Thực tế sẽ lấy từ API
    const orderStats = [
        { name: 'Đang xử lý', value: { orderProcessing } },
        { name: 'Đang giao', value: 1 },
        { name: 'Đã giao', value: { orderComplete } },
        { name: 'Đã hủy', value: { orderCancel } },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (isLoading) {
        return (
            <div className='w-full min-h-screen flex justify-center items-center '>
                <div className='flex flex-col items-center'>
                    <Spinner size='xl' color='info' />
                    <p className='mt-4 text-gray-400 text-lg font-semibold'>Vui lòng chờ trong giây lát...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto p-6 space-y-6'>
            {/* Profile Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <Card className='col-span-1 p-6'>
                    <div className='flex flex-col items-center space-y-4'>
                        <div className='w-32 h-32 rounded-full overflow-hidden'>
                            <Image
                                src={user?.avatarImg || 'https://via.placeholder.com/150'}
                                alt='Nguyễn Đức Huy'
                                className='w-full h-full object-cover'
                                preview={{
                                    mask: <div className='text-xs font-medium'>Xem</div>,
                                }}
                            />
                        </div>
                        <div className='text-center'>
                            <h2 className='text-2xl font-bold'>{user?.fullName}</h2>
                            <p className='text-gray-500'>@{user?.username}</p>
                        </div>
                        <div className='w-full space-y-3'>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Mail size={18} />
                                <span>{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <Phone size={18} />
                                <span>{user?.phone}</span>
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <MapPin size={18} />
                                <span>{user?.address?.fullAddress}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Metrics Cards */}
                <div className='col-span-2 grid grid-cols-2 gap-6'>
                    <MetricCard
                        icon={<ShoppingCart className='w-8 h-8 text-blue-500' />}
                        title='Tổng đơn hàng'
                        value={orders.length}
                        trend='+12.5%'
                        trendUp={true}
                    />
                    <MetricCard
                        icon={<Package2 className='w-8 h-8 text-green-500' />}
                        title='Đơn thành công'
                        value={orderComplete === 0 ? orderComplete.length : 'Không có'}
                        trend='+8.2%'
                        trendUp={true}
                    />
                    <MetricCard
                        icon={<CreditCard className='w-8 h-8 text-purple-500' />}
                        title='Tổng chi tiêu'
                        value={totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        trend='+15.3%'
                        trendUp={true}
                    />
                    <MetricCard
                        icon={<CircleX className='w-8 h-8 text-red-500' />}
                        title='Đơn hàng đã hủy'
                        value={orderCancel === 0 ? orderCancel.length : 'Không có'}
                        trend='0%'
                        trendUp={false}
                    />
                </div>
            </div>

            {/* Charts Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Trạng thái đơn hàng</h3>
                    <div className='w-full h-[300px] flex justify-center'>
                        <PieChart width={300} height={300}>
                            <Pie
                                data={orderStats}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                outerRadius={100}
                                fill='#8884d8'
                                dataKey='value'
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {orderStats.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </div>
                </Card>

                <Card className='p-6'>
                    <h3 className='text-lg font-semibold mb-4'>Chi tiêu theo tháng</h3>
                    <div className='w-full h-[300px]'>
                        <LineChart
                            width={500}
                            height={300}
                            data={[
                                { month: 'T1', spend: 2500000 },
                                { month: 'T2', spend: 1800000 },
                                { month: 'T3', spend: 3200000 },
                                { month: 'T4', spend: 2800000 },
                                { month: 'T5', spend: 3500000 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey='month' />
                            <YAxis />
                            <Tooltip
                                formatter={(value) =>
                                    new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    }).format(value)
                                }
                            />
                            <Legend />
                            <Line type='monotone' dataKey='spend' stroke='#8884d8' name='Chi tiêu' />
                        </LineChart>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Section */}
            <Card className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>Đơn hàng gần đây</h3>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Mã đơn hàng
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Sản phẩm
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Tổng tiền
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Trạng thái
                                </th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Ngày đặt
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {/* Example row */}
                            <tr>
                                <td className='px-6 py-4 whitespace-nowrap'>#6738c2e34c241472f31752cb</td>
                                <td className='px-6 py-4'>Casio - Nam F-91W-1DG</td>
                                <td className='px-6 py-4'>683,200đ</td>
                                <td className='px-6 py-4'>
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                                        Đang xử lý
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>16/11/2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

// Component cho các card metric
function MetricCard({ icon, title, value, trend, trendUp }) {
    return (
        <Card className='p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-center justify-between'>
                <div className='flex-1'>
                    <h3 className='text-lg text-gray-500'>{title}</h3>
                    <p className='text-2xl font-bold mt-2'>{value}</p>
                    <div className={`flex items-center mt-2 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
                        <span className='text-sm'>{trend} so với tháng trước</span>
                    </div>
                </div>
                <div className='bg-gray-50 p-3 rounded-full'>{icon}</div>
            </div>
        </Card>
    );
}
