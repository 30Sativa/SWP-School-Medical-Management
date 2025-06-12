import React from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/SendMedicine.module.css";
import { FiInfo, FiEdit, FiClipboard } from "react-icons/fi";
const SendMedicine = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Prescription |</h2>
        <div className={styles.marquee}>
          <span className={styles.marqueeText}>
            Xin chào, bạn đang đăng nhập với tư cách phụ huynh em Trần Văn Hùng
          </span>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.medicineInfo}>
            <div className={styles.medicineSectionTitle}>Thông tin thuốc</div>
            {/* THÔNG TIN BỆNH */}
            <div className={`${styles.box} ${styles.boxYellow}`}>
              <h3>
                <FiInfo style={{ marginRight: 8, color: "#f59e42" }} />
                Thông tin bệnh
              </h3>
              <p>Cảm, ho, sổ mũi</p>
            </div>
            {/* PHẦN LIỀU DÙNG */}
            <div className={`${styles.box} ${styles.boxBlue}`}>
              <h3>
                <FiEdit style={{ marginRight: 8, color: "#3b82f6" }} />
                Liều dùng
              </h3>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="3 lần/ngày..."
                  className={styles.inputField}
                />
                <button className={styles.confirmBtn}>Xác nhận</button>
              </div>
            </div>
            {/* PHẦN GHI CHÚ THÊM */}
            <div className={`${styles.box} ${styles.boxGreen}`}>
              <h3>
                <FiClipboard style={{ marginRight: 8, color: "#10b981" }} />
                Ghi chú thêm
              </h3>
              <p>Uống sau khi ăn 30 phút</p>
            </div>

            <div className={styles.uploadSection}>
              <label
                htmlFor="file-upload"
                style={{ cursor: "pointer", display: "block" }}
              >
                <p className={styles.uploadText}>
                  Tải lên tài liệu hoặc kéo thả file vào đây
                </p>
                <p>PDF, DOC tối đa 10MB</p>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx"
                  // onChange={handleFileChange}
                />
              </label>
            </div>
            <button className={styles.sendBtn}>Gửi</button>
          </div>

          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <span>Lịch sử gửi thuốc</span>
              <button className={styles.reviewBtn}>Xem tất cả</button>
            </div>
            <div className={styles.historyItem}>
              <h4>Thuốc cảm</h4>
              <p>Ngày: 01-05/06/2025</p>
              <p>Liều lượng: 3l/ngày</p>
              <div className={styles.statusRow}>
                <span className={`${styles.status} ${styles.done}`}>
                  Đã xong
                </span>
                <button className={styles.reviewBtn}>Xem lại</button>
              </div>
            </div>
            <div className={styles.historyItem}>
              <h4>Đau răng</h4>
              <p>Ngày: 12-15/06/2025</p>
              <p>Liều lượng: 2l/ngày</p>
              <div className={styles.statusRow}>
                <span className={`${styles.status} ${styles.done}`}>
                  Đã xong
                </span>
                <button className={styles.reviewBtn}>Xem lại</button>
              </div>
            </div>
            <div className={styles.historyItem}>
              <h4>Sốt</h4>
              <p>Ngày: 20-22/06/2025</p>
              <p>Liều lượng: 1l/ngày</p>
              <div className={styles.statusRow}>
                <span className={`${styles.status} ${styles.pending}`}>
                  Đang cho uống
                </span>
                <button className={styles.reviewBtn}>Xem lại</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMedicine;