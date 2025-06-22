import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/SendMedicine.module.css";
import { FiInfo, FiEdit, FiClipboard } from "react-icons/fi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendMedicine = () => {
  const [title, setTitle] = useState("");
  const [usage, setUsage] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const parentId = localStorage.getItem("parentId");

  const historyEndRef = useRef(null);
  const historyTopRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!title.trim()) return toast.error("Vui lòng nhập tên thuốc!");
    if (!usage.trim()) return toast.error("Vui lòng nhập liều dùng!");
    if (!parentId) return toast.error("Không có thông tin phụ huynh.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("medicationName", title);
      formData.append("dosage", usage);
      formData.append("instructions", note);
      if (file) formData.append("imageFile", file);

      await axios.post(
        `https://swp-school-medical-management.onrender.com/api/MedicationRequest/create?parentId=${parentId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Đã gửi đơn thuốc!");
      setTitle("");
      setUsage("");
      setNote("");
      setFile(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Gửi thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentName = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/Student/${studentId}`
      );
      const name = res.data.data.fullName;
      setStudentName(name);
      return name;
    } catch (err) {
      console.error("Không lấy được tên học sinh:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const name = await fetchStudentName();
      const res = await axios.get(
        "https://swp-school-medical-management.onrender.com/api/MedicationRequest/all"
      );
      const all = res.data;
      const filtered = all.filter(
        (item) =>
          item.studentName?.toLowerCase().trim() === name?.toLowerCase().trim()
      );
      const sorted = filtered.sort(
        (a, b) => new Date(b.requestDate) - new Date(a.requestDate)
      );
      setHistory(sorted);
    } catch (err) {
      console.error("Lỗi khi lọc lịch sử thuốc:", err);
    }
  };

  useEffect(() => {
    if (studentId) fetchHistory();
  }, [studentId]);

  const filteredHistory = history.filter((item) =>
    `${item.medicationName} ${item.instructions}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Prescription |</h2>
        <div className={styles.marquee}>
          <span className={styles.marqueeText}>
            Xin chào, bạn đang đăng nhập với tư cách phụ huynh em {studentName || "..."}
          </span>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.medicineInfo}>
            <div className={styles.medicineSectionTitle}>Thông tin thuốc</div>

            <div className={`${styles.box} ${styles.boxYellow}`}>
              <h3><FiInfo style={{ marginRight: 8, color: "#f59e42" }} /> Thông tin bệnh</h3>
              <textarea
                placeholder="Nhập tên thuốc hoặc thông tin bệnh..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputField}
              ></textarea>
            </div>

            <div className={`${styles.box} ${styles.boxBlue}`}>
              <h3><FiEdit style={{ marginRight: 8, color: "#3b82f6" }} /> Liều dùng</h3>
              <input
                type="text"
                placeholder="3 lần/ngày..."
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={`${styles.box} ${styles.boxGreen}`}>
              <h3><FiClipboard style={{ marginRight: 8, color: "#10b981" }} /> Ghi chú thêm</h3>
              <textarea
                placeholder="Uống sau khi ăn 30 phút"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.inputField}
              ></textarea>
            </div>

            <div className={styles.uploadSection}>
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <p className={styles.uploadText}>Tải lên tài liệu hoặc kéo thả file vào đây</p>
                <p>PDF, DOC, JPG, PNG - tối đa 10MB</p>
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>

          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <span>Lịch sử gửi thuốc {history.length > 0 && `(${history.length})`}</span>
              <button
                className={styles.reviewBtn}
                onClick={() => setShowPopup(true)}
              >
                Xem thêm
              </button>
            </div>

            <input
              type="text"
              placeholder="🔍 Tìm theo tên thuốc hoặc ghi chú..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchBox}
            />

            {(showAll ? filteredHistory : filteredHistory.slice(0, 3)).map((item, index) => (
              <div
                key={index}
                className={`${styles.historyItem} ${styles.fadeIn}`}
                ref={index === 0 ? historyTopRef : null}
              >
                <h4>{item.medicationName}</h4>
                <p>📅 {new Date(item.requestDate).toLocaleDateString("vi-VN")}</p>
                <p>💊 {item.dosage}</p>
                <p>📝 {item.instructions}</p>
                {item.imagePath && (
                  <p>
                    📄 File:{" "}
                    <a
                      href={`https://swp-school-medical-management.onrender.com${item.imagePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600, color: "#2563eb", textDecoration: "underline" }}
                    >
                      Xem file
                    </a>
                  </p>
                )}
                <div className={styles.statusRow}>
                  <span className={`${styles.status} ${item.status === "Đã duyệt" ? styles.done : item.status === "Chờ duyệt" ? styles.pending : styles.reject}`}>
                    {item.status === "Đã duyệt" ? "Đã duyệt" : item.status === "Chờ duyệt" ? "Chờ duyệt" : "Từ chối"}
                  </span>
                </div>
              </div>
            ))}
            <div ref={historyEndRef} />
          </div>
        </div>

        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <div className={styles.popupHeader}>
                <span>Lịch sử gửi thuốc ({filteredHistory.length})</span>
                <button className={styles.closeBtn} onClick={() => setShowPopup(false)}>✖</button>
              </div>
            
              <input
                type="text"
                placeholder="🔍 Tìm theo tên thuốc hoặc ghi chú..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchBox}
                style={{ marginBottom: 18 }}
              />
              <div className={styles.popupBody}>
                {filteredHistory.map((item, index) => (
                  <div key={index} className={styles.historyItem}>
                    <h4>{item.medicationName}</h4>
                    <p>📅 {new Date(item.requestDate).toLocaleDateString("vi-VN")}</p>
                    <p>💊 {item.dosage}</p>
                    <p>📝 {item.instructions}</p>
                    {item.imagePath && (
   <p>
                    📄 File:{" "}
                    <a
                      href={`https://swp-school-medical-management.onrender.com${item.imagePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontWeight: 600, color: "#2563eb", textDecoration: "underline" }}
                    >
                      Xem file
                    </a>
                  </p>
                    )}
                    <div className={styles.statusRow}>
                      <span className={`${styles.status} ${item.status === "Đã duyệt" ? styles.done : item.status === "Chờ duyệt" ? styles.pending : styles.reject}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMedicine;
