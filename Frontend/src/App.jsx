import AppRouter from './routes';
import Notification from './components/Notification'; 
import React, { useEffect, useRef } from 'react';

function App() {
  const timeoutRef = useRef();
  const TIMEOUT = 15 * 60 * 1000; // 15 phút

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        localStorage.clear();
        window.location.href = '/login';
      }, TIMEOUT);
    };

    // Các sự kiện user activity
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimeout));
    resetTimeout(); // Khởi tạo timer lần đầu

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, []);

  return (
    <>
      <AppRouter />
      <Notification /> 
    </>
  );
}

export default App;
