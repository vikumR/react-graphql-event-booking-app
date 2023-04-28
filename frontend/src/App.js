import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;