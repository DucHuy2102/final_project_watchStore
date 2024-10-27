import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop, Header_Component, Footer_Component, FloatingShape } from './components/exportComponent';
import {
    AdminLogin_Page,
    AdminRoute_Page,
    Dashboard_DefaultPage,
    DashboardCart_Page,
    DashboardProduct_Page,
    DashCheckout_Page,
    DashService_Page,
    EmailVerification_Page,
    ForgotPassword_Page,
    FormOrderInfo,
    Home_Page,
    Login_Page,
    PageNotFound_Page,
    PrivateRoute_Page,
    ProductDetail_Page,
    Register_Page,
    ResetPassword_Page,
} from './pages/exportPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getCartUser } from './redux/slices/cartSlice';
import { useEffect } from 'react';

const AdminLayout = ({ children }) => {
    return (
        <div
            className='min-h-screen bg-gradient-to-r from-gray-800 via-green-800 to-emerald-800 
            flex justify-center items-center overflow-hidden relative'
        >
            <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
            {children}
        </div>
    );
};

export default function App() {
    // state
    const dispatch = useDispatch();
    const tokenUser = useSelector((state) => state.user.access_token);
    const cartTotalQuantity = useSelector((state) => state.cart.cartTotalQuantity);

    // Get product in cart when user login
    useEffect(() => {
        const getProductInCart = async () => {
            if (tokenUser && cartTotalQuantity === 0) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart/get-cart-user`, {
                        headers: {
                            Authorization: `Bearer ${tokenUser}`,
                        },
                    });
                    if (res?.status === 200) {
                        const { data } = res;
                        dispatch(getCartUser(data));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        getProductInCart();
    }, [cartTotalQuantity, dispatch, tokenUser]);

    return (
        <>
            <Router>
                <ScrollToTop />
                <Header_Component />
                <Routes>
                    {/* route not auth */}
                    <Route path='/' element={<Home_Page />} />
                    <Route path='/login' element={<Login_Page />} />
                    <Route path='/register' element={<Register_Page />} />
                    <Route path='/forgot-password' element={<ForgotPassword_Page />} />
                    <Route path='/verify-email' element={<EmailVerification_Page />} />
                    <Route path='/reset-password/:token' element={<ResetPassword_Page />} />
                    <Route path='/products' element={<DashboardProduct_Page />} />
                    <Route path='/product-detail/:id' element={<ProductDetail_Page />} />
                    <Route path='/cart' element={<DashboardCart_Page />} />
                    <Route path='/services' element={<DashService_Page />} />
                    <Route path='/admin/login' element={<AdminLogin_Page />} />

                    {/* route only for user */}
                    <Route element={<PrivateRoute_Page />}>
                        <Route path='/dashboard' element={<Dashboard_DefaultPage />} />
                        <Route path='/checkout' element={<DashCheckout_Page />} />
                        <Route path='/order/order-detail' element={<FormOrderInfo />} />   
                    </Route>

                    {/* route only for admin */}
                    <Route
                        path='/admin'
                        element={
                            <AdminLayout>
                                <Routes>
                                    <Route path='/admin/login' element={<AdminLogin_Page />} />
                                    <Route element={<AdminRoute_Page />}>
                                        <Route path='/create-post' element={'<CreatePost_Page />'} />
                                        <Route path='update-post/:postID' element={'<UpdatePost_Page />'} />
                                    </Route>
                                </Routes>
                            </AdminLayout>
                        }
                    />

                    {/* page not found */}
                    <Route path='*' element={<PageNotFound_Page />} />
                </Routes>
                <Footer_Component />
            </Router>
            <ToastContainer
                className={'w-fit'}
                position='bottom-right'
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
        </>
    );
}
