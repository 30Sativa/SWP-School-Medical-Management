import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root to login page */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      
      {/* 404 route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter; 