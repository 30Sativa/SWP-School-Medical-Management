import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
        <header>
          <div className="dashboard-header-bar">
            <div className="title-group">
              <h1>
                <span className="text-accent">|</span>
                <span className="text-black">Dashboard</span>
                <h5 className="text-welcome">Chào mừng trở lại!</h5>
              </h1>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <section className="stats-cards">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Thông báo mới */}
        <section className="card-requests" style={{ marginTop: 32 }}>
          <div className="request-header">
            <h2>Thông báo mới</h2>
          </div>
          <ul className="incident-list-ui">
            {notifications.map((note, idx) => (
              <li className="incident-card" key={idx}>
                <div className="incident-content">
                  <strong>{note.title}</strong>
                  <p>{note.description}</p>
                  <span className="incident-time">{note.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default ManagerDashboard;
