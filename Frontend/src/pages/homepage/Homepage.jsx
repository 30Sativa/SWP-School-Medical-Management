import React from "react";
import '../../assets/css/homepage.css'
import minhhoa from '../../assets/img/homepage.jpg';
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">EduHealth</div>
        <nav className="nav-links">
          <a href="#">Trang chủ</a>
          <a href="#">Giới thiệu</a>
          <a href="#">Dịch vụ</a>
          <a href="#">Liên hệ</a>
          <button className="outline-btn login-btn" onClick={() => navigate("/login")}>
              Đăng nhập
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
            <h1>
              Hệ thống quản lý <span className="highlight">sức khỏe học đường</span>
            </h1>
            <p>
              Kết nối phụ huynh, nhà trường và đội ngũ y tế để theo dõi, chăm sóc sức khỏe học sinh một cách toàn diện và hiệu quả.
            </p>
            <div className="hero-buttons">
              <button className="primary-btn">Đăng ký ngay</button>
              <button className="outline-btn" onClick={() => navigate("/login")}>
              Đăng nhập
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src={minhhoa} alt="Minh họa" />
          </div>
      </section>

      {/* Tính năng nổi bật */}
      <section className="features">
        <h2>Tính năng nổi bật</h2>
        <div className="feature-rows">
          <div className="feature-row">
            <div className="feature-box">
              <h3>Quản lý thuốc</h3>
              <p>Theo dõi đơn thuốc & tồn kho nhanh chóng</p>
            </div>
            <div className="feature-box">
              <h3>Tiền sử bệnh</h3>
              <p>Lưu trữ & tra cứu hồ sơ bệnh lý</p>
            </div>
            <div className="feature-box">
              <h3>Khám sức khỏe</h3>
              <p>Quản lý chỉ số và kết quả khám định kỳ</p>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-box">
              <h3>Sơ cứu & tai nạn</h3>
              <p>Ghi nhận và theo dõi ca xử lý</p>
            </div>
            <div className="feature-box">
              <h3>Thông báo cho phụ huynh</h3>
              <p>Thông tin được gửi tức thì</p>
            </div>
            <div className="feature-box">
              <h3>Báo cáo thống kê</h3>
              <p>Xuất báo cáo theo lớp, giới tính, độ tuổi,...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dành cho mọi đối tượng */}
      <section className="roles">
        <h2>Dành cho mọi đối tượng</h2>
        <div className="role-row">
          <div className="role-card parent">
            <i className="fas fa-user-group role-icon"></i>
            <h3>Phụ huynh</h3>
            <ul>
              <li>Theo dõi sức khỏe con</li>
              <li>Nhận thông báo y tế</li>
              <li>Chủ động phối hợp nhà trường</li>
            </ul>
            <button className="btn-parent">Dành cho phụ huynh</button>
          </div>
          <div className="role-card health">
            <i className="fas fa-briefcase-medical role-icon"></i>
            <h3>Y tá trường học</h3>
            <ul>
              <li>Quản lý hồ sơ sức khỏe</li>
              <li>Ghi nhận sơ cứu, thuốc, khám</li>
              <li>Thống kê nhanh chóng</li>
            </ul>
            <button className="btn-health">Dành cho y tế</button>
          </div>
          <div className="role-card board">
            <i className="fas fa-chalkboard-user role-icon"></i>
            <h3>Ban giám hiệu</h3>
            <ul>
              <li>Tổng quan dữ liệu trường</li>
              <li>Giám sát nhân sự y tế</li>
              <li>Thống kê & xuất báo cáo</li>
            </ul>
            <button className="btn-board">Dành cho BGH</button>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="feedback">
        <h2>Khách hàng nói gì về chúng tôi</h2>
        <div className="feedback-cards">
          <div className="feedback-card">
            <p>“Ứng dụng rất dễ sử dụng...”</p>
            <h4>Nguyễn Thị Hương – Phụ huynh</h4>
          </div>
          <div className="feedback-card">
            <p>“Tôi không còn phải ghi chép bằng giấy...”</p>
            <h4>Trần Văn An – Nhân viên y tế</h4>
          </div>
          <div className="feedback-card">
            <p>“Hệ thống giúp tôi nắm được sức khỏe học sinh toàn trường...”</p>
            <h4>Lê Thị Bích Ngọc – Hiệu trưởng</h4>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Sẵn sàng nâng cao chất lượng chăm sóc sức khỏe học đường?</h2>
        <p>
          Đăng ký ngay để trải nghiệm hệ thống quản lý sức khỏe học đường hiệu quả
          nhất.
        </p>
        <div className="cta-buttons">
          <button className="primary-btn">Đăng ký trải nghiệm</button>
          <button className="outline-btn">Tìm hiểu thêm</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-column">
            <div className="footer-logo">EduHealth</div>
          </div>
          <div className="footer-column">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li><a href="#">Trang chủ</a></li>
              <li><a href="#">Dịch vụ</a></li>
              <li><a href="#">Giới thiệu</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Hỗ trợ</h4>
            <ul>
              <li><a href="#">Trung tâm trợ giúp</a></li>
              <li><a href="#">Chính sách</a></li>
              <li><a href="#">Bảo mật</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Liên hệ</h4>
            <ul>
              <li>Email: support@eduhealth.vn</li>
              <li>Địa chỉ: Q1, TP.HCM</li>
              <li>Điện thoại: 0123 456 789</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 EduHealth. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Homepage;

