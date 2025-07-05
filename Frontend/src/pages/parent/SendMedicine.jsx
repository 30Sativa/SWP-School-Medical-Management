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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState(localStorage.getItem("studentId"));
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const parentId = localStorage.getItem("parentId");
  const historyEndRef = useRef(null);
  const historyTopRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else {
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSend = async () => {
    const trimmedTitle = title.trim();
    const trimmedUsage = usage.trim();
    const trimmedNote = note.trim();

    if (!studentId) {
      return toast.error("Vui lòng chọn học sinh!", { position: "top-center", autoClose: 2500, theme: "colored" });
    }

    if (!trimmedTitle) {
      return toast.error("Vui lòng nhập tên thuốc!", { position: "top-center", autoClose: 2500, theme: "colored" });
    }

    if (trimmedTitle.length < 3) {
      return toast.error("Tên thuốc phải có ít nhất 3 ký tự!", { position: "top-center", autoClose: 2500, theme: "colored" });
    }

    const titleRegex = /^[\p{L}0-9\s\-+®.™]+$/u;
    if (!titleRegex.test(trimmedTitle)) {
      return toast.error("Tên thuốc chỉ được chứa chữ, số và các ký tự hợp lệ như -, +, ®, ™, .", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }

    if (!trimmedUsage) {
      return toast.error("Vui lòng nhập liều dùng!", { position: "top-center", autoClose: 2500, theme: "colored" });
    }

    if (trimmedUsage.length < 3) {
      return toast.error("Liều dùng phải có ít nhất 3 ký tự!", { position: "top-center", autoClose: 2500, theme: "colored" });
    }

    const dosageRegex = /^[\p{L}0-9\s\/\-×]+$/u;
    if (!dosageRegex.test(trimmedUsage)) {
      return toast.error("Liều dùng chỉ được chứa chữ, số và ký tự hợp lệ như /, -, ×", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }

    const noteRegex = /^[\p{L}0-9\s.,;:()\-\u2013\u2014]+$/u;
    if (trimmedNote && !noteRegex.test(trimmedNote)) {
      return toast.error("Ghi chú chỉ được chứa chữ, số và các ký tự như dấu chấm, phẩy, ngoặc đơn.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }

    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
      ];
      const maxSizeMB = 10;

      if (!allowedTypes.includes(file.type)) {
        return toast.error("Định dạng file không hợp lệ! Chỉ hỗ trợ PDF, DOC, DOCX, PNG, JPG.", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        return toast.error("Kích thước file vượt quá 10MB!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });
      }
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("medicationName", trimmedTitle);
      formData.append("dosage", trimmedUsage);
      formData.append("instructions", trimmedNote);
      if (file) formData.append("imageFile", file);

      await axios.post(
        `https://swp-school-medical-management.onrender.com/api/MedicationRequest/create?parentId=${parentId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Đã gửi đơn thuốc!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });

      setTitle("");
      setUsage("");
      setNote("");
      setFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      fetchHistory();
    } catch (err) {
      console.error(err);
      toast.error("Gửi đơn thuốc thất bại!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentList = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/Student/by-parent/${parentId}`
      );
      const data = res.data.data;
      setStudentList(data);
      if (!studentId && data.length > 0) {
        setStudentId(data[0].studentId);
        localStorage.setItem("studentId", data[0].studentId);
      }
    } catch (err) {
      console.error("Không lấy được danh sách học sinh:", err);
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
    fetchStudentList();
  }, []);

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
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Prescription |</h2>
        <div className={styles.marquee}>
          <span className={styles.marqueeText}>
            Xin chào, bạn đang đăng nhập với tư cách phụ huynh em {studentName || "..."}
          </span>
        </div>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <label style={{ fontWeight: 600, fontSize: "16px", color: "#1e3a8a" }}>Chọn học sinh:</label>
          <select
            value={studentId}
            onChange={(e) => {
              setStudentId(e.target.value);
              localStorage.setItem("studentId", e.target.value);
            }}
            className={styles.selectStudent}
          >
            {studentList.map((student) => (
              <option key={student.studentId} value={student.studentId}>
                {student.fullName} - {student.className}
              </option>
            ))}
          </select>
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
                {!file && (
                  <>
                    <p className={styles.uploadText}>Tải lên tài liệu hoặc kéo thả file vào đây</p>
                    <p>PDF, DOC, JPG, PNG - tối đa 10MB</p>
                  </>
                )}
                <input
                  id="file-upload"
                  type="file"
                  style={{ display: "none" }}
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>

              {file && (
                <div className={styles.fileInfo}>
                  <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  <button onClick={() => { setFile(null); setPreviewUrl(null); }} className={styles.removeFileBtn}>❌</button>
                  {previewUrl && (
                    <div style={{ marginTop: 10 }}>
                      <img
                        src={previewUrl}
                        alt="preview"
                        style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8, border: "1px solid #e5e7eb" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className={styles.sendBtn} onClick={handleSend} disabled={loading}>
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
                    📄 File: <a href={`https://swp-school-medical-management.onrender.com${item.imagePath}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "#2563eb", textDecoration: "underline" }}>Xem file</a>
                  </p>
                )}
                <div className={styles.statusRow}>
                  <span className={`${styles.status} ${item.status === "Đã duyệt" ? styles.done : item.status === "Chờ duyệt" ? styles.pending : styles.reject}`}>
                    {item.status === "Đã duyệt" ? "Đã duyệt" : item.status === "Chờ duyệt" ? "Chờ duyệt" : item.status === "Đã hoàn thành" ? "Đã lên lịch" : "Bị từ chối"}
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
                        📄 File: <a href={`https://swp-school-medical-management.onrender.com${item.imagePath}`} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "#2563eb", textDecoration: "underline" }}>Xem file</a>
                      </p>
                    )}
                    <div className={styles.statusRow}>
                      <span className={`${styles.status} ${item.status === "Đã duyệt" ? styles.done : item.status === "Chờ duyệt" ? styles.pending : styles.reject}`}>
                        {item.status === "Đã duyệt" ? "Đã duyệt" : item.status === "Chờ duyệt" ? "Chờ duyệt" : item.status === "Đã hoàn thành" ? "Đã lên lịch" : "Bị từ chối"}
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