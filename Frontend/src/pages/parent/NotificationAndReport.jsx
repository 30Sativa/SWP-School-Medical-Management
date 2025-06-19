import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationAndReport = () => {
  const [notifications, setNotifications] = useState([]);
  const [consentRequests, setConsentRequests] = useState([]);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const studentId = localStorage.getItem("studentId");
  const parentId = localStorage.getItem("parentId");
  const parentName = localStorage.getItem("parentName") || "Phụ huynh";

  useEffect(() => {
    const dummyData = [
      {
        title: "Health Schedule Notification",
        date: "2025-06-12",
        content: `⚕️ THÔNG BÁO VỀ LỊCH KHÁM SỨC KHỎE ĐỊNH KỲ CHO HỌC SINH...`,
        type: "notification",
      },
      {
        title: "Vaccination Schedule",
        date: "2025-06-15",
        content: `📢 LỊCH TIÊM VẮC-XIN BỔ SUNG...`,
        type: "report",
      },
    ];
    setNotifications(dummyData);
    fetchConsentRequests();
  }, []);

  const fetchConsentRequests = async () => {
    try {
      const campaignId = 1; // tạm thời gán cố định cho bản demo
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaignId}/consent-requests`
      );
      const allData = res.data?.data;
      if (!Array.isArray(allData)) {
        console.warn("❗ Dữ liệu phiếu đồng ý không đúng định dạng:", allData);
        setConsentRequests([]);
      } else {
        const filtered = allData.filter(
          (item) => item.parentId === parentId && item.consentStatusName === "Chờ xác nhận"
        );
        setConsentRequests(filtered);
      }
    } catch (err) {
      console.error("Không lấy được danh sách phiếu đồng ý:", err);
      setConsentRequests([]);
    }
  };

  const handleConsent = async (id, agree) => {
    try {
      const payload = {
        consentGiven: agree,
        reason: agree ? null : declineReason,
      };
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/consent-requests/${id}`,
        payload
      );
      toast.success("Phản hồi thành công!");
      fetchConsentRequests();
      setDeclineReason("");
      setSelectedRequestId(null);
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
      toast.error("Không thể gửi phản hồi!");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
        <p className={styles.subtitle}>Xin chào, bạn đang đăng nhập với tư cách {parentName}</p>

        <div className={styles.listWrapper}>
          {notifications.map((item, index) => (
            <div
              className={`${styles.card} ${item.type === "report" ? styles.reportCard : styles.notifyCard}`}
              key={index}
            >
              <h3>{item.title}</h3>
              <p>
                <strong>Ngày:</strong> {item.date}
              </p>
              <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{item.content}</pre>
              <button className={styles.replyButton}>Reply</button>
            </div>
          ))}
        </div>

        <div className={styles.listWrapper}>
          <h3>📋 Phiếu đồng ý tham gia chiến dịch y tế</h3>
          {consentRequests.length === 0 ? (
            <p>Không có phiếu nào cần phản hồi.</p>
          ) : (
            consentRequests.map((item) => (
              <div className={styles.card} key={item.requestId}>
                <h4>{item.campaignName}</h4>
                <p>
                  <strong>Ngày:</strong> {new Date(item.requestDate).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Học sinh:</strong> {item.studentName}
                </p>
                <div className={styles.responseActions}>
                  <button className={styles.approve} onClick={() => handleConsent(item.requestId, true)}>
                    ✅ Đồng ý
                  </button>
                  <button className={styles.decline} onClick={() => setSelectedRequestId(item.requestId)}>
                    ❌ Từ chối
                  </button>
                </div>
                {selectedRequestId === item.requestId && (
                  <div className={styles.reasonBox}>
                    <textarea
                      placeholder="Nhập lý do từ chối..."
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                    />
                    <button onClick={() => handleConsent(item.requestId, false)} className={styles.confirmDecline}>
                      Gửi lý do
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationAndReport;
