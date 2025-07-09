import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";

// Error messages
const ERROR_MESSAGES = {
  FETCH_STUDENTS_FAILED: "Lỗi khi lấy danh sách học sinh",
  FETCH_NOTIFICATIONS_FAILED: "Không thể tải thông báo",
  FETCH_CONSENT_FORMS_FAILED: "Không thể tải phiếu đồng ý vaccine",
  SEND_RESPONSE_FAILED: "Không thể gửi phản hồi!",
  DECLINE_REASON_REQUIRED: "Vui lòng nhập lý do từ chối",
  NO_STUDENTS_LINKED: "Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ liên kết với con em mình."
};

// Success messages
const SUCCESS_MESSAGES = {
  CONSENT_SENT: (agree) => `Đã gửi phản hồi ${agree ? "đồng ý" : "từ chối"} thành công.`
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  NOTIFICATIONS: `${API_BASE_URL}/Notification`,
  CONSENT_REQUESTS: (studentId) => `${API_BASE_URL}/VaccinationCampaign/consent-requests/student/${studentId}`,
  UPDATE_CONSENT: (requestId) => `${API_BASE_URL}/VaccinationCampaign/consent-requests/${requestId}`
};

// Tab configuration
const TABS = {
  ALL: "all",
  VACCINE: "vaccine",
  RESULT_HEALTH: "result-health",
  RESULT_VACCINE: "result-vaccine",
  REPLIED: "replied"
};

const NotificationAndReport = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [consentForms, setConsentForms] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [declineReason, setDeclineReason] = useState("");
  const [showReasonBoxId, setShowReasonBoxId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Get auth data from localStorage
  const parentId = localStorage.getItem("userId");

  // Utility functions
  const getSelectedStudentName = useCallback(() => {
    const student = students.find(s => s.studentId === selectedStudentId);
    return student?.fullName || "...";
  }, [students, selectedStudentId]);

  const isConsentResponded = useCallback((statusName) => {
    return statusName === "Đồng ý" || statusName === "Từ chối";
  }, []);

  // API calls
  const fetchStudents = useCallback(async () => {
    if (!parentId) {
      console.error("No parentId found");
      return;
    }

    try {
      console.log(`Fetching students for parent ID: ${parentId}`);
      const response = await axios.get(API_ENDPOINTS.STUDENTS_BY_PARENT(parentId));
      const studentList = response.data?.data || [];
      
      setStudents(studentList);
      
      if (studentList.length > 0) {
        setSelectedStudentId(studentList[0].studentId);
        console.log(`Selected default student: ${studentList[0].fullName}`);
      } else {
        console.warn("No students found for this parent");
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED);
    }
  }, [parentId]);

  const fetchNotifications = useCallback(async () => {
    if (!selectedStudentId || students.length === 0) {
      return;
    }

    try {
      console.log(`Fetching notifications for student ID: ${selectedStudentId}`);
      const response = await axios.get(API_ENDPOINTS.NOTIFICATIONS);
      const allNotifications = response.data?.data || [];
      
      const studentName = getSelectedStudentName();
      const studentNotifications = allNotifications.filter(
        notification =>
          notification.receiverId === parentId && 
          notification.message?.includes(studentName)
      );
      
      setNotifications(studentNotifications);
      console.log(`Found ${studentNotifications.length} notifications for ${studentName}`);
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_NOTIFICATIONS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_NOTIFICATIONS_FAILED);
    }
  }, [selectedStudentId, students, parentId, getSelectedStudentName]);

  const fetchConsentForms = useCallback(async () => {
    if (!selectedStudentId) {
      return;
    }

    try {
      console.log(`Fetching consent forms for student ID: ${selectedStudentId}`);
      const response = await axios.get(API_ENDPOINTS.CONSENT_REQUESTS(selectedStudentId));
      const consentData = response.data?.data || [];
      
      setConsentForms(consentData);
      console.log(`Found ${consentData.length} consent forms`);
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_CONSENT_FORMS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_CONSENT_FORMS_FAILED);
    }
  }, [selectedStudentId]);

  // Event handlers
  const handleStudentChange = useCallback((e) => {
    const newStudentId = Number(e.target.value);
    setSelectedStudentId(newStudentId);
    console.log(`Student changed to ID: ${newStudentId}`);
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    console.log(`Tab changed to: ${tab}`);
  }, []);

  const handleConsent = useCallback(async (requestId, agree) => {
    if (!agree && declineReason.trim() === "") {
      toast.warning(ERROR_MESSAGES.DECLINE_REASON_REQUIRED);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        consentStatusId: agree ? 2 : 3,
        consentReason: agree ? null : declineReason,
      };

      console.log(`Sending consent response: ${agree ? 'agree' : 'decline'} for request ${requestId}`);
      
      await axios.put(API_ENDPOINTS.UPDATE_CONSENT(requestId), payload);
      
      toast.success(SUCCESS_MESSAGES.CONSENT_SENT(agree));
      
      // Reset form state
      setShowReasonBoxId(null);
      setDeclineReason("");
      
      // Refresh consent forms
      await fetchConsentForms();
      
    } catch (error) {
      console.error(ERROR_MESSAGES.SEND_RESPONSE_FAILED, error);
      toast.error(ERROR_MESSAGES.SEND_RESPONSE_FAILED);
    } finally {
      setLoading(false);
    }
  }, [declineReason, fetchConsentForms]);

  const handleNotificationRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.notificationId === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Data filtering
  const getFilteredItems = useCallback(() => {
    const combined = [
      ...notifications.map(n => ({ ...n, itemType: "notification" })),
      ...consentForms.map(f => ({ ...f, itemType: "consent" })),
    ];

    const filtered = combined.filter(item => {
      if (!item) return false;
      
      switch (activeTab) {
        case TABS.ALL:
          return (
            item.itemType === "notification" ||
            (item.itemType === "consent" && !isConsentResponded(item.consentStatusName))
          );
        case TABS.VACCINE:
          return (
            item.itemType === "consent" && !isConsentResponded(item.consentStatusName)
          );
        case TABS.RESULT_HEALTH:
          return (
            item.itemType === "notification" &&
            item.title?.includes("Kết quả khám sức khỏe")
          );
        case TABS.RESULT_VACCINE:
          return (
            item.itemType === "notification" &&
            item.title?.includes("Kết quả tiêm chủng")
          );
        case TABS.REPLIED:
          return (
            item.itemType === "consent" && isConsentResponded(item.consentStatusName)
          );
        default:
          return true;
      }
    });

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.requestDate || a.sentDate);
      const dateB = new Date(b.requestDate || b.sentDate);
      return dateB - dateA;
    });
  }, [notifications, consentForms, activeTab, isConsentResponded]);

  // Effects
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedStudentId) {
      fetchNotifications();
      fetchConsentForms();
    }
  }, [selectedStudentId, fetchNotifications, fetchConsentForms]);

  // Render functions
  const renderTabButtons = () => (
    <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
      <button 
        className={`${styles.tabButton} ${activeTab === TABS.ALL ? styles.active : ""}`} 
        onClick={() => handleTabChange(TABS.ALL)}
      >
        Tất cả
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === TABS.VACCINE ? styles.active : ""}`} 
        onClick={() => handleTabChange(TABS.VACCINE)}
      >
        Vaccine
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === TABS.RESULT_HEALTH ? styles.active : ""}`} 
        onClick={() => handleTabChange(TABS.RESULT_HEALTH)}
      >
        Kết quả khám sức khỏe
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === TABS.RESULT_VACCINE ? styles.active : ""}`} 
        onClick={() => handleTabChange(TABS.RESULT_VACCINE)}
      >
        Kết quả tiêm chủng
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === TABS.REPLIED ? styles.active : ""}`} 
        onClick={() => handleTabChange(TABS.REPLIED)}
      >
        Lịch sử phản hồi
      </button>
    </div>
  );

  const renderStudentSelector = () => (
    <>
      <label>Chọn học sinh:</label>
      <select
        value={selectedStudentId || ""}
        onChange={handleStudentChange}
      >
        {students.map(student => (
          <option key={student.studentId} value={student.studentId}>
            {student.fullName} - {student.className}
          </option>
        ))}
      </select>
    </>
  );

  const renderConsentActions = (item) => {
    const isResponded = isConsentResponded(item.consentStatusName);
    
    if (isResponded) {
      return (
        <span
          className={`${styles.tag} ${
            item.consentStatusName === "Từ chối" ? styles.rejectTag : styles.approveTag
          }`}
        >
          {item.consentStatusName === "Từ chối" ? "❌ Từ chối" : "✅ Đồng ý"}
        </span>
      );
    }

    return (
      <>
        <div className={styles.responseActions}>
          <button 
            className={styles.approve} 
            onClick={() => handleConsent(item.requestId, true)}
            disabled={loading}
          >
            ✅ Đồng ý
          </button>
          <button 
            className={styles.decline} 
            onClick={() => setShowReasonBoxId(item.requestId)}
            disabled={loading}
          >
            ❌ Từ chối
          </button>
        </div>
        
        {showReasonBoxId === item.requestId && (
          <div className={styles.reasonBox}>
            <textarea
              placeholder="Nhập lý do từ chối..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
            <button 
              className={styles.confirmDecline} 
              onClick={() => handleConsent(item.requestId, false)}
              disabled={loading || !declineReason.trim()}
            >
              {loading ? "Đang gửi..." : "Gửi lý do"}
            </button>
          </div>
        )}
      </>
    );
  };

  const renderConsentItem = (item) => (
    <div className={`${styles.card} ${styles.notifyCard}`} key={item.requestId}>
      <div className={styles.actionRow}>
        <span className={styles.tag}>Chiến dịch tiêm chủng</span>
        {isConsentResponded(item.consentStatusName) && (
          <span
            className={`${styles.tag} ${
              item.consentStatusName === "Từ chối" ? styles.rejectTag : styles.approveTag
            }`}
          >
            {item.consentStatusName === "Từ chối" ? "❌ Từ chối" : "✅ Đồng ý"}
          </span>
        )}
      </div>
      <h3>{item.campaignName}</h3>
      <p><strong>Chi tiết:</strong> Phụ huynh vui lòng xác nhận đồng ý để nhà trường tiến hành tiêm chủng.</p>
      <p><strong>Học sinh:</strong> {item.studentName}</p>
      <p><strong>Ngày gửi:</strong> {new Date(item.requestDate).toLocaleDateString("vi-VN")}</p>
      
      {renderConsentActions(item)}
    </div>
  );

  const renderNotificationItem = (item) => (
    <div
      className={`${styles.card} ${styles.notifyCard}`}
      key={item.notificationId}
      onClick={() => handleNotificationRead(item.notificationId)}
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

  const renderItem = (item) => {
    return item.itemType === "consent" 
      ? renderConsentItem(item) 
      : renderNotificationItem(item);
  };

  const renderEmptyState = () => (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          {/* Icon */}
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(32, 178, 170, 0.15)'
          }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#20b2aa" strokeWidth="1.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>

          {/* Heading */}
          <h2 style={{ 
            color: '#0284c7', 
            fontSize: '28px', 
            fontWeight: '700', 
            marginBottom: '16px',
            lineHeight: '1.3'
          }}>
            Chưa có liên kết học sinh
          </h2>

          {/* Description */}
          <p style={{ 
            color: '#64748b', 
            fontSize: '16px', 
            lineHeight: '1.6',
            maxWidth: '500px',
            marginBottom: '32px'
          }}>
            {ERROR_MESSAGES.NO_STUDENTS_LINKED}
          </p>

          {/* Steps */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              color: '#334155', 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              Các bước để nhận thông báo và phản hồi:
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#20b2aa',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>1</div>
                <span style={{ color: '#475569', fontSize: '15px' }}>
                  Liên hệ với nhà trường qua số điện thoại hoặc email
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#20b2aa',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>2</div>
                <span style={{ color: '#475569', fontSize: '15px' }}>
                  Cung cấp thông tin cá nhân và thông tin con em
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#20b2aa',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>3</div>
                <span style={{ color: '#475569', fontSize: '15px' }}>
                  Đợi nhà trường xác nhận và liên kết tài khoản
                </span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div style={{
            marginTop: '24px',
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #f0f4ff 100%)',
            borderRadius: '12px',
            border: '1px solid #20b2aa'
          }}>
            <p style={{ 
              color: '#0284c7', 
              fontSize: '14px', 
              fontWeight: '500',
              margin: 0
            }}>
              💡 Sau khi liên kết thành công, bạn sẽ nhận được thông báo và có thể phản hồi tại đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render logic
  if (students.length === 0) {
    return renderEmptyState();
  }

  const filteredItems = getFilteredItems();

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
        <p className={styles.subtitle}>
          Xin chào, bạn đang đăng nhập với tư cách phụ huynh em{" "}
          <strong>{getSelectedStudentName()}</strong>
        </p>

        {renderStudentSelector()}
        {renderTabButtons()}

        <div className={styles.listWrapper}>
          {filteredItems.length === 0 ? (
            <p>Không có dữ liệu để hiển thị.</p>
          ) : (
            filteredItems.map(renderItem)
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationAndReport;

