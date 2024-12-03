import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Badge, TextInput, Select, Button, Spinner, Modal } from 'flowbite-react';
import { HiCheck, HiSearch } from 'react-icons/hi';
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { OrderDetail } from '../Products/components/exportCom_Product';

export default function Order() {
    const { access_token: tokenUser } = useSelector((state) => state.user);
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // get all orders from api
    useEffect(() => {
        const getAllOrders = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                });
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

    const getStatusColor = useCallback((state) => {
        const colors = {
            processing: 'warning',
            delivery: 'info',
            complete: 'success',
            cancel: 'failure',
        };
        return colors[state] || 'default';
    }, []);

    const getStatusText = useCallback((state) => {
        const text = {
            processing: 'Đang chờ xử lý',
            delivery: 'Đang giao hàng',
            complete: 'Đã giao hàng',
            cancel: 'Đã hủy đơn',
        };
        return text[state] || state;
    }, []);

    const formatDate = useCallback((dateStr) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

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

    const filteredOrders = orders.filter((order) => {
        const matchSearch =
            order.user?.name.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.phone.includes(search) ||
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

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {orderDetail ? (
                <OrderDetail orderData={orderDetail} onBack={() => setOrderDetail(null)} />
            ) : (
                <>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white border-b pb-3'>Đơn hàng của tôi</h1>
                    <div className='p-6'>
                        <div className='flex flex-col md:flex-row gap-6 items-start md:items-center'>
                            <div className='w-full md:w-1/2'>
                                <TextInput
                                    icon={HiSearch}
                                    placeholder='Tìm kiếm theo tên, SĐT hoặc mã đơn hàng...'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className='!ring-0 border-gray-300'
                                />
                            </div>

                            <Select
                                className='w-full md:w-48 !ring-0'
                                value={filterState}
                                onChange={(e) => setFilterState(e.target.value)}
                            >
                                <option value='all'>Tất cả đơn hàng</option>
                                <option value='processing'>Đơn đang chờ giao</option>
                                <option value='delivered'>Đơn hàng đã nhận</option>
                                <option value='cancel'>Đơn hàng đã hủy</option>
                            </Select>
                        </div>
                    </div>

                    <div className='rounded-lg shadow-sm overflow-hidden'>
                        <Table striped hoverable>
                            <Table.Head className='bg-gray-50'>
                                <Table.HeadCell className='font-semibold text-gray-700 dark:text-white'>
                                    Mã đơn hàng
                                </Table.HeadCell>
                                <Table.HeadCell align='center' className='font-semibold text-gray-700 dark:text-white'>
                                    <div
                                        className='flex items-center justify-center gap-1 cursor-pointer hover:text-gray-900 transition-colors'
                                        onClick={() => handleSort('createdAt')}
                                    >
                                        Ngày đặt
                                        {sortConfig.key === 'createdAt' && (
                                            <span>
                                                {sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown />}
                                            </span>
                                        )}
                                    </div>
                                </Table.HeadCell>
                                <Table.HeadCell className='font-semibold text-gray-700 dark:text-white'>
                                    Thông tin giao hàng
                                </Table.HeadCell>
                                <Table.HeadCell align='center' className='font-semibold text-gray-700 dark:text-white'>
                                    <div
                                        className='flex items-center justify-center gap-1 cursor-pointer hover:text-gray-900 transition-colors'
                                        onClick={() => handleSort('totalPrice')}
                                    >
                                        Tổng tiền
                                        {sortConfig.key === 'totalPrice' && (
                                            <span>
                                                {sortConfig.direction === 'asc' ? <BsArrowUp /> : <BsArrowDown />}
                                            </span>
                                        )}
                                    </div>
                                </Table.HeadCell>
                                <Table.HeadCell align='center' className='font-semibold text-gray-700 dark:text-white'>
                                    Trạng thái
                                </Table.HeadCell>
                                <Table.HeadCell align='center' className='font-semibold text-gray-700 dark:text-white'>
                                    Thao tác
                                </Table.HeadCell>
                            </Table.Head>
                            <Table.Body className='divide-y divide-gray-200'>
                                {sortedOrders.map((order) => (
                                    <Table.Row key={order.id} className='hover:bg-gray-50 transition-colors'>
                                        <Table.Cell className='font-medium text-gray-900 dark:text-white'>
                                            {order.id}
                                        </Table.Cell>
                                        <Table.Cell align='center'>{formatDate(order.createdAt)}</Table.Cell>
                                        <Table.Cell>
                                            <div className='max-w-xs text-gray-600 dark:text-white'>
                                                {order.user?.address?.fullAddress}
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell
                                            align='center'
                                            className='font-semibold text-gray-900 dark:text-white'
                                        >
                                            {order.totalPrice.toLocaleString()}đ
                                        </Table.Cell>
                                        <Table.Cell className='text-center'>
                                            <Badge
                                                color={getStatusColor(order.state)}
                                                className='inline-flex justify-center min-w-[120px] rounded-full py-1.5 text-sm font-medium'
                                            >
                                                {getStatusText(order.state)}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell align='center'>
                                            <div className='flex justify-center gap-2'>
                                                {order.state === 'delivered' ? (
                                                    <>
                                                        <Button
                                                            className='focus:!ring-0 hover:bg-blue-700 transition-colors'
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
                                                        <Button
                                                            className='focus:!ring-0 hover:bg-gray-700 transition-colors'
                                                            onClick={() => setOrderDetail(order)}
                                                            size='sm'
                                                            color='gray'
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Button
                                                        className='focus:!ring-0 hover:bg-gray-700 transition-colors'
                                                        onClick={() => setOrderDetail(order)}
                                                        size='sm'
                                                        color='gray'
                                                    >
                                                        Chi tiết
                                                    </Button>
                                                )}
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <Modal
                        show={showConfirmModal}
                        onClose={() => setShowConfirmModal(false)}
                        size='md'
                        popup
                        className='backdrop-blur-sm'
                    >
                        <Modal.Header className='border-b' />
                        <Modal.Body>
                            <div className='text-center p-4'>
                                <h3 className='mb-6 text-xl font-medium text-gray-900'>
                                    Xác nhận đã nhận được đơn hàng?
                                </h3>
                                <div className='flex justify-center gap-4'>
                                    <Button
                                        className='focus:!ring-0 hover:bg-green-700 transition-colors px-6'
                                        color='success'
                                        onClick={() => handleConfirmDelivery(confirmingOrder?.id)}
                                    >
                                        Xác nhận
                                    </Button>
                                    <Button
                                        className='focus:!ring-0 hover:bg-gray-700 transition-colors px-6'
                                        color='gray'
                                        onClick={() => setShowConfirmModal(false)}
                                    >
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
