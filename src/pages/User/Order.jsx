import axios from 'axios';
import { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Input, Select, Tag, Space } from 'antd';
import { Button, Modal } from 'flowbite-react';
import { SearchOutlined, CheckOutlined } from '@ant-design/icons';
import { OrderDetail } from '../Products/components/exportCom_Product';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import ReviewModal_OrderCompleted from './components/ReviewModal_OrderCompleted';

export default function Order() {
    const location = useLocation();
    const navigate = useNavigate();
    const { access_token: tokenUser } = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderDetail, setOrderDetail] = useState(null);

    // search & filter
    const [search, setSearch] = useState('');
    const [filterState, setFilterState] = useState('all');

    // confirm modal
    const [confirmingOrder, setConfirmingOrder] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // cancel modal
    const [message, setMessage] = useState('');
    const [cancelingOrder, setCancelingOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // review modal
    const [reviewingOrder, setReviewingOrder] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // get all orders from api
    useEffect(() => {
        const getAllOrders = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order`, {
                    params: {
                        state: filterState === 'all' ? undefined : filterState,
                    },
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
    }, [filterState, location.search, tokenUser]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const getStatusColor = useCallback((state) => {
        const colors = {
            processing: 'gold',
            delivery: 'blue',
            complete: 'green',
            cancel: 'red',
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

    const handleCancelOrder = async () => {
        try {
            setIsLoading(true);
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/api/order/cancel`,
                {
                    id: cancelingOrder.id,
                    message: message.trim(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${tokenUser}`,
                    },
                },
            );
            if (res?.status === 200) {
                setShowCancelModal(false);
                setMessage('');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReview = (order) => {
        setReviewingOrder(order);
        setShowReviewModal(true);
    };

    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: '10%',
            align: 'center',
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            align: 'center',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => formatDate(date),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: '15%',
            align: 'center',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (price) => `${price.toLocaleString()}đ`,
        },
        {
            title: 'Trạng thái đơn hàng',
            dataIndex: 'state',
            key: 'state',
            width: '15%',
            align: 'center',
            render: (state) => <Tag color={getStatusColor(state)}>{getStatusText(state)}</Tag>,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: '20%',
            align: 'center',
            render: (_, record) => (
                <Space size={'small'}>
                    {record.state === 'delivery' && (
                        <Button
                            color='blue'
                            className='!ring-0'
                            onClick={() => {
                                setConfirmingOrder(record);
                                setShowConfirmModal(true);
                            }}
                        >
                            Nhận hàng
                        </Button>
                    )}
                    {record.state === 'complete' && (
                        <Button color='blue' className='!ring-0' onClick={() => handleReview(record)}>
                            Đánh giá
                        </Button>
                    )}
                    <Button color='gray' className='!ring-0' onClick={() => setOrderDetail(record)}>
                        Chi tiết
                    </Button>
                    {record.state === 'processing' && (
                        <Button
                            color='failure'
                            className='!ring-0'
                            onClick={() => {
                                setCancelingOrder(record);
                                setShowCancelModal(true);
                            }}
                        >
                            Hủy đơn
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {orderDetail ? (
                <OrderDetail orderData={orderDetail} onBack={() => setOrderDetail(null)} />
            ) : (
                <>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white border-b pb-3'>Đơn hàng của tôi</h1>

                    <div className='py-6'>
                        <Space direction='vertical' size='middle' className='w-full'>
                            <Space wrap>
                                <Input
                                    placeholder='Tìm kiếm theo tên, SĐT hoặc mã đơn hàng...'
                                    prefix={<SearchOutlined />}
                                    value={search}
                                    onChange={handleSearch}
                                    style={{ width: 300 }}
                                />
                                <Select
                                    value={filterState}
                                    onChange={(value) => setFilterState(value)}
                                    style={{ width: 200 }}
                                    options={[
                                        { value: 'all', label: 'Tất cả đơn hàng' },
                                        { value: 'processing', label: 'Đơn đang chờ giao' },
                                        { value: 'delivery', label: 'Đơn đang giao' },
                                        { value: 'complete', label: 'Đơn đã giao' },
                                        { value: 'cancel', label: 'Đơn đã hủy' },
                                    ]}
                                />
                            </Space>

                            <Table
                                columns={columns}
                                dataSource={orders}
                                rowKey='id'
                                loading={isLoading}
                                pagination={{
                                    pageSize: 10,
                                    showTotal: (total) => `Tổng ${total} đơn hàng`,
                                }}
                                scroll={{ x: 'max-content' }}
                            />
                        </Space>
                    </div>

                    {/* confirm receive order modal */}
                    <Modal
                        show={showConfirmModal}
                        onClose={() => setShowConfirmModal(false)}
                        size='sm'
                        popup
                        className='backdrop-blur-sm'
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className='text-center'>
                                <h3 className='mb-6 text-xl font-medium text-gray-900'>Xác nhận đã nhận đơn hàng?</h3>
                                <div className='flex justify-between gap-4'>
                                    <Button
                                        className='focus:!ring-0 px-5'
                                        color='gray'
                                        onClick={() => setShowConfirmModal(false)}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        className='focus:!ring-0 px-5'
                                        color='blue'
                                        onClick={() => handleConfirmDelivery(confirmingOrder?.id)}
                                    >
                                        Xác nhận
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>

                    {/* review order modal */}
                    <Modal
                        show={showReviewModal}
                        size='3xl'
                        onClose={() => setShowReviewModal(false)}
                        className='backdrop-blur-md'
                    >
                        <Modal.Header>
                            <h3 className='text-xl font-semibold'>Đánh giá sản phẩm</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <ReviewModal_OrderCompleted
                                order={reviewingOrder}
                                onClose={() => setShowReviewModal(false)}
                            />
                        </Modal.Body>
                    </Modal>

                    {/* cancel order modal */}
                    <Modal show={showCancelModal} size='md' onClose={() => setShowCancelModal(false)} popup>
                        <Modal.Header />
                        <Modal.Body>
                            <div className='text-center p-4'>
                                <HiOutlineExclamationCircle className='mx-auto mb-6 h-16 w-16 text-yellow-400' />
                                <h3 className='mb-4 text-xl font-semibold text-gray-900 dark:text-white'>
                                    Xác nhận hủy đơn hàng
                                </h3>
                                <p className='mb-6 text-gray-500 dark:text-gray-400'>
                                    Bạn có chắc chắn muốn hủy đơn hàng này?
                                </p>
                                <div className='mb-6'>
                                    <textarea
                                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:!ring-0 focus:border-gray-400'
                                        rows={3}
                                        placeholder='Vui lòng nhập lý do hủy đơn hàng...'
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                                <div className='flex justify-center gap-4'>
                                    <Button
                                        color='failure'
                                        className='focus:!ring-0 hover:bg-red-700 transition-colors px-6'
                                        onClick={handleCancelOrder}
                                        isProcessing={isLoading}
                                    >
                                        Xác nhận hủy
                                    </Button>
                                    <Button
                                        color='gray'
                                        className='focus:!ring-0 hover:bg-gray-700 transition-colors px-6'
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        Đóng
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
