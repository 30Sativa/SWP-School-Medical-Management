import React, { useEffect } from "react";
import "../../assets/css/nursedashboard.css";
import log1 from "../../assets/icon/feedback.png";
import log2 from "../../assets/icon/nurse.png";
import log3 from "../../assets/icon/notify.png";
import log4 from "../../assets/icon/Overlay.png";
import log5 from "../../assets/icon/tick.png";
import log6 from "../../assets/icon/vacxin.png";
import Sidebar from "../../components/sidebar/Sidebar"; // ✅ Sử dụng lại Sidebar component
const NurseDashBoard = () => {
  // ✅ Thêm Chatbase script khi component mount
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
      script.id = "CkJUXMzUTtGaAYX6V8_iH"; // 👈 ID của bạn
      script.domain = "www.chatbase.co";
      document.body.appendChild(script);
    };

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
    }
  }, []);

  return (
    <div className="container">
      <Sidebar />

      <main className="content">
        <header>
          <div className="dashboard-header-bar">
            <div className="title-group">
              <h1>
                <span className="text-accent">|</span>
                <span className="text-black">Dash</span>
                <span className="text-accent">board</span>
                <h5 className="text-welcome">Chào mừng trở lại!</h5>
              </h1>
            </div>
          </div>
        </header>

        {/* Stats cards */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Yêu cầu thuốc chờ xử lý</div>
              <div className="stat-value">12</div>
              <div className="stat-sub" style={{ color: "#22c55e" }}>
                +2 so với hôm qua
              </div>
            </div>
            <img src={log1} alt="feedback" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Mũi tiêm sắp tới</div>
              <div className="stat-value">87</div>
              <div className="stat-sub">Trong tuần này</div>
            </div>
            <img src={log5} alt="tick" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Kiểm tra sức khỏe</div>
              <div className="stat-value">35</div>
              <div className="stat-sub" style={{ color: "#22c55e" }}>
                Đã lên lịch trong tuần
              </div>
            </div>
            <img src={log3} alt="notify" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <div className="stat-title">Sự cố được báo cáo</div>
              <div className="stat-value">3</div>
              <div className="stat-sub" style={{ color: "#ef4444" }}>
                +1 so với hôm qua
              </div>
            </div>
            <img src={log2} alt="nurse" />
          </div>
        </section>

        {/* Body main: Yêu cầu thuốc + Cảnh báo */}
        <div className="dashboard-4col">
          <div className="left-column">
            {" "}
            {/* Left requests */}
            <section className="card-requests">
              <div className="request-header">
                <h2>Yêu cầu thuốc</h2>
                <a href="#" className="see-all">
                  Xem tất cả →
                </a>
              </div>
              <table className="request-table-ui">
                <thead>
                  <tr>
                    <th>Học sinh</th>
                    <th>Thuốc</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="student-cell">
                        <span className="avatar blue">👦</span> Trần Minh Anh
                      </div>
                    </td>
                    <td>Paracetamol 250mg</td>
                    <td>
                      <span className="status-pill yellow">Chờ xử lý</span>
                    </td>
                    <td>08:30 - 26/05/2025</td>
                    <td>
                      <button className="view-btn">👁</button>
                      <button className="done-btn">Đã cấp</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="student-cell">
                        <span className="avatar pink">👧</span> Nguyễn Thị Hồng
                        Nhung
                      </div>
                    </td>
                    <td>Cetirizine 5mg</td>
                    <td>
                      <span className="status-pill yellow">Chờ xử lý</span>
                    </td>
                    <td>09:15 - 26/05/2025</td>
                    <td>
                      <button className="view-btn">👁</button>
                      <button className="done-btn">Đã cấp</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="student-cell">
                        <span className="avatar blue">👦</span> Lê Hoàng Minh
                      </div>
                    </td>
                    <td>Ibuprofen 200mg</td>
                    <td>
                      <span className="status-pill green">Đã cấp</span>
                    </td>
                    <td>07:45 - 26/05/2025</td>
                    <td>
                      <button className="view-btn">👁</button>
                      <button className="done-btn">Đã cấp</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="student-cell">
                        <span className="avatar blue">👦</span> Vũ Đức Hiếu
                      </div>
                    </td>
                    <td>Paracetamol 250mg</td>
                    <td>
                      <span className="status-pill yellow">Chờ xử lý</span>
                    </td>
                    <td>10:05 - 26/05/2025</td>
                    <td>
                      <button className="view-btn">👁</button>
                      <button className="done-btn">Đã cấp</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            {/* Kiểm tra sức khỏe */}
            <section className="health-check">
              <div className="health-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#22c55e"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <div>
                  <div className="health-info">
                    Khám sức khỏe định kỳ
                    <br />
                    <small>
                      Ngày: 01-05/06/2025 <br /> Đối tượng: Tất cả học sinh
                    </small>
                    <br />
                    <small>145 học sinh</small>
                  </div>
                </div>
              </div>
              <button className="btn-soon">Sắp diễn ra</button>
              <button className="btn-notify">Gửi thông báo</button>
            </section>
            {/* Chiến dịch tiêm chủng */}
            <section className="card-box campaigns-wrapper">
              <h2>Chiến dịch tiêm chủng</h2>
              <div className="campaigns">
                <div className="campaign-card">
                  <h3>Tiêm phòng cúm mùa</h3>
                  <p>
                    <strong>Ngày:</strong> 10/06/2025
                  </p>
                  <p>
                    <strong>Đối tượng:</strong> Học sinh lớp 1-3
                  </p>
                  <div className="campaign-status">Đã lên lịch</div>
                  <div className="campaign-count">87 học sinh</div>
                  <button className="btn-campaign-notify">Gửi thông báo</button>
                </div>
                <div className="campaign-card">
                  <h3>Tiêm phòng viêm não Nhật Bản</h3>
                  <p>
                    <strong>Ngày:</strong> 25/06/2025
                  </p>
                  <p>
                    <strong>Đối tượng:</strong> Học sinh lớp 1
                  </p>
                  <div className="campaign-status">Đã lên lịch</div>
                  <div className="campaign-count">42 học sinh</div>
                  <button className="btn-campaign-notify">Gửi thông báo</button>
                </div>
              </div>
            </section>
          </div>

          <div className="right-column">
            <div className="right-top">
              <div className="reminder-box">
                <h3 className="reminder-title">Cảnh báo & Nhắc nhở</h3>

                <div className="reminder-item yellow">
                  <img src={log4}></img>
                  <div className="text">
                    <strong>Thuốc sắp hết</strong>
                    <div className="subtext">Paracetamol 250mg còn 10 viên</div>
                    <a className="blue-text" href="#">
                      Đặt thêm
                    </a>
                  </div>
                </div>

                <div className="reminder-item blue">
                  <div className="icon">📄</div>
                  <div className="text">
                    <strong>Giấy tờ còn thiếu</strong>
                    <div className="subtext">
                      5 học sinh chưa nộp giấy khám sức khỏe
                    </div>
                    <a className="blue-text" href="#">
                      Xem danh sách
                    </a>
                  </div>
                </div>

                <div className="reminder-item green">
                  <div className="icon">📅</div>
                  <div className="text">
                    <strong>Sự kiện sắp tới</strong>
                    <div className="subtext">
                      Khám sức khỏe định kỳ: 01/06/2025
                      <br />
                      Tiêm phòng cúm mùa: 10/06/2025
                    </div>
                  </div>
                </div>
              </div>

              {/* Sự cố gần đây */}
            </div>

            <div className="right-bottm">
              <section className=" recent-incidents">
                <div className="incident-header">
                  <h2>Sự cố gần đây</h2>
                  <a href="#" className="see-all">
                    Xem tất cả →
                  </a>
                </div>

                <ul className="incident-list-ui">
                  {/* Sự cố 1 */}
                  <li className="incident-card">
                    <img src={log2}></img>
                    <div className="incident-content">
                      <strong>Trần Minh Anh - Lớp 2A</strong>
                      <p>Bị ngã trong giờ ra chơi, trầy xước đầu gối</p>
                      <span className="incident-status danger">Cần xử lý</span>
                    </div>
                    <div className="incident-time">10:15</div>
                  </li>

                  {/* Sự cố 2 */}
                  <li className="incident-card">
                    <img src={log6}></img>
                    <div className="incident-content">
                      <strong>Nguyễn Thị Hồng Nhung - Lớp 1B</strong>
                      <p>Cảm thấy chóng mặt, buồn nôn</p>
                      <span className="incident-status success">Đã xử lý</span>
                    </div>
                    <div className="incident-time">09:30</div>
                  </li>

                  {/* Sự cố 3 + 4 (trùng) */}
                  <li className="incident-card">
                    <img src={log2}></img>
                    <div className="incident-content">
                      <strong>Vũ Đức Hiếu - Lớp 1A</strong>
                      <p>Phát ban nhẹ trên cánh tay, nghi ngờ dị ứng</p>
                      <span className="incident-status danger">Cần xử lý</span>
                    </div>
                    <div className="incident-time">08:45</div>
                  </li>
                  <li className="incident-card">
                    <img src={log2}></img>
                    <div className="incident-content">
                      <strong>Vũ Đức Hiếu - Lớp 1A</strong>
                      <p>Phát ban nhẹ trên cánh tay, nghi ngờ dị ứng</p>
                      <span className="incident-status danger">Cần xử lý</span>
                    </div>
                    <div className="incident-time">08:45</div>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseDashBoard;
