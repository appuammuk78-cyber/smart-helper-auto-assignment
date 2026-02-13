import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Next from './pages/Next';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/next" element={<Next />} />
      </Routes>
    </BrowserRouter>
  );
}
