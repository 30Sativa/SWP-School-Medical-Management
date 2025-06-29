import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import styles from "../../assets/css/ManagerDashboard.module.css";
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
    <div className={styles.managerDashboard}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header>
          <div className={styles.dashboardHeaderBar}>
            <div className={styles.titleGroup}>
              <h1 className={styles.titleGroupH1}>
                <span className={styles.textAccent}>|</span>
                <span className={styles.textBlack}>Dashboard</span>
                
              </h1>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <section className={styles.statsCards}>
          {loading ? (
            <div>Đang tải dữ liệu...</div>
          ) : (
            <>
              <div className={styles.statCard} style={{ background: "#e0f7fa" }}>
                <div className={styles.statIcon}>
                  <TeamOutlined style={{ fontSize: 32, color: "#06b6d4" }} />
                </div>
                <div className={styles.statTitle}>Tổng học sinh</div>
                <div className={styles.statValue}>
                  {overview?.data?.totalStudents ?? 0}
                </div>
              </div>
              <div className={styles.statCard} style={{ background: "#f3e8ff" }}>
                <div className={styles.statIcon}>
                  <ProfileOutlined style={{ fontSize: 32, color: "#a21caf" }} />
                </div>
                <div className={styles.statTitle}>Admin</div>
                <div className={styles.statValue}>
                  {overview?.data?.totalUsers?.admin ?? 0}
                </div>
              </div>
              <div className={styles.statCard} style={{ background: "#d1fae5" }}>
                <div className={styles.statIcon}>
                  <HeartOutlined style={{ fontSize: 32, color: "#059669" }} />
                </div>
                <div className={styles.statTitle}>Nurse</div>
                <div className={styles.statValue}>
                  {overview?.data?.totalUsers?.nurse ?? 0}
                </div>
              </div>
              <div className={styles.statCard} style={{ background: "#fef9c3" }}>
                <div className={styles.statIcon}>
                  <TeamOutlined style={{ fontSize: 32, color: "#eab308" }} />
                </div>
                <div className={styles.statTitle}>Parent</div>
                <div className={styles.statValue}>
                  {overview?.data?.totalUsers?.parent ?? 0}
                </div>
              </div>
            </>
          )}
        </section>

        {/* Thông báo mới */}
        <section className={styles.cardRequests}>
          <div className={styles.requestHeader}>
            <h2>Thông báo mới</h2>
          </div>
          <ul className={styles.incidentListUi}>
            {notifications.length === 0 && !loading && (
              <li className={styles.incidentCard}>
                <div className={styles.incidentContent}>Không có thông báo mới</div>
              </li>
            )}
            {notifications.map((note, idx) => (
              <li className={styles.incidentCard} key={idx}>
                <div className={styles.incidentContent}>
                  <strong className={styles.incidentContentStrong}>{note.title}</strong>
                  <p className={styles.incidentContentP}>{note.description}</p>
                  <span className={styles.incidentTime}>{note.time}</span>
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