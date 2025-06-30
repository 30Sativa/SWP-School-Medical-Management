import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationAndReport = () => {
  const parentId = localStorage.getItem("userId");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [consentForms, setConsentForms] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [declineReason, setDeclineReason] = useState("");
  const [showReasonBoxId, setShowReasonBoxId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      fetchNotifications();
      fetchConsentForms();
    }
  }, [selectedStudentId]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/Student/by-parent/${parentId}`
      );
      const studentList = res.data?.data || [];
      setStudents(studentList);
      if (studentList.length > 0) {
        setSelectedStudentId(studentList[0].studentId);
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách học sinh:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://swp-school-medical-management.onrender.com/api/Notification"
      );
      const all = res.data?.data || [];
      const studentName =
        students.find((s) => s.studentId === selectedStudentId)?.fullName || "";
      const studentNoti = all.filter(
        (n) =>
          n.receiverId === parentId && n.message?.includes(studentName)
      );
      setNotifications(studentNoti);
    } catch (err) {
      console.error("Không thể tải thông báo:", err);
    }
  };

  const fetchConsentForms = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/consent-requests/student/${selectedStudentId}`
      );
      setConsentForms(res.data?.data || []);
    } catch (err) {
      console.error("Không thể tải phiếu đồng ý vaccine:", err);
    }
  };

  const handleConsent = async (requestId, agree) => {
    if (!agree && declineReason.trim() === "") {
      toast.warning("Vui lòng nhập lý do từ chối.");
      return;
    }
    try {
      const payload = {
        consentStatusId: agree ? 2 : 3,
        consentReason: agree ? null : declineReason,
      };
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/consent-requests/${requestId}`,
        payload
      );
      toast.success(`Đã gửi phản hồi ${agree ? "đồng ý" : "từ chối"} thành công.`);
      fetchConsentForms();
      setShowReasonBoxId(null);
      setDeclineReason("");
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      toast.error("Không thể gửi phản hồi!");
    }
  };

  const filteredItems = () => {
    const combined = [
      ...notifications.map((n) => ({ ...n, itemType: "notification" })),
      ...consentForms.map((f) => ({ ...f, itemType: "consent" })),
    ];

    return combined.filter((item) => {
      if (!item) return false;
      if (activeTab === "all")
        return (
          item.itemType === "notification" ||
          (item.itemType === "consent" &&
            !["Đồng ý", "Từ chối"].includes(item.consentStatusName))
        );
      if (activeTab === "vaccine")
        return (
          item.itemType === "consent" &&
          item.campaignName?.toLowerCase().includes("tiêm chủng") &&
          !["Đồng ý", "Từ chối"].includes(item.consentStatusName)
        );
      if (activeTab === "result-health")
        return (
          item.itemType === "notification" &&
          item.title?.includes("Kết quả khám sức khỏe")
        );
      if (activeTab === "result-vaccine")
        return (
          item.itemType === "notification" &&
          item.title?.includes("Kết quả tiêm chủng")
        );
      if (activeTab === "replied")
        return (
          item.itemType === "consent" &&
          ["Đồng ý", "Từ chối"].includes(item.consentStatusName)
        );
      return true;
    });
  };

  const renderItem = (item) => {
    if (item.itemType === "consent") {
      const isResponded =
        item.consentStatusName === "Đồng ý" ||
        item.consentStatusName === "Từ chối";
      return (
        <div className={`${styles.card} ${styles.notifyCard}`} key={item.requestId}>
          <div className={styles.actionRow}>
            <span className={styles.tag}>Chiến dịch tiêm chủng</span>
            {isResponded && (
              <span
                className={`${styles.tag} ${
                  item.consentStatusName === "Từ chối"
                    ? styles.rejectTag
                    : styles.approveTag
                }`}
              >
                {item.consentStatusName === "Từ chối"
                  ? "❌ Từ chối"
                  : "✅ Đồng ý"}
              </span>
            )}
          </div>
          <h3>{item.campaignName}</h3>
          <p><strong>Chi tiết:</strong> Phụ huynh vui lòng xác nhận đồng ý để nhà trường tiến hành tiêm chủng.</p>
          <p><strong>Học sinh:</strong> {item.studentName}</p>
          <p><strong>Ngày gửi:</strong> {new Date(item.requestDate).toLocaleDateString("vi-VN")}</p>
          {!isResponded && (
            <div className={styles.responseActions}>
              <button className={styles.approve} onClick={() => handleConsent(item.requestId, true)}>✅ Đồng ý</button>
              <button className={styles.decline} onClick={() => setShowReasonBoxId(item.requestId)}>❌ Từ chối</button>
            </div>
          )}
          {showReasonBoxId === item.requestId && (
            <div className={styles.reasonBox}>
              <textarea
                placeholder="Nhập lý do từ chối..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <button className={styles.confirmDecline} onClick={() => handleConsent(item.requestId, false)}>
                Gửi lý do
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`${styles.card} ${styles.notifyCard}`}
        key={item.notificationId}
        onClick={() => {
          setNotifications((prev) =>
            prev.map((n) =>
              n.notificationId === item.notificationId
                ? { ...n, isRead: true }
                : n
            )
          );
        }}
      >
        <div className={styles.actionRow}>
          <span className={styles.tag}>
            {item.title?.includes("Kết quả tiêm chủng")
              ? "Kết quả tiêm chủng"
              : item.typeName}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p><strong>Nội dung:</strong> {item.message}</p>
        <p><strong>Ngày gửi:</strong> {new Date(item.sentDate).toLocaleString("vi-VN")}</p>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.content}>
        <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
        <p className={styles.subtitle}>
          Xin chào, bạn đang đăng nhập với tư cách phụ huynh em{" "}
          <strong>
            {students.find((s) => s.studentId === selectedStudentId)?.fullName || "..."}
          </strong>
        </p>

        <label>Chọn học sinh:</label>
        <select
          value={selectedStudentId || ""}
          onChange={(e) => setSelectedStudentId(Number(e.target.value))}
        >
          {students.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.fullName} - {s.className}
            </option>
          ))}
        </select>

        <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
          <button className={`${styles.tabButton} ${activeTab === "all" ? styles.active : ""}`} onClick={() => setActiveTab("all")}>Tất cả</button>
          <button className={`${styles.tabButton} ${activeTab === "vaccine" ? styles.active : ""}`} onClick={() => setActiveTab("vaccine")}>Vaccine</button>
          <button className={`${styles.tabButton} ${activeTab === "result-health" ? styles.active : ""}`} onClick={() => setActiveTab("result-health")}>Kết quả khám sức khỏe</button>
          <button className={`${styles.tabButton} ${activeTab === "result-vaccine" ? styles.active : ""}`} onClick={() => setActiveTab("result-vaccine")}>Kết quả tiêm chủng</button>
          <button className={`${styles.tabButton} ${activeTab === "replied" ? styles.active : ""}`} onClick={() => setActiveTab("replied")}>Lịch sử phản hồi</button>
        </div>

        <div className={styles.listWrapper}>
          {filteredItems().map((item) => renderItem(item))}
        </div>
      </div>
    </div>
  );
};

export default NotificationAndReport;

