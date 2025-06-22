import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationAndReport = () => {
  const [consentRequests, setConsentRequests] = useState([]);
  const [declineReason, setDeclineReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const studentId = localStorage.getItem("studentId");
  const parentName = localStorage.getItem("parentName") || "Phụ huynh";

  useEffect(() => {
    fetchConsentRequests();
  }, []);

  const fetchConsentRequests = async () => {
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/consent-requests/student/${studentId}`
      );
      const data = res.data?.data || [];
      const filtered = data.filter(
        (item) => item.consentStatusName === "Chờ xác nhận"
      );
      setConsentRequests(filtered);
    } catch (err) {
      console.error("Không lấy được danh sách phiếu đồng ý:", err);
      toast.error("Lỗi khi tải dữ liệu phiếu đồng ý.");
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

      toast.success("Phản hồi thành công!");
      fetchConsentRequests();
      setSelectedRequestId(null);
      setDeclineReason("");
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
        <p className={styles.subtitle}>
          Xin chào, bạn đang đăng nhập với tư cách {parentName}
        </p>

        <div className={styles.listWrapper}>
          <h3>📋 Phiếu đồng ý tham gia chiến dịch y tế</h3>
          {consentRequests.length === 0 ? (
            <p>Không có phiếu nào cần phản hồi.</p>
          ) : (
            consentRequests.map((item) => (
              <div className={styles.card} key={item.requestId}>
                <h4>{item.campaignName}</h4>
                <p>
                  <strong>Học sinh:</strong> {item.studentName}
                </p>
                <p>
                  <strong>Ngày gửi:</strong>{" "}
                  {new Date(item.requestDate).toLocaleDateString("vi-VN")}
                </p>

                <div className={styles.responseActions}>
                  <button
                    className={styles.approve}
                    onClick={() => handleConsent(item.requestId, true)}
                  >
                    ✅ Đồng ý
                  </button>
                  <button
                    className={styles.decline}
                    onClick={() => setSelectedRequestId(item.requestId)}
                  >
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
                    <button
                      className={styles.confirmDecline}
                      onClick={() => handleConsent(item.requestId, false)}
                    >
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
