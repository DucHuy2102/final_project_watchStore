import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Badge, TextInput, Select, Button, Spinner, Modal } from 'flowbite-react';
import { HiCheck, HiSearch } from 'react-icons/hi';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { OrderDetail_Component } from '../../components/exportComponent';

export default function Order() {
    const tokenUser = useSelector((state) => state.user.access_token);
    const [isLoading, setIsLoading] = useState(false);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');
    const [filterState, setFilterState] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        key: 'createdAt',
        direction: 'desc',
    });
    const [orderDetail, setOrderDetail] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmingOrder, setConfirmingOrder] = useState(null);

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

    // loading
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

    const getStatusColor = (state) => {
        const colors = {
            processing: 'warning',
            delivered: 'success',
            cancel: 'failure',
        };
        return colors[state] || 'default';
    };

    const getStatusText = (state) => {
        const text = {
            processing: 'Đang chờ giao',
            delivered: 'Đã giao',
            cancel: 'Hủy đơn',
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

    const handleConfirmDelivery = async (orderId) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/order/${orderId}/confirm`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res.status === 200) {
                setOrders(orders.map((order) => (order.id === orderId ? { ...order, state: 'delivered' } : order)));
                setShowConfirmModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const renderActionButton = (order) => {
        if (order.state === 'delivered') {
            return (
                <div className='flex gap-2'>
                    <Button
                        size='sm'
                        color='blue'
                        onClick={() => {
                            setConfirmingOrder(order);
                            setShowConfirmModal(true);
                        }}
                    >
                        <div className='flex justify-center items-center gap-x-2'>
                            <HiCheck className='h-4 w-4' />
                            <span>Nhận hàng</span>
                        </div>
                    </Button>
                    <Button onClick={() => setOrderDetail(order)} size='sm' color='gray'>
                        Chi tiết
                    </Button>
                </div>
            );
        }
        return (
            <Button onClick={() => setOrderDetail(order)} size='sm' color='gray'>
                Chi tiết
            </Button>
        );
    };

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
                            <option value='all'>Tất cả đơn hàng</option>
                            <option value='processing'>Đơn đang chờ giao</option>
                            <option value='delivered'>Đơn hàng đã nhận</option>
                            <option value='cancel'>Đơn hàng đã hủy</option>
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
                                    <Table.Cell align='center'>{renderActionButton(order)}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)} size='md' popup>
                        <Modal.Header />
                        <Modal.Body>
                            <div className='text-center'>
                                <h3 className='mb-5 text-lg font-normal text-gray-500 dark:text-gray-400'>
                                    Bạn xác nhận đã nhận được đơn hàng?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button color='success' onClick={() => handleConfirmDelivery(confirmingOrder?.id)}>
                                        Xác nhận
                                    </Button>
                                    <Button color='gray' onClick={() => setShowConfirmModal(false)}>
                                        Hủy
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
}
