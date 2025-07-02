import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/parentDashboard.module.css";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ParentDashboard = () => {
  const parentId = localStorage.getItem("userId");
  const [overview, setOverview] = useState(null);
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");

  // Tìm kiếm và lọc
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewRes = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/Dashboard/overview"
        );
        setOverview(overviewRes.data.data);

        const studentRes = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/Student/by-parent/${parentId}`
        );
        setMyStudents(studentRes.data.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [parentId]);

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) return toast.error("❌ Nội dung không được để trống");

    try {
      await axios.post("https://swp-school-medical-management.onrender.com/api/ParentFeedback", {
        parentId,
        content: feedbackContent,
        createdAt: new Date().toISOString(),
      });

      toast.success("Gửi góp ý thành công!");
      setFeedbackContent("");
      setShowFeedbackForm(false);
    } catch (err) {
      toast.error("🚫 Gửi góp ý thất bại");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.customSpinner}>
          <div className={styles.spinnerIcon}></div>
          <div className={styles.spinnerText}> Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  if (!overview || myStudents.length === 0) return <p>⚠️ Không có dữ liệu để hiển thị.</p>;

  const myStudentNames = myStudents.map((s) => s.fullName);

  const filteredMedications = overview.recentMedicationRequests.filter(
    (item) =>
      myStudentNames.includes(item.studentName) &&
      (item.medicationName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchKeyword.toLowerCase())) &&
      (filterStatus === "" || item.status === filterStatus)
  );

  const filteredEvents = overview.recentMedicalEvents.filter(
    (event) =>
      myStudentNames.includes(event.studentName) &&
      (event.eventType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        event.studentName.toLowerCase().includes(searchKeyword.toLowerCase())) &&
      (filterSeverity === "" || event.severity === filterSeverity)
  );

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
              </h1>
              <h5 className={styles["text-welcome"]}>
                Chào mừng trở lại, phụ huynh của {myStudents[0]?.fullName}!
              </h5>
            </div>
          </div>
        </header>
        <div className={styles["top-action-row"]}>
          <div className={styles["action-card-v2"]}>
            <div className={styles["card-text"]}>
              <h4>Đóng góp ý kiến</h4>
              <p>Hãy đóng góp ý kiến về cho trường nhé</p>
              <a href="#" onClick={() => setShowFeedbackForm(true)}>ĐÓNG GÓP →</a>
            </div>
            <div className={styles["card-icon"]}>
              <div className={styles["icon-circle"]}>💬</div>
            </div>
          </div>

          <div className={styles["action-card-v2"]}>
            <div className={styles["card-text"]}>
              <h4>Hướng dẫn sử dụng</h4>
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
              <input
                type="text"
                placeholder="🔍 Tìm kiếm tên học sinh, thuốc, sự kiện"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Trạng thái đơn thuốc</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Chờ duyệt">Chờ duyệt</option>
              </select>
              <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                <option value="">Mức độ sự kiện</option>
                <option value="Nhẹ">Nhẹ</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Nặng">Nặng</option>
              </select>
            </div>
          </div>

          <div className={styles["info-cards"]}>
            <div className={styles["info-card"]}>
              <h4>Số học sinh của bạn</h4>
              <p>{myStudents.length} học sinh</p>
            </div>
            <div className={styles["info-card"]}>
              <h4>Sự kiện y tế gần đây</h4>
              <p>{filteredEvents.length} sự kiện</p>
            </div>
            <div className={styles["info-card"]}>
              <h4>Đơn thuốc đã gửi</h4>
              <p>{filteredMedications.length} đơn</p>
            </div>
          </div>
        </div>

        {/* GRID PHẢI 2 CỘT */}
        <div className={styles["main-right-grid"]}>
          <div className={styles["health-check-box"]}>
            <h4>Đơn thuốc gần đây</h4>
            {filteredMedications.length === 0 && <p>Không có đơn thuốc gần đây.</p>}
            {filteredMedications.map((item, i) => (
              <div className={styles["health-item"]} key={i}>
                <div className={styles["health-left"]}>
                  <h5>{item.studentName}</h5>
                  <p>Thuốc: {item.medicationName}</p>
                  <p>Ngày gửi: {dayjs(item.requestDate).format("DD/MM/YYYY HH:mm")}</p>
                  <span className={`${styles.tag} ${styles.blue}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.box} ${styles.reminders}`}>
            <h4>Sự kiện y tế gần đây</h4>
            <div className={styles["reminder-list"]}>
              {filteredEvents.length === 0 && <p>Không có sự kiện gần đây.</p>}
              {filteredEvents.map((event, i) => (
                <div
                  key={i}
                  className={`${styles["reminder-card"]} ${
                    event.severity === "Nhẹ"
                      ? styles.green
                      : event.severity === "Trung bình"
                      ? styles.yellow
                      : styles.red
                  }`}
                >
                  <div className={styles["reminder-icon"]}><span>⚠️</span></div>
                  <div className={styles["reminder-content"]}>
                    <strong>{event.studentName}</strong>
                    <p>{event.eventType} - {event.severity}</p>
                    <p>{dayjs(event.eventDate).format("DD/MM/YYYY HH:mm")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FORM GÓP Ý */}
        {showFeedbackForm && (
          <div className={styles.feedbackOverlay}>
            <div className={styles.feedbackModal}>
              <h3>Góp ý cho trường</h3>
              <textarea
                rows="5"
                placeholder="Nhập ý kiến của bạn..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button onClick={handleSubmitFeedback}>Gửi</button>
                <button onClick={() => setShowFeedbackForm(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </main>
    </div>
  );
};

export default ParentDashboard;


