import React, { useEffect, useState } from "react"; 
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
  const studentId = localStorage.getItem("studentId");
  const parentId = localStorage.getItem("parentId");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSend = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập thông tin bệnh hoặc tên thuốc!");
      return;
    }
    if (!usage.trim()) {
      toast.error("Vui lòng nhập liều dùng!");
      return;
    }
    if (!parentId) {
      toast.error("Không tìm thấy thông tin phụ huynh.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("medicationName", title);
      formData.append("dosage", usage);
      formData.append("instructions", note);
      if (file) formData.append("imageFile", file);

      const res = await axios.post(
        `https://swp-school-medical-management.onrender.com/api/MedicationRequest/create?parentId=${parentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Gửi yêu cầu thuốc thành công!");
      setTitle("");
      setUsage("");
      setNote("");
      setFile(null);
      fetchHistory();
    } catch (error) {
      if (error.response) {
        console.warn("Phản hồi lỗi từ server:", error.response.data);
        toast.error(error.response.data?.message || "Gửi thuốc thất bại!");
      } else {
        console.error("Lỗi gửi thuốc:", error);
        toast.error("Gửi thuốc thất bại!");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/MedicationRequest/student/${studentId}`
      );
      if (Array.isArray(res.data.data)) {
        setHistory(res.data.data);
      } else {
        console.warn("Dữ liệu lịch sử thuốc không phải là mảng:", res.data.data);
        setHistory([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.warn("Không có lịch sử thuốc nào.");
        setHistory([]);
      } else {
        console.error("Lỗi khi tải lịch sử thuốc:", err);
      }
    }
  };

  const fetchStudentName = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/Student/${studentId}`
      );
      setStudentName(res.data.data.fullName);
    } catch (err) {
      console.warn("Không thể tải tên học sinh:", err);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchHistory();
      fetchStudentName();
    }
  }, [studentId]);

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
              <h3>
                <FiInfo style={{ marginRight: 8, color: "#f59e42" }} />
                Thông tin bệnh
              </h3>
              <textarea
                placeholder="Nhập tên thuốc hoặc thông tin bệnh..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.inputField}
              ></textarea>
            </div>

            <div className={`${styles.box} ${styles.boxBlue}`}>
              <h3>
                <FiEdit style={{ marginRight: 8, color: "#3b82f6" }} />
                Liều dùng
              </h3>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="3 lần/ngày..."
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={`${styles.box} ${styles.boxGreen}`}>
              <h3>
                <FiClipboard style={{ marginRight: 8, color: "#10b981" }} />
                Ghi chú thêm
              </h3>
              <textarea
                placeholder="Uống sau khi ăn 30 phút"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={styles.inputField}
              ></textarea>
            </div>

            <div className={styles.uploadSection}>
              <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
                <p className={styles.uploadText}>
                  Tải lên tài liệu hoặc kéo thả file vào đây
                </p>
                <p>PDF, DOC tối đa 10MB</p>
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
              <span>Lịch sử gửi thuốc</span>
              <button className={styles.reviewBtn}>Xem tất cả</button>
            </div>
            {Array.isArray(history) && history.map((item, index) => (
              <div key={index} className={styles.historyItem}>
                <h4>{item.medicationName || "Không rõ tên thuốc"}</h4>
                <p>Ngày: {new Date(item.requestDate).toLocaleDateString("vi-VN")}</p>
                <p>Liều lượng: {item.dosage}</p>
                <div className={styles.statusRow}>
                  <span
                    className={`${styles.status} ${
                      item.status === "Completed"
                        ? styles.done
                        : item.status === "Rejected"
                        ? styles.rejected
                        : styles.pending
                    }`}
                  >
                    {item.status === "Completed"
                      ? "Đã xong"
                      : item.status === "Rejected"
                      ? "Bị từ chối"
                      : "Đang cho uống"}
                  </span>
                  <button className={styles.reviewBtn}>Xem lại</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMedicine;

