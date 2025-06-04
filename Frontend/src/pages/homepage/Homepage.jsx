import React from "react";
import '../../assets/css/homepage.css'
import minhhoa from '../../assets/img/homepage.jpg';
import { useNavigate } from "react-router-dom";
import logo from '../../assets/icon/header.jpg'
import parLogo from '../../assets/icon/Background.png'
import nurseLogo from '../../assets/icon/nurse.png'
import adminLogo from '../../assets/icon/admin.png'
import tickLogo from '../../assets/icon/tick.png'
import overlayLogo from '../../assets/icon/Overlay.png'
import healthLogo from '../../assets/icon/healthcheck.png'
import statisticLogo from '../../assets/icon/statistic.png'
import reportLogo from '../../assets/icon/report.png'
import notifyLogo from '../../assets/icon/notify.png'
import vacxinLogo from '../../assets/icon/vacxin.png'
import feedback from '../../assets/icon/feedback.png'



const Homepage = () => {
    const navigate = useNavigate();
  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <img src={logo} alt="EduHealth Logo" className="logo-img"/>
          <span className="logo-text">EduHealth</span>
        </div>
        <nav className="nav-links">
          <a href="#">Trang chủ</a>
          <a href="#">Giới thiệu</a>
          <a href="#">Dịch vụ</a>
          <a href="#">Liên hệ</a>
          <button className="login-btn" onClick={() => navigate("/login")}>
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
              <button className="primary-btn">Tìm hiểu thêm </button>
              
              <button className="outline-btn" onClick={() => navigate("/login")}>
              Tìm hiểu ngay 
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
        <p className="description">EduHealth cung cấp những tính năng đầy đủ để để quản lý sức khỏe cho bé hiệu quả, 
          kết nối chặt chẽ giữa nhà trường và phụ huynh</p>
        <div className="feature-rows">
          <div className="feature-row">
            <div className="feature-box">
              <img src={overlayLogo} alt="Minh họa" />
              <h3>Quản lý thuốc</h3>
              <p>Theo dõi đơn thuốc & tồn kho nhanh chóng</p>
            </div>
            <div className="feature-box">
              <img src={vacxinLogo} alt="Minh họa" />
              <h3>Tiêm chủng</h3>
              <p>Quản lý chiến dịch tiêm chủng</p>
            </div>
            <div className="feature-box">
              <img src={healthLogo} alt="Minh họa" />
              <h3>Khám sức khỏe</h3>
              <p>Quản lý chỉ số và kết quả khám định kỳ</p>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-box">
              <img src={reportLogo} alt="Minh họa" />
              <h3>Hồ sơ sức khỏe</h3>
              <p>Ghi nhận và theo dõi ca xử lý</p>
            </div>
            <div className="feature-box">
              <img src={notifyLogo} alt="Minh họa" />
              <h3>Thông báo cho phụ huynh</h3>
              <p>Thông tin được gửi tức thì</p>
            </div>
            <div className="feature-box">
              <img src={statisticLogo} alt="Minh họa" />
              <h3>Báo cáo thống kê</h3>
              <p>Xuất báo cáo theo lớp, giới tính, độ tuổi,...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dành cho mọi đối tượng */}
      <section className="roles">
        <h2>Dành cho mọi đối tượng</h2>
        <p className="description">EduHealth được thiết kế phù hợp với nhu cầu của các bên liên quan trong hệ thống y tế học đường</p>
        <div className="role-row">
          <div className="role-card parent">
            <i className="fas fa-user-group role-icon"></i>
            <img src={parLogo} alt="parent logo"/>
            <h3>Phụ huynh</h3>
            <ul>
              <li> <img src={tickLogo} alt="tick logo"/> Theo dõi sức khỏe con</li>
              <li> <img src={tickLogo} alt="tick logo"/> Nhận thông báo y tế</li>
              <li> <img src={tickLogo} alt="tick logo"/> Chủ động phối hợp nhà trường</li>
            </ul>
            <button className="btn-parent">Dành cho phụ huynh</button>
          </div>
          <div className="role-card health">
            <i className="fas fa-briefcase-medical role-icon"></i>
            <img src={nurseLogo} alt="nurse logo"/>
            <h3>Y tá trường học</h3>
            <ul>
              <li> <img src={tickLogo} alt="tick logo"/> Quản lý hồ sơ sức khỏe</li>
              <li> <img src={tickLogo} alt="tick logo"/> Ghi nhận sơ cứu, thuốc, khám</li>
              <li> <img src={tickLogo} alt="tick logo"/> Thống kê nhanh chóng</li>
            </ul>
            <button className="btn-health">Dành cho y tế</button>
          </div>
          <div className="role-card board">
            <i className="fas fa-chalkboard-user role-icon"></i>
            <img src={adminLogo} alt="admin logo"/>
            <h3>Ban giám hiệu</h3>
            <ul>
              <li> <img src={tickLogo} alt="tick logo"/> Tổng quan dữ liệu trường</li>
              <li> <img src={tickLogo} alt="tick logo"/> Giám sát nhân sự y tế</li>
              <li> <img src={tickLogo} alt="tick logo"/> Thống kê & xuất báo cáo</li>
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
           <div className="feedback-user">
             <img src={feedback} alt="User" className="user-icon" />
             <strong>Nguyễn Thị Hương – Phụ huynh</strong>
           </div>
          </div>
          <div className="feedback-card">
            <p>“Tôi không còn phải ghi chép bằng giấy...”</p>
            <div className="feedback-user">
             <img src={feedback} alt="User" className="user-icon" />
             <strong>Trần Văn Duy – Y tá</strong>
           </div>
          </div>
          <div className="feedback-card">
            <p>“Hệ thống giúp tôi nắm được sức khỏe học sinh...”</p>
            <div className="feedback-user">
             <img src={feedback} alt="User" className="user-icon" />
             <strong>Nguyễn Thị Ánh Dương – Hiệu trưởng</strong>
           </div>
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

