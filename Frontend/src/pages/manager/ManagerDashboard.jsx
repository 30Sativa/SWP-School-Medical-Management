import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sb-Manager/Sidebar"; // ✅ Sử dụng lại Sidebar component
import "../../assets/css/ManagerDashboard.css";
import {
  HeartOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
} from "@ant-design/icons";


const ManagerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State cho sidebar
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setStats([
        { title: "Ca khám hôm nay", value: "48", icon: <HeartOutlined style={{ fontSize: 32, color: "#06b6d4" }} /> },
        { title: "Nhân viên y tế", value: "12", icon: <TeamOutlined style={{ fontSize: 32, color: "#059669" }} /> },
        { title: "Thuốc có sẵn", value: "156", icon: <MedicineBoxOutlined style={{ fontSize: 32, color: "#7c3aed" }} /> },
        { title: "Hồ sơ sức khỏe", value: "1,248", icon: <ProfileOutlined style={{ fontSize: 32, color: "#d97706" }} /> },
      ]);
      setNotifications([
        { title: "Cảnh báo dịch bệnh", description: "Phát hiện các ca cúm A/H1N1 tại trường, cần theo dõi chặt chẽ", time: "2 giờ trước" },
        { title: "Lịch tiêm chủng", description: "Chiến dịch tiêm vắc-xin phòng bệnh sẽ diễn ra vào ngày 05/06/2025", time: "4 giờ trước" },
        { title: "Khám sức khỏe định kỳ", description: "Lịch khám sức khỏe định kỳ cho học sinh khối 10 vào tuần sau", time: "1 ngày trước" },
      ]);
    }, 1000);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <div className="header-right">
            
            <button
              className="icon-btn logout-btn"
              title="Đăng xuất"
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Dashboard sections */}
        <main className="dashboard-main">
          {/* Welcome banner */}
          <section className="welcome-banner">
            <h1>Xin chào, Quản lý!</h1>
            <p>Chào mừng quay trở lại với hệ thống quản lý học đường.</p>
          </section>

          {/* Stats cards */}
          <section className="stats-cards">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <p className="stat-title">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </section>

          {/* Notifications */}
          <section className="notifications">
            <h2>Thông báo mới</h2>
            {notifications.map((note, idx) => (
              <div key={idx} className="notification-item">
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <span className="notification-time">{note.time}</span>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default ManagerDashboard;
