import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';

class App extends Component {
  render() {


    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className='main-content'>
            <Routes>
              <Route index path="/" element={<Navigate to="/auth" />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
            </Routes>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
export default App;