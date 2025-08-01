import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import NurseDashBoard from './pages/nurse/NurseDashboard.jsx';
import Homepage from './pages/homepage/Homepage.jsx';
import UsersList from './pages/manager/UsersList.jsx';
import StudentList from './pages/nurse/StudentList.jsx';
import MainLayout from './components/sidebar/MainLayout.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
