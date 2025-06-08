// Homepage.jsx - đã sửa dùng module CSS
import React, { useEffect } from "react";
import style from "../../assets/css/homepage.module.css";
import minhhoa from "../../assets/img/homepage.jpg";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/icon/eduhealth.jpg";
import parLogo from "../../assets/icon/Background.png";
import nurseLogo from "../../assets/icon/nurse.png";
import adminLogo from "../../assets/icon/admin.png";
import tickLogo from "../../assets/icon/tick.png";
import overlayLogo from "../../assets/icon/Overlay.png";
import healthLogo from "../../assets/icon/healthcheck.png";
import statisticLogo from "../../assets/icon/statistic.png";
import reportLogo from "../../assets/icon/report.png";
import notifyLogo from "../../assets/icon/notify.png";
import vacxinLogo from "../../assets/icon/vacxin.png";
import feedback from "../../assets/icon/feedback.png";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = (...args) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === "q") return target.q;
          return (...args) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "CkJUXMzUTtGaAYX6V8_iH";
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);
  }, []);

  return (
    <>
      <header className={style.navbar}>
        <div className={style.logo}>
          <img src={logo} alt="EduHealth Logo" className={style.logoImg} />
        </div>
        <nav className={style.navLinks}>
          <a href="#">Trang chủ</a>
          <a href="#">Giới thiệu</a>
          <a href="#">Dịch vụ</a>
          <a href="#">Liên hệ</a>
          <button className={style.loginBtn} onClick={() => navigate("/login")}>Đăng nhập</button>
        </nav>
      </header>

      <section className={style.hero}>
        <div className={style.heroText}>
          <h1>
            Hệ thống quản lý <span className={style.highlight}>sức khỏe học đường</span>
          </h1>
          <p>Kết nối phụ huynh, nhà trường và đội ngũ y tế...</p>
          <div className={style.heroButtons}>
            <button className={style.primaryBtn}>Tìm hiểu thêm </button>
          </div>
        </div>
        <div className={style.heroImage}>
          <img src={minhhoa} alt="Minh họa" />
        </div>
      </section>

      <section className={style.features}>
        <h2>Tính năng nổi bật</h2>
        <p className={style.description}>EduHealth cung cấp những tính năng đầy đủ...</p>
        <div className={style.featureRows}>
          <div className={style.featureRow}>
            <div className={style.featureBox}><img src={overlayLogo} alt="" /><h3>Quản lý thuốc</h3><p>Theo dõi đơn thuốc...</p></div>
            <div className={style.featureBox}><img src={vacxinLogo} alt="" /><h3>Tiêm chủng</h3><p>Quản lý chiến dịch...</p></div>
            <div className={style.featureBox}><img src={healthLogo} alt="" /><h3>Khám sức khỏe</h3><p>Quản lý chỉ số...</p></div>
          </div>
          <div className={style.featureRow}>
            <div className={style.featureBox}><img src={reportLogo} alt="" /><h3>Hồ sơ sức khỏe</h3><p>Ghi nhận và theo dõi...</p></div>
            <div className={style.featureBox}><img src={notifyLogo} alt="" /><h3>Thông báo</h3><p>Thông tin tức thì</p></div>
            <div className={style.featureBox}><img src={statisticLogo} alt="" /><h3>Báo cáo</h3><p>Xuất báo cáo theo lớp...</p></div>
          </div>
        </div>
      </section>

      <section className={style.roles}>
        <h2>Dành cho mọi đối tượng</h2>
        <p className={style.description}>EduHealth được thiết kế...</p>
        <div className={style.roleRow}>
          <div className={`${style.roleCard} ${style.parent}`}>
            <img src={parLogo} alt="" />
            <h3>Phụ huynh</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Theo dõi sức khỏe con</li>
              <li><img src={tickLogo} alt="" /> Nhận thông báo</li>
              <li><img src={tickLogo} alt="" /> Chủ động phối hợp</li>
            </ul>
            <button className={style.btnParent}>Dành cho phụ huynh</button>
          </div>

          <div className={`${style.roleCard} ${style.health}`}>
            <img src={nurseLogo} alt="" />
            <h3>Y tá</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Quản lý hồ sơ</li>
              <li><img src={tickLogo} alt="" /> Ghi nhận sơ cứu</li>
              <li><img src={tickLogo} alt="" /> Thống kê</li>
            </ul>
            <button className={style.btnHealth}>Dành cho y tế</button>
          </div>

          <div className={`${style.roleCard} ${style.board}`}>
            <img src={adminLogo} alt="" />
            <h3>Ban giám hiệu</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Tổng quan dữ liệu</li>
              <li><img src={tickLogo} alt="" /> Giám sát nhân sự</li>
              <li><img src={tickLogo} alt="" /> Thống kê & báo cáo</li>
            </ul>
            <button className={style.btnBoard}>Dành cho BGH</button>
          </div>
        </div>
      </section>

      <section className={style.feedback}>
        <h2>Khách hàng nói gì về chúng tôi</h2>
        <div className={style.feedbackCards}>
          <div className={style.feedbackCard}><p>“Ứng dụng dễ sử dụng...”</p><div className={style.feedbackUser}><img src={feedback} alt="" className={style.userIcon} /><strong>Nguyễn Thị Hương</strong></div></div>
          <div className={style.feedbackCard}><p>“Tôi không phải ghi giấy...”</p><div className={style.feedbackUser}><img src={feedback} alt="" className={style.userIcon} /><strong>Trần Văn Duy</strong></div></div>
          <div className={style.feedbackCard}><p>“Giúp tôi nắm được sức khỏe...”</p><div className={style.feedbackUser}><img src={feedback} alt="" className={style.userIcon} /><strong>Nguyễn Thị Ánh Dương</strong></div></div>
        </div>
      </section>

      <section className={style.cta}>
        <h2>Sẵn sàng nâng cao chất lượng?</h2>
        <p>Đăng ký ngay để trải nghiệm hệ thống quản lý sức khỏe học đường.</p>
        <div className={style.ctaButtons}>
          <button className={style.primaryBtn}>Đăng ký trải nghiệm</button>
          <button className={style.outlineBtn}>Tìm hiểu thêm</button>
        </div>
      </section>

      <footer className={style.footer}>
        <div className={style.footerTop}>
          <div className={style.footerColumn}><div className={style.footerLogo}>EduHealth</div></div>
          <div className={style.footerColumn}><h4>Liên kết nhanh</h4><ul><li><a href="#">Trang chủ</a></li><li><a href="#">Dịch vụ</a></li><li><a href="#">Giới thiệu</a></li><li><a href="#">Blog</a></li></ul></div>
          <div className={style.footerColumn}><h4>Hỗ trợ</h4><ul><li><a href="#">Trung tâm trợ giúp</a></li><li><a href="#">Chính sách</a></li><li><a href="#">Bảo mật</a></li></ul></div>
          <div className={style.footerColumn}><h4>Liên hệ</h4><ul><li>Email: support@eduhealth.vn</li><li>Địa chỉ: Q1, TP.HCM</li><li>Điện thoại: 0123 456 789</li></ul></div>
        </div>
        <div className={style.footerBottom}><p>© 2025 EduHealth. All rights reserved.</p></div>
      </footer>
    </>
  );
};

export default Homepage;
