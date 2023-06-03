import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './ context/auth-context';

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token: token, userId: userId });
    this.checkAuthTimeout(tokenExpiration);
  }

  logout = () => {
    this.setState({
      token: null,
      userId: null
    });
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');
  }

  checkAuthTimeout = (expirationTime) => {
    setTimeout(() => {
      this.logout();
    }, expirationTime);
  }

  componentDidMount() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.setState({ token: token, userId: userId });
    }
  }

  render() {

    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout
          }}>
            <MainNavigation />
            <main className='main-content'>
              <Routes>
                <Route index path="/" element={<Navigate to="/events" />} />
                {this.state.token && <Route path="/auth" element={<Navigate to="/events" />} />}

                {!this.state.token && <Route path="/auth" element={<AuthPage />} />}
                <Route path="/events" element={<EventsPage />} />
                {this.state.token && <Route path="/bookings" element={<BookingsPage />} />}

                {!this.state.token && <Route path="/bookings" element={<Navigate to="/auth" />} />}
              </Routes>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
export default App;