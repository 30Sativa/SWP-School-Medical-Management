import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiBell, FiCheckCircle, FiClipboard, FiAlertTriangle, FiInbox, FiArchive } from 'react-icons/fi';


// Constants
const API_BASE_URL = "/api"; 

// Error messages
const ERROR_MESSAGES = {
  FETCH_STUDENTS_FAILED: "Lỗi khi lấy danh sách học sinh",
  FETCH_DATA_FAILED: "Không thể tải dữ liệu thông báo và phiếu điền.",
  SEND_RESPONSE_FAILED: "Không thể gửi phản hồi!",
  DECLINE_REASON_REQUIRED: "Vui lòng nhập lý do từ chối",
  NO_STUDENTS_LINKED: "Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ."
};

// Success messages
const SUCCESS_MESSAGES = {
  CONSENT_SENT: (agree) => `Đã gửi phản hồi ${agree ? "đồng ý" : "từ chối"} thành công.`
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  // NEW: Unified endpoint for all items for a parent
  PARENT_ITEMS: (parentId) => `${API_BASE_URL}/Notification/parent/${parentId}/notifications`,
  // OLD endpoints - kept UPDATE_CONSENT for now
  UPDATE_CONSENT: (requestId) => `${API_BASE_URL}/VaccinationCampaign/consent-requests/${requestId}`
};

// Tab configuration
const TABS = {
  ALL: "all",
  VACCINE: "vaccine",
  OTHER: "other",
  RESULT_HEALTH: "result-health",
  RESULT_VACCINE: "result-vaccine",
  REPLIED: "replied"
};

const NOTIFICATION_TYPES = {
  HEALTH_RESULT: "health_result",
  VACCINE_RESULT: "vaccine_result",
};

const NotificationAndReport = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [allItems, setAllItems] = useState([]); // New state for combined items
  const [activeTab, setActiveTab] = useState(TABS.ALL);
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [currentConsentItem, setCurrentConsentItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState(null);

  // Get auth data from localStorage
  const parentId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

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
    if (!parentId) return;
    try {
      const response = await axios.get(API_ENDPOINTS.STUDENTS_BY_PARENT(parentId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const studentList = response.data?.data || [];
      setStudents(studentList);
      if (studentList.length > 0) {
        setSelectedStudentId(studentList[0].studentId);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED);
    }
  }, [parentId, token]);

  const fetchDataForParent = useCallback(async () => {
    if (!parentId) return;
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.PARENT_ITEMS(parentId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllItems(response.data?.data || []);
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_DATA_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_DATA_FAILED);
    } finally {
      setLoading(false);
    }
  }, [parentId, token]);

  // Event handlers
  const handleStudentChange = (e) => setSelectedStudentId(Number(e.target.value));
  const handleTabChange = (tab) => setActiveTab(tab);

  const openDeclineModal = (item) => {
    setCurrentConsentItem(item);
    setDeclineReason("");
    setShowDeclineModal(true);
  };

  const closeDeclineModal = () => {
    setCurrentConsentItem(null);
    setShowDeclineModal(false);
  };

  const handleConsent = useCallback(async (agree, item) => {
    const requestId = item.requestId;
    if (!agree && !declineReason.trim()) {
      toast.warning(ERROR_MESSAGES.DECLINE_REASON_REQUIRED);
      return;
    }
    
    setSubmittingId(requestId);
    try {
      const payload = {
        consentStatusId: agree ? 2 : 3,
        consentReason: agree ? null : declineReason,
      };
      
      await axios.put(API_ENDPOINTS.UPDATE_CONSENT(requestId), payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(SUCCESS_MESSAGES.CONSENT_SENT(agree));
      closeDeclineModal();
      
      // Refresh consent forms optimistically
      setAllItems(prev => prev.map(item =>
        item.requestId === requestId
          ? { ...item, status: agree ? 'Đồng ý' : 'Từ chối' }
          : item
      ));
      
    } catch (error) {
      console.error(ERROR_MESSAGES.SEND_RESPONSE_FAILED, error);
      toast.error(ERROR_MESSAGES.SEND_RESPONSE_FAILED);
    } finally {
      setSubmittingId(null);
    }
  }, [declineReason, token]);

  // Data filtering
  const getFilteredItems = useCallback(() => {
    // Filter by selected student first
    const studentItems = allItems.filter(item => {
      // Show items for the selected student, plus items that are not student-specific (studentId is null/undefined)
      return item.studentId === selectedStudentId || item.studentId === null || item.studentId === undefined;
    });

    // Primary filtering based on the active tab
    const filteredByTab = studentItems.filter(item => {
      if (!item) return false;
      switch (activeTab) {
        case TABS.ALL:
          return true; // Already filtered by student, so show all
        case TABS.VACCINE:
          return item.itemType === "consent" && !isConsentResponded(item.status);
        case TABS.OTHER:
            const isHealthResultForOther = item.notificationType === NOTIFICATION_TYPES.HEALTH_RESULT;
            const isVaccineResultForOther = item.notificationType === NOTIFICATION_TYPES.VACCINE_RESULT;
            return item.itemType === "notification" && !isHealthResultForOther && !isVaccineResultForOther;
        case TABS.RESULT_HEALTH:
          return item.itemType === "notification" && item.notificationType === NOTIFICATION_TYPES.HEALTH_RESULT;
        case TABS.RESULT_VACCINE:
          return item.itemType === "notification" && item.notificationType === NOTIFICATION_TYPES.VACCINE_RESULT;
        case TABS.REPLIED:
          return item.itemType === "consent" && isConsentResponded(item.status);
        default: return true;
      }
    });

    // Secondary sorting: prioritize items that require action
    const needsAction = filteredByTab
      .filter(item => item.itemType === "consent" && !isConsentResponded(item.status))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const others = filteredByTab
      .filter(item => !(item.itemType === "consent" && !isConsentResponded(item.status)))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    return [...needsAction, ...others];
  }, [allItems, activeTab, isConsentResponded, selectedStudentId]);

  // Effects
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    // Fetch all parent data once, after the parentId is available.
    if (parentId) {
      fetchDataForParent();
    }
  }, [parentId, fetchDataForParent]);

  // Render functions
  const renderItemCard = (item) => {
    const isConsent = item.itemType === 'consent';
    const responded = isConsent && isConsentResponded(item.status);
    const isSubmitting = submittingId === item.requestId;

    let icon, tag, tagStyle, iconStyle;
    if (isConsent) {
      icon = <FiClipboard />;
      tag = 'Phiếu đồng ý';
      tagStyle = styles.tagConsent;
      iconStyle = styles.iconVaccine;
    } else if (item.notificationType === NOTIFICATION_TYPES.HEALTH_RESULT || item.notificationType === NOTIFICATION_TYPES.VACCINE_RESULT) {
      icon = <FiCheckCircle />;
      tag = 'Kết quả';
      tagStyle = styles.tagResult;
      iconStyle = styles.iconHealth;
    } else {
      icon = <FiBell />;
      tag = 'Thông báo chung';
      tagStyle = styles.tagGeneral;
      iconStyle = styles.iconGeneral;
    }

    const requiresAction = isConsent && !responded;

    return (
      <div 
        className={`${styles.notificationCard} ${requiresAction ? styles.cardRequiresAction : ''}`} 
        key={item.id} // Use the new unified ID
      >
        <div className={`${styles.cardIcon} ${iconStyle}`}>{icon}</div>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3>{item.title}</h3>
            <span className={`${styles.cardTag} ${tagStyle}`}>{tag}</span>
          </div>
          <div className={styles.cardBody}>
            {item.studentName && <p><strong>Học sinh:</strong> {item.studentName}</p>}
            <p>{item.message}</p>
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardDate}>
              {new Date(item.date).toLocaleString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className={styles.cardActions}>
              {isConsent && !responded && (
                <>
                  <button className={`${styles.actionButton} ${styles.approveButton}`} onClick={() => handleConsent(true, item)} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : '✅ Đồng ý'}
                  </button>
                  <button className={`${styles.actionButton} ${styles.declineButton}`} onClick={() => openDeclineModal(item)} disabled={isSubmitting}>
                    ❌ Từ chối
                  </button>
                </>
              )}
              {responded && (
                <span className={`${styles.respondedTag} ${item.status === 'Đồng ý' ? styles.tagApproved : styles.tagDeclined}`}>
                  {item.status === 'Đồng ý' ? '✅ Đã đồng ý' : `❌ Đã từ chối`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.pageWrapper}>
          <div className={styles.emptyStateContainer}>
            <div className={styles.emptyStateIcon}>
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#20b2aa" strokeWidth="1.5">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className={styles.emptyStateHeading}>Chưa có liên kết học sinh</h2>
            <p className={styles.emptyStateText}>{ERROR_MESSAGES.NO_STUDENTS_LINKED}</p>
            <div className={styles.emptyStateGuide}>
              <h3>Các bước để nhận thông báo:</h3>
              <div className={styles.emptyStateStep}><span className={styles.stepNumber}>1</span><span className={styles.stepText}>Liên hệ với nhà trường qua số điện thoại hoặc email</span></div>
              <div className={styles.emptyStateStep}><span className={styles.stepNumber}>2</span><span className={styles.stepText}>Cung cấp thông tin cá nhân và thông tin con em</span></div>
              <div className={styles.emptyStateStep}><span className={styles.stepNumber}>3</span><span className={styles.stepText}>Đợi nhà trường xác nhận và liên kết tài khoản</span></div>
            </div>
            <div className={styles.emptyStateFooter}><p>💡 Sau khi liên kết, bạn sẽ nhận được thông báo và có thể phản hồi tại đây.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Main render logic
  const filteredItems = getFilteredItems();

  if (loading && students.length === 0) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}><p>Đang tải dữ liệu...</p></div>
      </div>
    );
  }

  if (students.length === 0) {
    return renderEmptyState();
  }
  
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.pageWrapper}>
          <div className={styles.header}>
            <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
            <p className={styles.subtitle}>
              Quản lý tất cả thông báo, kết quả và phiếu đồng ý từ nhà trường.
            </p>
          </div>

          <div className={styles.layoutGrid}>
            <div className={styles.mainContent}>
              {loading ? <p>Đang tải dữ liệu cho {getSelectedStudentName()}...</p> : (
                filteredItems.length === 0 ? (
                  <div className={styles.emptyStateMessage}>
                    <FiInbox size={48} style={{ marginBottom: '16px', color: '#94a3b8' }}/>
                    <h4>Không có gì ở đây cả!</h4>
                    <p>Hiện không có thông báo hay phiếu điền nào trong mục này.</p>
                  </div>
                ) : (
                  filteredItems.map(renderItemCard)
                )
              )}
            </div>

            <div className={styles.rightSidebar}>
              <div className={styles.filterCard}>
                <h3>Chọn học sinh</h3>
                <div className={styles.studentSelector}>
                  <select value={selectedStudentId || ""} onChange={handleStudentChange} disabled={students.length <= 1}>
                    {students.map(student => (
                      <option key={student.studentId} value={student.studentId}>
                        {student.fullName} - {student.className}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3>Lọc theo loại</h3>
                <div className={styles.tabList}>
                  <button className={`${styles.tabButton} ${activeTab === TABS.ALL ? styles.active : ""}`} onClick={() => handleTabChange(TABS.ALL)}>
                    <FiAlertTriangle /> Tất cả thông báo
                  </button>
                  <button className={`${styles.tabButton} ${activeTab === TABS.VACCINE ? styles.active : ""}`} onClick={() => handleTabChange(TABS.VACCINE)}>
                    <FiClipboard /> Phiếu đồng ý Vaccine
                  </button>
                  <button className={`${styles.tabButton} ${activeTab === TABS.OTHER ? styles.active : ""}`} onClick={() => handleTabChange(TABS.OTHER)}>
                    <FiBell /> Thông báo khác
                  </button>
                  <button className={`${styles.tabButton} ${activeTab === TABS.RESULT_HEALTH ? styles.active : ""}`} onClick={() => handleTabChange(TABS.RESULT_HEALTH)}>
                    <FiCheckCircle/> Kết quả khám sức khỏe
                  </button>
                   <button className={`${styles.tabButton} ${activeTab === TABS.RESULT_VACCINE ? styles.active : ""}`} onClick={() => handleTabChange(TABS.RESULT_VACCINE)}>
                    <FiCheckCircle /> Kết quả tiêm chủng
                  </button>
                  <button className={`${styles.tabButton} ${activeTab === TABS.REPLIED ? styles.active : ""}`} onClick={() => handleTabChange(TABS.REPLIED)}>
                    <FiArchive /> Lịch sử phản hồi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeclineModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Lý do từ chối</h3>
              <p>Vui lòng cung cấp lý do từ chối cho phiếu đồng ý của <strong>{currentConsentItem?.title}</strong>.</p>
              <textarea
                placeholder="Ví dụ: Cháu vừa bị ốm, gia đình sẽ cho cháu tiêm sau..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <div className={styles.modalActions}>
                <button className={`${styles.actionButton}`} onClick={closeDeclineModal} style={{background: '#f1f5f9', color: '#475569'}}>Hủy</button>
                <button
                  className={`${styles.actionButton} ${styles.declineButton}`}
                  onClick={() => handleConsent(false, currentConsentItem)}
                  disabled={!declineReason.trim() || submittingId === currentConsentItem.requestId}
                >
                  {submittingId === currentConsentItem.requestId ? "Đang gửi..." : "Xác nhận từ chối"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationAndReport;

