import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop, Header_Component, Footer_Component } from './components/exportComponent';
import { ForgotPassword_Page, Home_Page, Login_Page, Register_Page } from './pages/exportPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
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
                    {/* <Route path='/about' element={'<About_Page />'} />
                    <Route path='/search' element={'<Search_Page />'} />
                    <Route path='/projects' element={'<Projects_Page />'} />
                    <Route path='/post/:postSlu g' element={'<PostDetail_Page />'} />

                    <Route element={'<PrivateRoute />'}>
                        <Route path='/dashboard' element={'<Dashboard_Page />'} />
                    </Route>

                    <Route element={'<AdminRoute />'}>
                        <Route path='/create-post' element={'<CreatePost_Page />'} />
                        <Route path='/update-post/:postID' element={'<UpdatePost_Page />'} />
                    </Route> */}
                </Routes>
                <Footer_Component />
            </Router>
            <ToastContainer
                position='top-right'
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
