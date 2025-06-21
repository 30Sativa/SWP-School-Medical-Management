import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/ManagerDashboard.css";
import {
  HeartOutlined,
  TeamOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const API_BASE = "/api";

const ManagerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const resOverview = await fetch(`${API_BASE}/Dashboard/overview`, {
          headers: { "Authorization": token ? `Bearer ${token}` : undefined },
        });
        const overviewData = await resOverview.json();
        setOverview(overviewData);
        setNotifications([
          ...(overviewData?.data?.recentMedicalEvents || []).map((ev) => ({
            title: ev.title || "Sự kiện y tế mới",
            description: ev.description || "Có sự kiện y tế mới cần chú ý.",
            time: ev.time || "Vừa xong",
          })),
        ]);
      } catch {
        setOverview(null);
        setNotifications([]);
      }
      setLoading(false);
    };
    fetchData();
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
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: 'space-between', width: '100%' }}>
              <div className="stat-card" style={{ background: "#e0f7fa", flex: 1, minWidth: 180, maxWidth: 240, marginRight: 0 }}>
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: 32, color: "#06b6d4" }} />
                </div>
                <div className="stat-title">Tổng học sinh</div>
                <div className="stat-value">
                  {overview?.data?.totalStudents ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f3e8ff", flex: 1, minWidth: 180, maxWidth: 240, marginRight: 0 }}>
                <div className="stat-icon">
                  <ProfileOutlined style={{ fontSize: 32, color: "#a21caf" }} />
                </div>
                <div className="stat-title">Admin</div>
                <div className="stat-value">
                  {overview?.data?.totalUsers?.admin ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#d1fae5", flex: 1, minWidth: 180, maxWidth: 240, marginRight: 0 }}>
                <div className="stat-icon">
                  <HeartOutlined style={{ fontSize: 32, color: "#059669" }} />
                </div>
                <div className="stat-title">Nurse</div>
                <div className="stat-value">
                  {overview?.data?.totalUsers?.nurse ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#fef9c3", flex: 1, minWidth: 180, maxWidth: 240 }}>
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: 32, color: "#eab308" }} />
                </div>
                <div className="stat-title">Parent</div>
                <div className="stat-value">
                  {overview?.data?.totalUsers?.parent ?? 0}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Thông báo mới */}
        <section className="card-requests" style={{ marginTop: 32 }}>
          <div className="request-header">
            <h2>Thông báo mới</h2>
          </div>
          <ul className="incident-list-ui">
            {notifications.length === 0 && !loading && (
              <li className="incident-card">
                <div className="incident-content">Không có thông báo mới</div>
              </li>
            )}
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