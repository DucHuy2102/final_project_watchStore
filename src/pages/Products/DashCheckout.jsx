export default function DashCheckout() {
    return (
        <div className='bg-gray-100 min-h-screen py-8'>
            <div className='container mx-auto px-4'>
                <h1 className='text-3xl text-center font-bold mb-4'>Thanh toán hóa đơn</h1>

                <div className='container py-5'>
                    <div className='lg:flex justify-between gap-2'>
                        {/* left content */}
                        <div className='lg:w-2/3'>
                            <div className='bg-white shadow-md rounded-lg mb-4'>
                                <div className='px-6 py-4'>
                                    <h4 className='text-xl font-semibold mb-5'>
                                        Thông tin đơn hàng
                                    </h4>

                                    {/* form */}
                                    <Form layout='vertical' validateMessages={validateMessages}>
                                        <div className='w-full flex items-center justify-between gap-5'>
                                            {/* fullName = firstname + lastname */}
                                            <Form.Item
                                                label='Họ và tên khách hàng'
                                                className='w-[50%]'
                                            >
                                                <Input
                                                    disabled
                                                    value={fullName}
                                                    className='w-full '
                                                />
                                            </Form.Item>

                                            {/* email */}
                                            <Form.Item
                                                label='Email liên hệ'
                                                className='text-red-500 w-[40%] text-start'
                                            >
                                                <Input
                                                    disabled
                                                    value={email}
                                                    className='border border-gray-300 rounded'
                                                />
                                            </Form.Item>

                                            {/* phone */}
                                            <Form.Item
                                                label='Số điện thoại'
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                    () => ({
                                                        validator(_, value) {
                                                            if (isNaN(value)) {
                                                                return Promise.reject(
                                                                    'Số điện thoại phải là số và không chứa ký tự đặc biệt!'
                                                                );
                                                            } else if (
                                                                value.length > 0 &&
                                                                value.length !== 10
                                                            ) {
                                                                return Promise.reject(
                                                                    'Số điện thoại phải có 10 số!'
                                                                );
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    }),
                                                ]}
                                                className='text-red-500 w-[30%] text-start flex-grow'
                                            >
                                                <Input
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className='border border-gray-300 rounded'
                                                />
                                            </Form.Item>
                                        </div>

                                        <div className='w-full flex items-center justify-between gap-5'>
                                            {/* address */}
                                            <Form.Item
                                                label='Địa chỉ nhận hàng'
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Địa chỉ nhận hàng không được bỏ trống!',
                                                    },
                                                ]}
                                                className='w-[70%]'
                                            >
                                                <Input
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    className='w-full'
                                                />
                                            </Form.Item>

                                            {/* payment method */}
                                            <Form.Item
                                                label='Phương thức thanh toán'
                                                className='flex-grow'
                                            >
                                                <Select
                                                    value={paymentMethod}
                                                    onChange={(value) => setPaymentMethod(value)}
                                                >
                                                    <Select.Option value='cash'>
                                                        Thanh toán khi nhận hàng
                                                    </Select.Option>
                                                    <Select.Option value='vnpay'>
                                                        VNPAY
                                                    </Select.Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                    </Form>
                                </div>

                                <div className='px-6 py-4'>
                                    <h4 className='text-xl font-semibold mb-5'>
                                        Thông tin sản phẩm
                                    </h4>

                                    <table className='w-full'>
                                        <thead>
                                            <tr>
                                                <th className='text-left font-semibold'>
                                                    Sản phẩm
                                                </th>
                                                <th className='font-semibold text-center'>
                                                    Đơn giá
                                                </th>
                                                <th className='font-semibold text-center'>
                                                    Số lượng
                                                </th>
                                                <th className='font-semibold text-center'>
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>

                                        {/* body product */}
                                        <tbody>
                                            {checkBuyNow
                                                ? orders_Redux?.productBuyNow.map((item) => {
                                                      return (
                                                          <tr key={item.id}>
                                                              {/* image, name */}
                                                              <td className='py-4'>
                                                                  <div className='flex items-center'>
                                                                      {/* image */}
                                                                      <img
                                                                          className='h-16 w-16 mr-4'
                                                                          src={item.product.img[0]}
                                                                          alt='Product image'
                                                                      />

                                                                      {/* name */}
                                                                      <span className='w-80 font-semibold'>
                                                                          {item.product.productName}
                                                                      </span>
                                                                  </div>
                                                              </td>

                                                              {/* price */}
                                                              <td className='py-4 text-center'>
                                                                  {priceFormat(item.product.price)}
                                                              </td>

                                                              {/* quantity */}
                                                              <td className='py-4 text-center'>
                                                                  {item.quantity}
                                                              </td>

                                                              {/* total price = (price * quantity) */}
                                                              <td className='py-4 text-center'>
                                                                  {priceFormat(
                                                                      item.product.price *
                                                                          item.quantity
                                                                  )}
                                                              </td>
                                                          </tr>
                                                      );
                                                  })
                                                : orders_Redux?.data.map((item) => {
                                                      return (
                                                          <tr key={item.id}>
                                                              {/* image, name */}
                                                              <td className='py-4'>
                                                                  <div className='flex items-center'>
                                                                      {/* image */}
                                                                      <img
                                                                          className='h-16 w-16 mr-4'
                                                                          src={item.product.img[0]}
                                                                          alt='Product image'
                                                                      />

                                                                      {/* name */}
                                                                      <span className='w-80 font-semibold'>
                                                                          {item.product.productName}
                                                                      </span>
                                                                  </div>
                                                              </td>

                                                              {/* price */}
                                                              <td className='py-4 text-center'>
                                                                  {priceFormat(item.product.price)}
                                                              </td>

                                                              {/* quantity */}
                                                              <td className='py-4 text-center'>
                                                                  {item.quantity}
                                                              </td>

                                                              {/* total price = (price * quantity) */}
                                                              <td className='py-4 text-center'>
                                                                  {priceFormat(
                                                                      item.product.price *
                                                                          item.quantity
                                                                  )}
                                                              </td>
                                                          </tr>
                                                      );
                                                  })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* right content */}
                        <div className='lg:w-1/3'>
                            <div className='bg-white shadow-md rounded-lg'>
                                {/* summary user info */}
                                <div>
                                    <h4 className='text-lg font-semibold mb-2 px-6 pt-4'>
                                        Địa chỉ giao hàng
                                    </h4>
                                    <div className='px-6 pb-4'>
                                        <div className='flex justify-start items-center gap-10'>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <div className='bg-blue-300 px-3 rounded-lg'>
                                                    <UserOutlined />
                                                </div>
                                                <span>{fullName}</span>
                                            </div>
                                            <div className='flex items-center gap-2 mb-2'>
                                                <div className='bg-blue-300 px-3 rounded-lg'>
                                                    <PhoneOutlined />
                                                </div>
                                                <span>{phone}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-2 mb-2'>
                                            <div className='bg-green-300 px-3 rounded-lg'>
                                                <HomeOutlined />
                                            </div>
                                            <span>{address}</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='bg-yellow-300 px-3 rounded-lg'>
                                                <TruckOutlined />
                                            </div>
                                            <span>Được giao bởi TNT SKY</span>
                                        </div>
                                    </div>
                                </div>

                                {/* order summary */}
                                <div className='px-6'>
                                    <h4 className='text-lg font-semibold mb-2'>
                                        Đơn hàng - {orders_Redux.length} sản phẩm
                                    </h4>

                                    {/* infomation pay */}
                                    <div>
                                        <hr className='border-gray-300 my-1' />

                                        <div className='w-full text-lg flex justify-between'>
                                            <span className='text-gray-500'>Tạm tính</span>
                                            <span>{priceFormat(totalPrice)}</span>
                                        </div>
                                        <div className='w-full text-lg flex justify-between'>
                                            <span className='text-gray-500'>Phí vận chuyển</span>
                                            <span>40.000 ₫</span>
                                        </div>
                                        <hr className='border-gray-300 my-1' />
                                        <div className='w-full text-lg flex justify-between'>
                                            <span className='text-black'>Tổng tiền</span>
                                            <span className='text-red-500'>
                                                {priceFormat(totalPrice + 40000)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className='text-sm text-gray-500 w-full flex justify-center items-center'>
                                                (Đã bao gồm thuế GTGT, phí đóng gói và các chi phí
                                                phát sinh khác)
                                            </span>
                                        </div>
                                    </div>

                                    {/* button */}
                                    <div className='mt-5 pb-5'>
                                        <button
                                            onClick={handleCheckout}
                                            className='bg-red-500 text-white w-full py-2 rounded-md text-lg'
                                        >
                                            Đặt hàng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
