import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ScrollToTop, Header_Component, Footer_Component } from './components/exportComponent';
import {
    AdminRoute_Page,
    Dashboard_DefaultPage,
    DashboardCart_Page,
    DashboardProduct_Page,
    DashCheckout_Page,
    DashService_Page,
    EmailVerification_Page,
    ForgotPassword_Page,
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
                    const res = await axios.get(
                        `${import.meta.env.VITE_API_URL}/api/cart/get-cart-user`,
                        {
                            headers: {
                                Authorization: `Bearer ${tokenUser}`,
                            },
                        }
                    );
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

                    {/* route only for user */}
                    <Route element={<PrivateRoute_Page />}>
                        <Route path='/dashboard' element={<Dashboard_DefaultPage />} />
                        <Route path='/checkout' element={<DashCheckout_Page />} />
                    </Route>

                    {/* route only for admin */}
                    <Route element={<AdminRoute_Page />}>
                        <Route path='/create-post' element={'<CreatePost_Page />'} />
                        <Route path='/update-post/:postID' element={'<UpdatePost_Page />'} />
                    </Route>
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
