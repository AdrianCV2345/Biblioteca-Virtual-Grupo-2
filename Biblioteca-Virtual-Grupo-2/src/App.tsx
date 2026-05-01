import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import BookDetail from './pages/BookDetail';
import Favorites from './pages/Favorites';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/libro/:workId" element={<BookDetail />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/acerca" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
