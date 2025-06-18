import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/ManagerDashboard.css";
import {
  HeartOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
} from "@ant-design/icons";

const API_BASE = "/api";

const ManagerDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [vaccine, setVaccine] = useState(null);
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
        const resVaccine = await fetch(
          `${API_BASE}/Dashboard/vaccination-campaigns/statistics`,
          {
            headers: { "Authorization": token ? `Bearer ${token}` : undefined },
          }
        );
        const vaccineData = await resVaccine.json();
        setVaccine(vaccineData);
        setNotifications([
          ...(overviewData?.data?.recentMedicalEvents || []).map((ev) => ({
            title: ev.title || "Sự kiện y tế mới",
            description: ev.description || "Có sự kiện y tế mới cần chú ý.",
            time: ev.time || "Vừa xong",
          })),
        ]);
      } catch {
        setOverview(null);
        setVaccine(null);
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <div className="stat-card" style={{ background: "#e0f7fa" }}>
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: 32, color: "#06b6d4" }} />
                </div>
                <div className="stat-title">Tổng học sinh</div>
                <div className="stat-value">
                  {overview?.data?.totalStudents ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f3e8ff" }}>
                <div className="stat-icon">
                  <ProfileOutlined style={{ fontSize: 32, color: "#a21caf" }} />
                </div>
                <div className="stat-title">Admin</div>
                <div className="stat-value">
                  {overview?.data?.users?.admin ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#d1fae5" }}>
                <div className="stat-icon">
                  <HeartOutlined style={{ fontSize: 32, color: "#059669" }} />
                </div>
                <div className="stat-title">Nurse</div>
                <div className="stat-value">
                  {overview?.data?.users?.nurse ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#fef9c3" }}>
                <div className="stat-icon">
                  <TeamOutlined style={{ fontSize: 32, color: "#eab308" }} />
                </div>
                <div className="stat-title">Parent</div>
                <div className="stat-value">
                  {overview?.data?.users?.parent ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#e0e7ff" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#6366f1" }} />
                </div>
                <div className="stat-title">Tổng Medical Events</div>
                <div className="stat-value">
                  {overview?.data?.totalMedicalEvents ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#fef2f2" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#ef4444" }} />
                </div>
                <div className="stat-title">Tổng Medication Requests</div>
                <div className="stat-value">
                  {overview?.data?.totalMedicationRequests ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f0fdf4" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#22c55e" }} />
                </div>
                <div className="stat-title">Pending Medication Requests</div>
                <div className="stat-value">
                  {overview?.data?.pendingMedicationRequests ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f0f9ff" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#0ea5e9" }} />
                </div>
                <div className="stat-title">Total Vaccination Campaigns</div>
                <div className="stat-value">
                  {vaccine?.data?.totalCampaigns ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#fdf2f8" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#db2777" }} />
                </div>
                <div className="stat-title">Active Vaccination Campaigns</div>
                <div className="stat-value">
                  {vaccine?.data?.activeCampaigns ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f1f5f9" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#334155" }} />
                </div>
                <div className="stat-title">Completed Vaccination Campaigns</div>
                <div className="stat-value">
                  {vaccine?.data?.completedCampaigns ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#fef2e6" }}>
                <div className="stat-icon">
                  <MedicineBoxOutlined style={{ fontSize: 32, color: "#ea580c" }} />
                </div>
                <div className="stat-title">Cancelled Vaccination Campaigns</div>
                <div className="stat-value">
                  {vaccine?.data?.cancelledCampaigns ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#e0f2fe" }}>
                <div className="stat-icon">
                  <ProfileOutlined style={{ fontSize: 32, color: "#0284c7" }} />
                </div>
                <div className="stat-title">Total Health Check Campaigns</div>
                <div className="stat-value">
                  {overview?.data?.totalHealthCheckCampaigns ?? 0}
                </div>
              </div>
              <div className="stat-card" style={{ background: "#f1f5f9" }}>
                <div className="stat-icon">
                  <ProfileOutlined style={{ fontSize: 32, color: "#0f766e" }} />
                </div>
                <div className="stat-title">Active Health Check Campaigns</div>
                <div className="stat-value">
                  {overview?.data?.activeHealthCheckCampaigns ?? 0}
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