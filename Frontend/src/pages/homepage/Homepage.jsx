// Homepage.jsx - đã sửa dùng module CSS
import React, { useEffect, useRef } from "react";
import style from "../../assets/css/homepage.module.css";
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
import school1 from "../../assets/img/school1.jpeg";
import school2 from "../../assets/img/school2.jpeg";
import school3 from "../../assets/img/school3.jpeg";
import useAosInit from "../../hooks/useAosInit";
import "aos/dist/aos.css";

const Homepage = () => {
  const navigate = useNavigate();
  const heroRef = useRef();
  const featuresRef = useRef();
  const rolesRef = useRef();
  const feedbackRef = useRef();
  const ctaRef = useRef();
  const [slideIdx, setSlideIdx] = React.useState(0);
  const heroImages = [school1, school2, school3];
  const [feedbacks, setFeedbacks] = React.useState([]);

  // Hiệu ứng xuất hiện khi cuộn
  useEffect(() => {
    const reveal = (ref, className = style.sectionVisible) => {
      if (!ref.current) return;
      const onScroll = () => {
        const rect = ref.current.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
          ref.current.classList.add(className);
        }
      };
      window.addEventListener("scroll", onScroll);
      onScroll();
      return () => window.removeEventListener("scroll", onScroll);
    };
    reveal(heroRef);
    reveal(featuresRef);
    reveal(rolesRef);
    reveal(feedbackRef);
    reveal(ctaRef);
  }, []);

  // Tự động chuyển slide mỗi 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIdx((idx) => (idx + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  useEffect(() => {
    fetch('https://swp-school-medical-management.onrender.com/api/ParentFeedback')
      .then(res => res.json())
      .then(data => {
        if (data.status === "200" && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        }
      });
  }, []);

  useAosInit();

  // Scroll đến section theo ref
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Footer scroll handler giống header
  const handleFooterNav = (section) => {
    if (section === "home") scrollToRef(heroRef);
    else if (section === "features" || section === "about" || section === "service") scrollToRef(featuresRef);
    else if (section === "contact") scrollToRef(ctaRef);
  };

  // Nút scroll to top
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <header className={style.navbar}>
        <div className={style.logo}>
          <img src={logo} alt="EduHealth Logo" className={style.logoImg} />
        </div>
        <nav className={style.navLinks}>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); scrollToRef(heroRef); }}>Trang chủ</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); scrollToRef(featuresRef); }}>Giới thiệu</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); scrollToRef(featuresRef); }}>Dịch vụ</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); scrollToRef(ctaRef); }}>Liên hệ</a>
          <button className={style.loginBtn} onClick={() => navigate("/login")}>Đăng nhập</button>
        </nav>
      </header>

      <section className={style.hero} ref={heroRef} data-aos="fade-in">
        <div className={style.heroBgSlideshow}>
          {heroImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`slide-${idx+1}`}
              className={
                style.heroBgImg +
                (idx === slideIdx ? ' ' + style.activeBg : ' ' + style.inactiveBg)
              }
              style={{ zIndex: idx === slideIdx ? 2 : 1, transition: 'opacity 1.2s cubic-bezier(.4,0,.2,1), transform 1.2s cubic-bezier(.4,0,.2,1)' }}
              
            />
          ))}
          <div className={style.slideDotsBg} data-aos="fade-up" data-aos-delay="400">
            {heroImages.map((_, idx) => (
              <span
                key={idx}
                className={idx === slideIdx ? style.dotActive : style.dot}
                onClick={() => setSlideIdx(idx)}
              />
            ))}
          </div>
        </div>
        <div className={style.heroTextOverlay} data-aos="fade-up" data-aos-delay="200">
          <h1 className={style.fadeInDown}>
            Hệ thống quản lý <span className={style.highlight}>sức khỏe học đường</span>
          </h1>
          <p className={style.heroDesc}>
            EduHealth là hệ thống phần mềm hỗ trợ quản lý toàn diện các hoạt động y tế trong trường học. Hệ thống giúp phụ huynh, nhân viên y tế và nhà trường phối hợp hiệu quả trong việc chăm sóc sức khỏe học sinh – từ khai báo thông tin y tế, xử lý các tình huống khẩn cấp, đến quản lý tiêm chủng và kiểm tra sức khỏe định kỳ.
          </p>
          
          <div className={style.heroButtons}>
            <button className={style.primaryBtn + ' ' + style.btnPulse} onClick={e => { e.preventDefault(); scrollToRef(featuresRef); }}>Tìm hiểu thêm </button>
          </div>
        </div>
      </section>

      <section className={style.features} ref={featuresRef} data-aos="fade-up">
        <h2 className={style.fadeInUp}>Tính năng nổi bật</h2>
        <p className={style.description + ' ' + style.fadeInUp}>EduHealth cung cấp những tính năng đầy đủ...</p>
        <div className={style.featureRows}>
          <div className={style.featureRow}>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="0"><img src={overlayLogo} alt="" className={style.iconAnim}/><h3>Quản lý thuốc</h3><p>Theo dõi đơn thuốc...</p></div>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="100"><img src={vacxinLogo} alt="" className={style.iconAnim}/><h3>Tiêm chủng</h3><p>Quản lý chiến dịch...</p></div>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="200"><img src={healthLogo} alt="" className={style.iconAnim}/><h3>Khám sức khỏe</h3><p>Quản lý chỉ số...</p></div>
          </div>
          <div className={style.featureRow}>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="0"><img src={reportLogo} alt="" className={style.iconAnim}/><h3>Hồ sơ sức khỏe</h3><p>Ghi nhận và theo dõi...</p></div>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="100"><img src={notifyLogo} alt="" className={style.iconAnim}/><h3>Thông báo</h3><p>Thông tin tức thì</p></div>
            <div className={style.featureBox + ' ' + style.boxHover} data-aos="zoom-in" data-aos-delay="200"><img src={statisticLogo} alt="" className={style.iconAnim}/><h3>Báo cáo</h3><p>Xuất báo cáo theo lớp...</p></div>
          </div>
        </div>
      </section>

      <section className={style.roles} ref={rolesRef} data-aos="fade-up">
        <h2 className={style.fadeInUp}>Dành cho mọi đối tượng</h2>
        <p className={style.description + ' ' + style.fadeInUp}>EduHealth được thiết kế...</p>
        <div className={style.roleRow}>
          <div className={style.roleCard + ' ' + style.cardHover + ' ' + style.parent} data-aos="flip-left" data-aos-delay="0">
            <img src={parLogo} alt="" />
            <h3>Phụ huynh</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Theo dõi sức khỏe con</li>
              <li><img src={tickLogo} alt="" /> Nhận thông báo</li>
              <li><img src={tickLogo} alt="" /> Chủ động phối hợp</li>
            </ul>
            <button className={style.btnParent + ' ' + style.btnShine}>Dành cho phụ huynh</button>
          </div>
          <div className={style.roleCard + ' ' + style.cardHover + ' ' + style.health} data-aos="flip-left" data-aos-delay="100">
            <img src={nurseLogo} alt="" />
            <h3>Y tá</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Quản lý hồ sơ</li>
              <li><img src={tickLogo} alt="" /> Ghi nhận sơ cứu</li>
              <li><img src={tickLogo} alt="" /> Thống kê</li>
            </ul>
            <button className={style.btnHealth + ' ' + style.btnShine}>Dành cho y tế</button>
          </div>
          <div className={style.roleCard + ' ' + style.cardHover + ' ' + style.board} data-aos="flip-left" data-aos-delay="200">
            <img src={adminLogo} alt="" />
            <h3>Ban giám hiệu</h3>
            <ul>
              <li><img src={tickLogo} alt="" /> Tổng quan dữ liệu</li>
              <li><img src={tickLogo} alt="" /> Giám sát nhân sự</li>
              <li><img src={tickLogo} alt="" /> Thống kê & báo cáo</li>
            </ul>
            <button className={style.btnBoard + ' ' + style.btnShine}>Dành cho BGH</button>
          </div>
        </div>
      </section>

      <section className={style.feedback + ' ' + style.sectionVisible} ref={feedbackRef} data-aos="fade-up">
        <h2 className={style.fadeInUp}>Phụ huynh nói gì về chúng tôi</h2>
        <div className={style.feedbackCards}>
          {feedbacks.slice(0, 3).map((fb, idx) => (
            <div
              key={fb.feedbackId || fb.feedbackID || fb.id || idx}
              className={style.feedbackCard + ' ' + style.cardSlideUp}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
            >
              <p>{fb.content}</p>
              <div className={style.feedbackUser}>
                <img src={feedback} alt="" className={style.userIcon} />
                <strong>{fb.parentName}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={style.cta} ref={ctaRef} data-aos="fade-up">
        <h2 className={style.fadeInUp}>Sẵn sàng nâng cao chất lượng?</h2>
        <p>Đăng ký ngay để trải nghiệm hệ thống quản lý sức khỏe học đường.</p>
        <div className={style.ctaButtons}>
          <button className={style.primaryBtn + ' ' + style.btnPulse} onClick={() => navigate("/login")}>Đăng ký trải nghiệm</button>
          <button className={style.outlineBtn + ' ' + style.btnPulse} onClick={e => { e.preventDefault(); scrollToRef(featuresRef); }}>Tìm hiểu thêm</button>
        </div>
      </section>

      <footer className={style.footer}>
        <div className={style.footerTop}>
          <div className={style.footerColumn}><div className={style.footerLogo}>EduHealth</div></div>
          <div className={style.footerColumn}><h4>Liên kết nhanh</h4><ul>
            <li><a href="#" onClick={e => {e.preventDefault(); handleFooterNav("home");}}>Trang chủ</a></li>
            <li><a href="#" onClick={e => {e.preventDefault(); handleFooterNav("features");}}>Dịch vụ</a></li>
            <li><a href="#" onClick={e => {e.preventDefault(); handleFooterNav("features");}}>Giới thiệu</a></li>
            
          </ul></div>
          <div className={style.footerColumn}><h4>Hỗ trợ</h4><ul><li><a href="#">Trung tâm trợ giúp</a></li><li><a href="#">Chính sách</a></li><li><a href="#">Bảo mật</a></li></ul></div>
          <div className={style.footerColumn}><h4>Liên hệ</h4><ul><li>Email: support@eduhealth.vn</li><li>Địa chỉ: 7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh</li><li>Điện thoại: 0123 456 789</li></ul></div>
        </div>
        <div className={style.footerBottom}><p>© 2025 EduHealth. All rights reserved.</p></div>
      </footer>
      {showScrollTop && (
        <button
          className={style.scrollTopBtn}
          onClick={handleScrollTop}
          aria-label="Lên đầu trang"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#06b6d4"/>
            <path d="M16 22V10M16 10L10 16M16 10L22 16" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </>
  );
};

export default Homepage;
