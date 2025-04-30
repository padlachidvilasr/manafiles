import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import FilePage from './pages/FilePage';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      if (location.pathname === '/') {
        navigate('/dashboard');
      }
    } else {
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  }, [isAuthenticated, location.pathname, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/files/:category"
            element={isAuthenticated ? <FilePage /> : <Navigate to="/" />}
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;