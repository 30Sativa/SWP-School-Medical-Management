import React, { useEffect, useState } from "react";
import "../../assets/css/ManagerDashboard.css";

const ManagerDashboard = () => {
  const [stats, setStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchDashboardData() {
//       try {
//         setLoading(true);

//         // Fetch thống kê
//         const statsResponse = await fetch("/api/dashboard/stats");
//         if (!statsResponse.ok) throw new Error("Lỗi tải dữ liệu thống kê");
//         const statsData = await statsResponse.json();

//         // Fetch thông báo
//         const notiResponse = await fetch("/api/dashboard/notifications");
//         if (!notiResponse.ok) throw new Error("Lỗi tải dữ liệu thông báo");
//         const notiData = await notiResponse.json();

//         setStats(statsData);
//         setNotifications(notiData);
//         setError(null);
//       } catch (err) {
//         setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDashboardData();
//   }, []);

useEffect(() => {
  // Giả lập dữ liệu sau 1 giây
  setLoading(true);
  setTimeout(() => {
    setStats([
      { title: "Ca khám hôm nay", value: "48" },
      { title: "Nhân viên y tế", value: "12" },
      { title: "Thuốc có sẵn", value: "156" },
      { title: "Hồ sơ sức khỏe", value: "1,248" },
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
      <div className="manager-dashboard-loading">
        Đang tải dữ liệu, vui lòng chờ...
      </div>
    );

  if (error)
    return (
      <div className="manager-dashboard-error">
        Lỗi: {error}
      </div>
    );

  return (
    <div className="manager-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">EduHealth</div>
        <div className="sidebar-profile">
          <img src="/search-image.png" alt="User avatar" className="avatar" />
          <div className="profile-info">
            <p className="profile-name">Lê Thị Bích Ngọc</p>
            <p className="profile-role">Quản lý</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-btn active">Bảng điều khiển</button>
          <button className="nav-btn">Nhật ký hoạt động</button>
          <button className="nav-btn">Danh sách người dùng</button>
          <button className="nav-btn">Blog</button>
          <button className="nav-btn">Báo cáo thống kê</button>
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
            <button className="icon-btn" title="Trợ giúp">?</button>
            <button className="icon-btn" title="Thông báo">🔔</button>
            <div className="user-info">
              <img src="/search-image-1.png" alt="User avatar" className="avatar" />
              <span className="user-name">Lê Thị Bích Ngọc</span>
              <button className="dropdown-btn">▼</button>
            </div>
          </div>
        </header>

        {/* Dashboard sections */}
        <main className="dashboard-main">
          {/* Welcome banner */}
          <section className="welcome-banner">
            <h1>Xin chào, Bích Ngọc!</h1>
            <p>Chào mừng quay trở lại với hệ thống quản lý học đường.</p>
          </section>

          {/* Stats cards */}
          <section className="stats-cards">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
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
