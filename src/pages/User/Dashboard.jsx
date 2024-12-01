import { useEffect, useMemo, useState } from 'react';
import { PieChart, LineChart, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell, CartesianGrid, Area } from 'recharts';
import { Package2, ShoppingCart, CreditCard, Clock, MapPin, Mail, Phone, CircleX, Edit3 } from 'lucide-react';
import { Card, Image, Button } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

// Updated MetricCard component
function MetricCard({ icon, title, value, trend, trendUp }) {
    return (
        <Card className='p-8 shadow-lg border-0 rounded-xl bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300'>
            <div className='flex flex-col space-y-4'>
                <div className='flex items-center justify-between'>
                    <h3 className='text-lg font-medium text-gray-600'>{title}</h3>
                    <div className='bg-gray-50 p-3 rounded-xl shadow-sm'>{icon}</div>
                </div>

                <p className='text-3xl font-bold text-gray-800'>{value}</p>

                <div className={`flex items-center ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                    <span className='text-sm font-medium'>{trend} so với tháng trước</span>
                </div>
            </div>
        </Card>
    );
}

const LUXURY_COLORS = {
    primary: ['#2E4057', '#048BA8', '#16DB93', '#EFEA5A', '#F29E4C'],
    gradients: [
        ['#4158D0', '#C850C0'],
        ['#0093E9', '#80D0C7'],
        ['#8EC5FC', '#E0C3FC'],
        ['#FFDEE9', '#B5FFFC'],
        ['#FF9A8B', '#FF6A88'],
    ],
};

const CHART_CONFIG = {
    pieChart: {
        innerRadius: 85,
        outerRadius: 130,
        cornerRadius: 10,
        paddingAngle: 5,
    },
    lineChart: {
        strokeWidth: 4,
        tension: 0.4,
    },
};

export default function Dashboard() {
    const { access_token: tokenUser, user } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
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

    const orderProcessing = useMemo(() => orders.filter((order) => order.state === 'processing').length, [orders]);
    const orderDelivery = useMemo(() => orders.filter((order) => order.state === 'delivery').length, [orders]);
    const orderComplete = useMemo(() => orders.filter((order) => order.state === 'complete').length, [orders]);
    const orderCancel = useMemo(() => orders.filter((order) => order.state === 'cancel').length, [orders]);
    const totalAmount = useMemo(() => orders.reduce((acc, order) => acc + order.totalPrice, 0), [orders]);

    const orderStats = [
        { name: 'Đang xử lý', value: orderProcessing },
        { name: 'Đang giao', value: orderDelivery + 1 },
        { name: 'Đã giao', value: orderComplete + 2 },
        { name: 'Đã hủy', value: orderCancel + 3 },
    ];

    const recentOrders = useMemo(() => {
        return orders.slice(0, 5).map((order) => ({
            ...order,
            createdAt: new Date(order.createdAt).toLocaleDateString('vi-VN'),
            totalPrice: order.totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        }));
    }, [orders]);

    const MONTHLY_SPEND_DATA = [
        { month: 'T1', spend: 15800000 },
        { month: 'T2', spend: 12500000 },
        { month: 'T3', spend: 28900000 },
        { month: 'T4', spend: 22400000 },
        { month: 'T5', spend: 35600000 },
        { month: 'T6', spend: 31200000 },
        { month: 'T7', spend: 29900000 },
        { month: 'T8', spend: 33000000 },
        { month: 'T9', spend: 35000000 },
        { month: 'T10', spend: 37000000 },
        { month: 'T11', spend: 39000000 },
        { month: 'T12', spend: 41000000 },
    ];

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
        <div className='max-w-7xl mx-auto space-y-8 p-7'>
            {/* Profile Section */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {/* Profile card */}
                <Card className='col-span-1 p-8 shadow-lg border-0 rounded-xl bg-white/80 backdrop-blur-sm'>
                    <div className='relative flex flex-col items-center space-y-6'>
                        <div className='relative'>
                            <div className='w-36 h-36 rounded-full overflow-hidden ring-4 ring-blue-50 shadow-xl'>
                                <Image
                                    src={user?.avatarImg || 'https://via.placeholder.com/150'}
                                    alt={user?.fullName}
                                    className='w-full h-full object-cover'
                                    preview={{
                                        mask: <div className='text-sm font-medium'>Xem</div>,
                                    }}
                                />
                            </div>
                            {/* small edit button */}
                            <button
                                className='absolute bottom-0 right-0 p-2 rounded-full bg-white shadow-md 
                                           hover:bg-blue-50 text-blue-600 transition-all duration-300 
                                           border border-gray-100 group'
                                onClick={() => navigate('/dashboard?tab=profile')}
                            >
                                <Edit3 size={14} className='group-hover:scale-110 transition-transform duration-300' />
                            </button>
                        </div>

                        <div className='text-center'>
                            <h2 className='text-2xl font-bold text-gray-800'>{user?.fullName}</h2>
                            <p className='text-blue-600 font-medium'>@{user?.username}</p>
                        </div>

                        <div className='w-full space-y-4 pt-4 border-t border-gray-100'>
                            <div className='flex items-center justify-between group'>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <Mail size={18} />
                                    <span>{user?.email}</span>
                                </div>
                                <button
                                    className='opacity-0 group-hover:opacity-100 p-1.5 rounded-full 
                                                 hover:bg-blue-50 text-blue-600 transition-all duration-300'
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            <div className='flex items-center justify-between group'>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <Phone size={18} />
                                    <span>{user?.phone}</span>
                                </div>
                                <button
                                    className='opacity-0 group-hover:opacity-100 p-1.5 rounded-full 
                                                 hover:bg-blue-50 text-blue-600 transition-all duration-300'
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            <div className='flex items-center justify-between group'>
                                <div className='flex items-center gap-3 text-gray-600'>
                                    <MapPin size={18} />
                                    <span>{user?.address?.fullAddress}</span>
                                </div>
                                <button
                                    className='opacity-0 group-hover:opacity-100 p-1.5 rounded-full 
                                                 hover:bg-blue-50 text-blue-600 transition-all duration-300'
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>
                        </div>

                        {/* edit profile button */}
                        <button
                            className='w-full mt-6 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 
                                       text-white rounded-lg font-medium shadow-sm 
                                       hover:shadow transition-all duration-300 
                                       flex items-center justify-center gap-2'
                            onClick={() => navigate('/dashboard?tab=profile')}
                        >
                            <Edit3 size={16} />
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </Card>

                {/* Cards */}
                <div className='col-span-2 grid grid-cols-2 gap-8'>
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Order State Chart */}
                <Card
                    className='p-5 shadow-2xl rounded-3xl bg-white/95 
                    dark:bg-transparent dark:border-gray-700 backdrop-blur-xl 
                                hover:shadow-3xl transition-all duration-500 
                                hover:translate-y-[-4px]'
                >
                    <div className='flex flex-col space-y-1'>
                        <div className='flex items-center justify-between pb-4 border-b border-gradient-to-r from-indigo-100 to-purple-100'>
                            <div className='space-y-1'>
                                <h3 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                    Trạng thái đơn hàng
                                </h3>
                                <p className='text-sm text-gray-500'>Thống kê theo trạng thái</p>
                            </div>
                        </div>

                        <div className='w-full h-[400px] flex justify-center items-center relative'>
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='text-center'>
                                    <h4 className='text-3xl font-bold text-gray-800'>{orders.length}</h4>
                                    <p className='text-sm text-gray-500'>Tổng đơn hàng</p>
                                </div>
                            </div>
                            <PieChart width={500} height={500}>
                                <defs>
                                    {LUXURY_COLORS.gradients.map((colors, index) => (
                                        <linearGradient
                                            key={`gradient-${index}`}
                                            id={`pieGradient-${index}`}
                                            x1='0'
                                            y1='0'
                                            x2='1'
                                            y2='1'
                                        >
                                            <stop offset='0%' stopColor={colors[0]} stopOpacity={0.9} />
                                            <stop offset='100%' stopColor={colors[1]} stopOpacity={0.9} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={orderStats}
                                    cx='50%'
                                    cy='50%'
                                    labelLine={false}
                                    innerRadius={CHART_CONFIG.pieChart.innerRadius}
                                    outerRadius={CHART_CONFIG.pieChart.outerRadius}
                                    cornerRadius={CHART_CONFIG.pieChart.cornerRadius}
                                    paddingAngle={CHART_CONFIG.pieChart.paddingAngle}
                                    dataKey='value'
                                    label={({ name, percent }) =>
                                        percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                                    }
                                >
                                    {orderStats.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`url(#pieGradient-${index})`}
                                            stroke='rgba(255,255,255,0.5)'
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                        borderRadius: '15px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '12px 16px',
                                    }}
                                    itemStyle={{
                                        padding: '4px 0',
                                    }}
                                />
                            </PieChart>
                        </div>
                    </div>
                </Card>

                {/* Spend Chart */}
                <Card
                    className='p-5 shadow-2xl rounded-3xl bg-white/95 backdrop-blur-xl 
                                hover:shadow-3xl transition-all duration-500 
                                hover:translate-y-[-4px]'
                >
                    <div className='flex flex-col space-y-1'>
                        <div className='flex items-center justify-between pb-4 border-b border-gradient-to-r from-indigo-100 to-purple-100'>
                            <div className='space-y-1'>
                                <h3 className='text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                    Chi tiêu theo tháng
                                </h3>
                                <p className='text-sm text-gray-500'>Thống kê chi tiêu 6 tháng gần nhất</p>
                            </div>
                            <div className='text-right'>
                                <p className='text-2xl font-bold text-gray-800'>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                        maximumFractionDigits: 0,
                                    }).format(MONTHLY_SPEND_DATA.reduce((acc, curr) => acc + curr.spend, 0))}
                                </p>
                                <p className='text-sm text-gray-500'>Tổng chi tiêu</p>
                            </div>
                        </div>
                        <div className='w-full h-[400px] flex justify-center items-center'>
                            <LineChart
                                width={500}
                                height={350}
                                data={MONTHLY_SPEND_DATA}
                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                            >
                                <defs>
                                    <linearGradient id='spendGradient' x1='0' y1='0' x2='0' y2='1'>
                                        <stop offset='5%' stopColor='#4158D0' stopOpacity={0.15} />
                                        <stop offset='95%' stopColor='#C850C0' stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id='lineGradient' x1='0' y1='0' x2='1' y2='0'>
                                        <stop offset='0%' stopColor='#4158D0' />
                                        <stop offset='50%' stopColor='#C850C0' />
                                        <stop offset='100%' stopColor='#4158D0' />
                                    </linearGradient>
                                    <filter id='shadow' height='200%'>
                                        <feDropShadow
                                            dx='0'
                                            dy='4'
                                            stdDeviation='8'
                                            floodColor='#4158D0'
                                            floodOpacity='0.2'
                                        />
                                    </filter>
                                </defs>
                                <XAxis
                                    dataKey='month'
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dx={-10}
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat('vi-VN', {
                                            notation: 'compact',
                                            compactDisplay: 'short',
                                            maximumFractionDigits: 1,
                                        }).format(value)
                                    }
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                        borderRadius: '15px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                        padding: '12px 16px',
                                    }}
                                    formatter={(value) =>
                                        new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            maximumFractionDigits: 0,
                                        }).format(value)
                                    }
                                    labelStyle={{ color: '#4B5563', fontWeight: 500 }}
                                />
                                <CartesianGrid stroke='#E5E7EB' strokeDasharray='5 5' vertical={false} opacity={0.3} />
                                <Line
                                    type='monotone'
                                    dataKey='spend'
                                    stroke='url(#lineGradient)'
                                    strokeWidth={3}
                                    dot={{ fill: '#4158D0', strokeWidth: 2, r: 4, strokeOpacity: 1 }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                                <Area
                                    type='monotone'
                                    dataKey='spend'
                                    stroke='none'
                                    fillOpacity={1}
                                    fill='url(#spendGradient)'
                                />
                            </LineChart>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Orders Section */}
            <Card className='p-8 shadow-lg border-0 rounded-xl bg-white/80 backdrop-blur-sm'>
                <div className='flex justify-between items-center mb-6'>
                    <h3 className='text-xl font-bold text-gray-800'>Đơn hàng gần đây</h3>
                    <Button type='primary' className='bg-blue-600' onClick={() => navigate('/dashboard?tab=order')}>
                        Xem tất cả
                    </Button>
                </div>
                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
                                    Mã đơn hàng
                                </th>
                                <th className='px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Sản phẩm
                                </th>
                                <th className='px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Tổng tiền
                                </th>
                                <th className='px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Trạng thái
                                </th>
                                <th className='px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Ngày đặt
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-100'>
                            {recentOrders.map((order) => (
                                <tr key={order._id} className='hover:bg-gray-50 transition-colors'>
                                    <td className='px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium'>
                                        #{order.id}
                                    </td>
                                    <td className='px-6 py-5'>{order.products[0]?.product?.productName}</td>
                                    <td className='px-6 py-5 text-center'>{order.totalPrice}</td>
                                    <td className='px-6 py-5 text-center'>
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                            ${
                                                order.state === 'processing'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : order.state === 'complete'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.state === 'cancel'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}
                                        >
                                            {order.state === 'processing'
                                                ? 'Đang chờ xử lý'
                                                : order.state === 'complete'
                                                ? 'Hoàn thành'
                                                : order.state === 'cancel'
                                                ? 'Đã hủy'
                                                : 'Đang giao'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-5 whitespace-nowrap text-center'>{order.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
