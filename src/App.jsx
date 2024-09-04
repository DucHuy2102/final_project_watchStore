import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop, Header_Component, Footer_Component } from './components/exportComponent';
import { Home_Page, Login_Page } from './pages/exportPage';

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Header_Component />
            <Routes>
                {/* route not auth */}
                <Route path='/' element={<Home_Page />} />
                <Route path='/sign-in' element={<Login_Page />} />
                <Route path='/sign-up' element={'<SignUp_Page />'} />
                <Route path='/about' element={'<About_Page />'} />
                <Route path='/search' element={'<Search_Page />'} />
                <Route path='/projects' element={'<Projects_Page />'} />
                <Route path='/post/:postSlug' element={'<PostDetail_Page />'} />

                {/* route for user */}
                <Route element={'<PrivateRoute />'}>
                    <Route path='/dashboard' element={'<Dashboard_Page />'} />
                </Route>

                {/* route for admin */}
                <Route element={'<AdminRoute />'}>
                    <Route path='/create-post' element={'<CreatePost_Page />'} />
                    <Route path='/update-post/:postID' element={'<UpdatePost_Page />'} />
                </Route>
            </Routes>
            <Footer_Component />
        </Router>
    );
}
