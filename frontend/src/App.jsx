import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import GalleryDetail from './pages/GalleryDetail';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-slate-950 text-slate-100">
                <Header />
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/gallery/:slug" element={<GalleryDetail />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
