import React, { useEffect, useState } from "react";
import "../../assets/css/ManagerDashboard.css";
import Logo from "../../assets/icon/admin.png";
import { useNavigate } from "react-router-dom";
// Import icon từ antd
import {
  MedicineBoxOutlined,
  TeamOutlined,
  ProfileOutlined,
  HeartOutlined,
  DashboardOutlined,
  FileTextOutlined,
  ReadOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const sidebarItems = [
  { icon: <DashboardOutlined />, label: "Bảng điều khiển", path: "/" },
  { icon: <FileTextOutlined />, label: "Nhật ký hoạt động", path: "/logs" },
  { icon: <TeamOutlined />, label: "Danh sách người dùng", path: "/users" },
  { icon: <ReadOutlined />, label: "Blog", path: "/blog" },
  { icon: <BarChartOutlined />, label: "Báo cáo thống kê", path: "/reports" },
];

const ManagerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStats([
        {
          title: "Ca khám hôm nay",
          value: "48",
          icon: <HeartOutlined style={{ fontSize: 32, color: "#06b6d4" }} />,
        },
        {
          title: "Nhân viên y tế",
          value: "12",
          icon: <TeamOutlined style={{ fontSize: 32, color: "#059669" }} />,
        },
        {
          title: "Thuốc có sẵn",
          value: "156",
          icon: (
            <MedicineBoxOutlined style={{ fontSize: 32, color: "#7c3aed" }} />
          ),
        },
        {
          title: "Hồ sơ sức khỏe",
          value: "1,248",
          icon: <ProfileOutlined style={{ fontSize: 32, color: "#d97706" }} />,
        },
      ]);
      setNotifications([
        {
          title: "Cảnh báo dịch bệnh",
          description:
            "Phát hiện các ca cúm A/H1N1 tại trường, cần theo dõi chặt chẽ",
          time: "2 giờ trước",
        },
        {
          title: "Lịch tiêm chủng",
          description:
            "Chiến dịch tiêm vắc-xin phòng bệnh sẽ diễn ra vào ngày 05/06/2025",
          time: "4 giờ trước",
        },
        {
          title: "Khám sức khỏe định kỳ",
          description:
            "Lịch khám sức khỏe định kỳ cho học sinh khối 10 vào tuần sau",
          time: "1 ngày trước",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading)
    return (
      <div className="manager-dashboard-loading">Đang tải dữ liệu....</div>
    );

  if (error) return <div className="manager-dashboard-error">Lỗi: {error}</div>;

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={Logo} alt="EduHealth Logo" className="logo" />
          EduHealth
        </div>

        <div className="sidebar-profile">
          <div className="profile-info">
            <p className="profile-name">Nguyễn Ngọc Viên Ka</p>
            <p className="profile-role">Quản lý</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className={`nav-btn ${item.active ? "active" : ""}`}
              type="button"
              onClick={() => {
                if (item.label === "Danh sách người dùng") {
                  navigate("/users");
                }
                // Thêm điều kiện chuyển trang khác nếu muốn
              }}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="sidebar-collapse">Thu gọn &lt;</button>
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
          </div>
          <div className="header-right">
            <button className="icon-btn" title="Trợ giúp">
              ?
            </button>
            <button className="icon-btn" title="Thông báo">
              🔔
            </button>
            <div className="user-info">
              <span className="user-name">Nguyễn Ngọc Viên Ka</span>
            </div>
          </div>
        </header>

        {/* Dashboard sections */}
        <main className="dashboard-main">
          {/* Welcome banner */}
          <section className="welcome-banner">
            <h1>Xin chào, Viên Ka!</h1>
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
