import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Badge, TextInput, Select, Button } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { OrderDetail_Component } from '../../components/exportComponent';

export default function Order() {
    const tokenUser = useSelector((state) => state.user.access_token);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [filterState, setFilterState] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc',
    });
    const [orderDetail, setOrderDetail] = useState(null);
    console.log(orderDetail);

    // get all orders from api
    useEffect(() => {
        const getAllOrders = async () => {
            try {
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
            }
        };
        getAllOrders();
    }, [tokenUser]);

    const getStatusColor = (state) => {
        const colors = {
            processing: 'warning',
            delivered: 'success',
            cancelled: 'failure',
        };
        return colors[state] || 'default';
    };

    const getStatusText = (state) => {
        const text = {
            processing: 'Đang xử lý',
            delivered: 'Đã giao',
            cancelled: 'Đã hủy',
        };
        return text[state] || state;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredOrders = orders.filter((order) => {
        const matchSearch =
            order.user.name.toLowerCase().includes(search.toLowerCase()) ||
            order.user.phone.includes(search) ||
            order.id.includes(search);
        const matchState = filterState === 'all' || order.state === filterState;
        return matchSearch && matchState;
    });

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
        });
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortConfig.key === 'totalPrice') {
            return sortConfig.direction === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
        }
        if (sortConfig.key === 'createdAt') {
            return sortConfig.direction === 'asc'
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
    });

    return (
        <div className='px-6 py-2 space-y-6'>
            <h1 className='text-2xl font-bold'>Đơn hàng của tôi</h1>

            {orderDetail ? (
                <OrderDetail_Component orderData={orderDetail} onBack={() => setOrderDetail(null)} />
            ) : (
                <>
                    <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
                        <div className='w-full md:w-1/2'>
                            <TextInput
                                icon={HiSearch}
                                placeholder='Tìm kiếm theo tên, SĐT hoặc mã đơn hàng...'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select
                            className='w-full md:w-48'
                            value={filterState}
                            onChange={(e) => setFilterState(e.target.value)}
                        >
                            <option value='all'>Tất cả</option>
                            <option value='processing'>Đang xử lý</option>
                            <option value='delivered'>Đã giao</option>
                            <option value='cancelled'>Đã hủy</option>
                        </Select>
                    </div>

                    <Table striped hoverable>
                        <Table.Head align='center'>
                            <Table.HeadCell>Mã đơn hàng</Table.HeadCell>
                            <Table.HeadCell align='center'>
                                <div
                                    className='flex items-center justify-center gap-1 cursor-pointer'
                                    onClick={() => handleSort('createdAt')}
                                >
                                    Ngày đặt
                                    {sortConfig.key === 'createdAt' && (
                                        <span>{sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown />}</span>
                                    )}
                                </div>
                            </Table.HeadCell>
                            <Table.HeadCell>Thông tin giao hàng</Table.HeadCell>
                            <Table.HeadCell>
                                <div
                                    className='flex items-center justify-center gap-1 cursor-pointer'
                                    onClick={() => handleSort('totalPrice')}
                                >
                                    Tổng tiền
                                    {sortConfig.key === 'totalPrice' && (
                                        <span>{sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown />}</span>
                                    )}
                                </div>
                            </Table.HeadCell>
                            <Table.HeadCell>Trạng thái</Table.HeadCell>
                            <Table.HeadCell>Thao tác</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {sortedOrders.map((order) => (
                                <Table.Row key={order.id}>
                                    <Table.Cell align='center' className='font-medium'>
                                        {order.id}
                                    </Table.Cell>
                                    <Table.Cell align='center'>{formatDate(order.createdAt)}</Table.Cell>
                                    <Table.Cell>
                                        <div className='max-w-xs'>{order.user.address.fullAddress}</div>
                                    </Table.Cell>
                                    <Table.Cell align='center' className='font-semibold'>
                                        {order.totalPrice.toLocaleString()}đ
                                    </Table.Cell>
                                    <Table.Cell className='text-center'>
                                        <Badge
                                            color={getStatusColor(order.state)}
                                            className='inline-flex justify-center min-w-[100px] rounded-full py-1'
                                        >
                                            {getStatusText(order.state)}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell align='center'>
                                        <Button onClick={() => setOrderDetail(order)} size='sm' color='gray'>
                                            Chi tiết
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </>
            )}
        </div>
    );
}
