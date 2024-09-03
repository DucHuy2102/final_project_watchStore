import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { ScrollToTop } from './components/exportComponent';

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path='/' element={'<Home />'} />
                <Route path='/about' element={'<About />'} />
            </Routes>
        </Router>
    );
}
