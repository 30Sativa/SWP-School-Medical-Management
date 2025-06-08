import React from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/ParentDashboard.module.css"; // ✅ Đúng cách import CSS module

const ParentDashboard = () => {
  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        <header>
          <div className={styles["dashboard-header-bar"]}>
            <div className={styles["title-group"]}>
              <h1>
                <span className={styles["text-accent"]}>|</span>
                <span className={styles["text-black"]}>Dash</span>
                <span className={styles["text-accent"]}>board</span>
                <h5 className={styles["text-welcome"]}>Chào mừng trở lại!</h5>
              </h1>
            </div>
          </div>
        </header>

        {/* ACTION CARDS */}
        <div className={styles["top-action-row"]}>
          <div className={styles["action-card-v2"]}>
            <div className={styles["card-text"]}>
              <h4>Đóng góp ý kiến</h4>
              <p>Hãy đóng góp ý kiến về cho trường nhé</p>
              <a href="#">ĐÓNG GÓP →</a>
            </div>
            <div className={styles["card-icon"]}>
              <div className={styles["icon-circle"]}>💬</div>
            </div>
          </div>

          <div className={styles["action-card-v2"]}>
            <div className={styles["card-text"]}>
              <h4>Hướng dẫn sử dụng</h4>
              <p></p>
              <a href="#">TÌM HIỂU THÊM →</a>
            </div>
            <div className={styles["card-icon"]}>
              <div className={styles["icon-circle"]}>📘</div>
            </div>
          </div>
        </div>

        {/* THÔNG TIN CHUNG */}
        <div className={styles["info-section"]}>
          <div className={styles["info-header"]}>
            <h3>Thông tin chung</h3>
            <div className={styles["info-tools"]}>
              <input type="text" placeholder="🔍 Tìm kiếm thông tin" />
              <select>
                <option>Tất cả</option>
                <option>Sức khỏe</option>
                <option>Phòng y tế</option>
              </select>
            </div>
          </div>

          <div className={styles["info-cards"]}>
            {[1, 2, 3, 4].map((_, i) => (
              <div className={styles["info-card"]} key={i}>
                <div className={styles["card-top"]}>
                  <h4>Dự kiến khám sức khỏe định kỳ</h4>
                  <button className={styles["icon-btn"]}>💚</button>
                </div>
                <p>Ngày: 01-05/06/2025</p>
                <p>Đối tượng: Tất cả học sinh</p>
                <p className={styles.note}>
                  Phòng y tế sẽ điều chỉnh lại thời gian làm việc...
                </p>
                <div className={styles["card-bottom"]}>
                  <button className={styles["view-btn"]}>Xem chi tiết</button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pagination}>
            <span>Hiển thị 4 của 75 bài đăng</span>
            <div className={styles["page-nav"]}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} className={n === 1 ? styles.active : ""}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GRID PHẢI 2 CỘT: Kiểm tra + Nhắc nhở */}
        <div className={styles["main-right-grid"]}>
          {/* 1. Kiểm tra sức khỏe */}
          <div className={styles["health-check-box"]}>
            <h4>Kiểm tra sức khỏe</h4>
            {[1, 2, 3].map((_, i) => (
              <div className={styles["health-item"]} key={i}>
                <div className={styles["health-left"]}>
                  <h5>Kiểm tra sức khỏe định kỳ</h5>
                  <p>Ngày: 01-05/06/2025</p>
                  <p>Đối tượng: Tất cả học sinh</p>
                  <span className={`${styles.tag} ${styles.blue}`}>
                    Sắp diễn ra
                  </span>
                </div>
                <div className={styles["health-right"]}>
                  <p className={styles.count}>145 học sinh</p>
                  <button className={styles["btn-join"]}>Tham gia</button>
                </div>
              </div>
            ))}
          </div>

          {/* 2. Cảnh báo & Nhắc nhở */}
          <div className={`${styles.box} ${styles.reminders}`}>
            <h4>Cảnh báo & Nhắc nhở</h4>
            <div className={styles["reminder-list"]}>
              {/* 1. Thuốc sắp hết */}
              <div className={`${styles["reminder-card"]} ${styles.yellow}`}>
                <div className={styles["reminder-icon"]}>
                  <span role="img" aria-label="alert">
                    🟡
                  </span>
                </div>
                <div className={styles["reminder-content"]}>
                  <strong>Thuốc sắp hết</strong>
                  <p>Số thuốc phụ huynh cung cấp gần hết</p>
                  <a href="#">Bổ sung thêm</a>
                </div>
              </div>

              {/* 2. Giấy tờ còn thiếu */}
              <div className={`${styles["reminder-card"]} ${styles.blue}`}>
                <div className={styles["reminder-icon"]}>
                  <span role="img" aria-label="file">
                    📄
                  </span>
                </div>
                <div className={styles["reminder-content"]}>
                  <strong>Giấy tờ còn thiếu</strong>
                  <p>Trần Văn Hùng chưa nộp giấy khai sinh</p>
                  <a href="#">Nộp</a>
                </div>
              </div>

              {/* 3. Sự kiện sắp tới */}
              <div className={`${styles["reminder-card"]} ${styles.green}`}>
                <div className={styles["reminder-icon"]}>
                  <span role="img" aria-label="calendar">
                    📅
                  </span>
                </div>
                <div className={styles["reminder-content"]}>
                  <strong>Sự kiện sắp tới</strong>
                  <p>
                    Khám sức khỏe định kỳ: 01/06/2025
                    <br />
                    Tiêm phòng cúm mùa: 10/06/2025
                  </p>
                  <a href="#">Xem thêm</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
