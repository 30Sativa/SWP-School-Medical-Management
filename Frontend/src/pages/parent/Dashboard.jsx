import React from "react";
import "../../assets/css/Dashboard.css";
import { Link } from 'react-router-dom';
import { FaHome, FaUserMd, FaPills, FaHistory, FaFileAlt, FaBell } from 'react-icons/fa';
//import './Sidebar.css';
//--------Sidebar component//
const iconProps = { size: 20, color: "#fff", style: { marginRight: 12 } };

const Sidebar = () => (
  <div className="sidebar">
    <div className="logo">
      <span className="logo-text">
        Edu<span className="highlight">Health</span>
      </span>
    </div>
    <nav>
      <Link to="/"><FaHome {...iconProps} /> Dashboard</Link>
      <Link to="/health-profile"><FaUserMd {...iconProps} /> Hồ sơ sức khỏe</Link>
      <Link to="/send-medicine"><FaPills {...iconProps} /> Gửi thuốc cho y tế</Link>
      <Link to="/history"><FaHistory {...iconProps} /> Lịch sử chăm sóc</Link>
      <Link to="/documents"><FaFileAlt {...iconProps} /> Tài liệu sức khỏe</Link>
      <Link to="/notifications"><FaBell {...iconProps} /> Thông báo & phản hồi</Link>
    </nav>
    <button className="logout">Đăng xuất</button>
  </div>
); // <-- Thêm dấu đóng này
//--------MainLayout component//
const MainLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);
const Dashboard = () => {
  return (
    <MainLayout>
      <div className="dashboard-container">
        <header className="dashboard-header custom-parent-header">
          <div>
            <div className="parent-dashboard-title">Dashboard |</div>
            <div className="parent-dashboard-greeting">
              Xin chào, bạn đang đăng nhập với tư cách phụ huynh em Trần Văn Hùng
            </div>
          </div>
        </header>

        <div className="dashboard-main">
          <div className="main-left">
            <div className="card-grid">
              <div className="card suggestion-card">
                <h4>💡 Đóng góp ý kiến</h4>
                <p>Hãy đóng góp ý kiến về cho Trường nhé!</p>
                <button>Đóng góp</button>
              </div>
              <div className="card guide-card">
                <h4>📖 Hướng dẫn sử dụng</h4>
                <p>Khám phá các tính năng của hệ thống.</p>
                <button>Tìm hiểu thêm →</button>
              </div>
            </div>

            <section className="info-section">
              <h3>📋 Thông tin chung</h3>
              <div className="info-list">
                <div className="info-item">
                  <h4>🩺 Khám sức khỏe định kỳ</h4>
                  <p>Ngày: 01-05/06/2025</p>
                  <button>Xem chi tiết</button>
                </div>
                <div className="info-item">
                  <h4>💉 Tiêm chủng vacxin đợt 1</h4>
                  <p>Ngày: 01-05/06/2025</p>
                  <button>Xem chi tiết</button>
                </div>
              </div>
            </section>
          </div>

          <aside className="main-right">
            <section className="health-check">
              <div className="section-header">
                <span>🔔 Nhắc nhở</span>
              </div>
              <div className="reminder-card yellow">
                <h5>Khám sức khỏe sắp tới</h5>
                <p>Đừng quên chuẩn bị giấy tờ cần thiết cho đợt khám sức khỏe định kỳ!</p>
              </div>
              <div className="reminder-card blue">
                <h5>Tiêm chủng vacxin</h5>
                <p>Vui lòng xác nhận thông tin tiêm chủng cho học sinh.</p>
              </div>
            </section>

            {/* Bảng quản lý thuốc đã gửi */}
            <section className="medicine-management">
              <div className="section-header">
                <span>💊 Danh sách thuốc đã gửi</span>
              </div>
              <div className="medicine-card">
                <p>Bạn đã gửi 3 loại thuốc cho y tế trong tháng này.</p>
                <button
                  className="medicine-btn"
                  onClick={() => window.location.href = '/sent-medicines'}
                >
                  Thuốc đã gửi
                </button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;