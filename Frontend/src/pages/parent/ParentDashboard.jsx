import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/parentDashboard.module.css";
import Notification from "../../components/Notification";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";

const ERROR_MESSAGES = {
  FETCH_DATA_FAILED: "❌ Lỗi khi tải dữ liệu",
  FEEDBACK_EMPTY: "❌ Nội dung không được để trống",
  FEEDBACK_SEND_FAILED: "🚫 Gửi góp ý thất bại",
  NO_STUDENTS_LINKED: "Tài khoản chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ!"
};

const SUCCESS_MESSAGES = {
  FEEDBACK_SENT: "Gửi góp ý thành công!"
};

const API_ENDPOINTS = {
  OVERVIEW: `${API_BASE_URL}/Dashboard/overview`,
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  PARENT_FEEDBACK: `${API_BASE_URL}/ParentFeedback`
};

const REQUEST_TIMEOUT = 10000;

const ParentDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [healthNotifications, setHealthNotifications] = useState([]);

  const parentId = localStorage.getItem("userId");

  const formatDateTime = useCallback((dateString, format = "DD/MM/YYYY") => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format(format);
  }, []);

  const myStudentNames = useMemo(() => {
    return myStudents.map(student => student.fullName);
  }, [myStudents]);

  const isMyStudent = useCallback((studentName) => {
    return myStudentNames.includes(studentName);
  }, [myStudentNames]);

  const myMedicationRequests = useMemo(() => {
    if (!overview?.recentMedicationRequests) return [];
    return overview.recentMedicationRequests.filter(item => isMyStudent(item.studentName));
  }, [overview?.recentMedicationRequests, isMyStudent]);

  const myMedicalEvents = useMemo(() => {
    if (!overview?.recentMedicalEvents) return [];
    return overview.recentMedicalEvents.filter(event => isMyStudent(event.studentName));
  }, [overview?.recentMedicalEvents, isMyStudent]);

  const fetchOverview = useCallback(async () => {
    const startTime = Date.now();
    try {
      console.log("🔄 Fetching dashboard overview...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await axios.get(API_ENDPOINTS.OVERVIEW, {
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT
      });

      clearTimeout(timeoutId);
      const overviewData = response.data.data;

      setOverview(overviewData);
      const loadTime = Date.now() - startTime;
      console.log(`✅ Overview loaded in ${loadTime}ms`);
      console.log(`📊 Data: ${overviewData?.recentMedicationRequests?.length || 0} medications, ${overviewData?.recentMedicalEvents?.length || 0} events`);

      return overviewData;
    } catch (error) {
      const loadTime = Date.now() - startTime;
      if (error.name === 'AbortError') {
        console.error(`⏰ Overview request timeout after ${loadTime}ms`);
        throw new Error("Yêu cầu quá thời gian chờ. Vui lòng thử lại.");
      }
      console.error(`❌ Overview failed after ${loadTime}ms:`, error);
      throw error;
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!parentId) {
      console.error("❌ No parentId found");
      throw new Error("Không tìm thấy thông tin phụ huynh");
    }

    const startTime = Date.now();
    try {
      console.log(`🔄 Fetching students for parent: ${parentId}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

      const response = await axios.get(API_ENDPOINTS.STUDENTS_BY_PARENT(parentId), {
        signal: controller.signal,
        timeout: REQUEST_TIMEOUT
      });

      clearTimeout(timeoutId);
      const studentList = Array.isArray(response.data.data) ? response.data.data : [];

      setMyStudents(studentList);
      const loadTime = Date.now() - startTime;
      console.log(`✅ Students loaded in ${loadTime}ms`);
      console.log(`👨‍👩‍👧‍👦 Found ${studentList.length} students:`, studentList.map(s => s.fullName));

      return studentList;
    } catch (error) {
      const loadTime = Date.now() - startTime;
      if (error.name === 'AbortError') {
        console.error(`⏰ Students request timeout after ${loadTime}ms`);
        throw new Error("Yêu cầu quá thời gian chờ. Vui lòng thử lại.");
      }

      if (error.response && error.response.status === 404) {
        console.warn(`👨‍👩‍👧‍👦 No students linked to parent ${parentId} - returning empty array`);
        setMyStudents([]);
        return [];
      }

      console.error(`❌ Students failed after ${loadTime}ms:`, error);
      setMyStudents([]);
      throw error;
    }
  }, [parentId]);

  const fetchHealthNotifications = useCallback(async () => {
    if (!parentId) return [];
    try {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/Dashboard/parent/${parentId}`
      );
      const notifications = res.data?.data?.recentNotifications || [];
      setHealthNotifications(notifications);
      return notifications;
    } catch (err) {
      setHealthNotifications([]);
      return [];
    }
  }, [parentId]);

  const fetchData = useCallback(async () => {
    const totalStartTime = Date.now();
    try {
      setLoading(true);
      setDataError(null);

      console.log("🚀 Starting parallel data fetch...");

      const results = await Promise.allSettled([
        fetchStudents(),
        fetchOverview(),
        fetchHealthNotifications()
      ]);

      const totalLoadTime = Date.now() - totalStartTime;
      console.log(`⏱️ Total load time: ${totalLoadTime}ms`);

      const studentResult = results[0];
      const overviewResult = results[1];
      const notificationResult = results[2];

      if (studentResult.status === 'rejected') {
        console.error("❌ Students fetch failed:", studentResult.reason);
        setDataError(`Không thể tải danh sách học sinh: ${studentResult.reason.message}`);
      } else if (studentResult.value && studentResult.value.length === 0) {
        console.log("👨‍👩‍👧‍👦 No students linked - this is normal for empty state");
      }

      if (overviewResult.status === 'rejected') {
        console.error("❌ Overview fetch failed:", overviewResult.reason);
        setDataError(prev => prev ?
          `${prev} và dữ liệu tổng quan: ${overviewResult.reason.message}` :
          `Không thể tải dữ liệu tổng quan: ${overviewResult.reason.message}`
        );
      }
      
      if (notificationResult.status === 'rejected') {
        console.error("❌ Notifications fetch failed:", notificationResult.reason);
      }

      if (studentResult.status === 'fulfilled' || overviewResult.status === 'fulfilled') {
        console.log("✅ Dashboard loaded successfully");
      }

    } catch (error) {
      const totalLoadTime = Date.now() - totalStartTime;
      console.error(`❌ Complete dashboard load failed after ${totalLoadTime}ms:`, error);
      setDataError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
      toast.error(ERROR_MESSAGES.FETCH_DATA_FAILED);
    } finally {
      setLoading(false);
    }
  }, [fetchStudents, fetchOverview, fetchHealthNotifications]);

  const handleSubmitFeedback = useCallback(async () => {
    if (!feedbackContent.trim()) {
      toast.error(ERROR_MESSAGES.FEEDBACK_EMPTY);
      return;
    }

    try {
      setFeedbackLoading(true);
      console.log("Submitting feedback...");

      await axios.post(API_ENDPOINTS.PARENT_FEEDBACK, {
        parentId,
        content: feedbackContent,
        createdAt: new Date().toISOString(),
      });

      toast.success(SUCCESS_MESSAGES.FEEDBACK_SENT);
      setFeedbackContent("");
      setShowFeedbackForm(false);
      console.log("Feedback submitted successfully");
    } catch (error) {
      console.error(ERROR_MESSAGES.FEEDBACK_SEND_FAILED, error);
      toast.error(ERROR_MESSAGES.FEEDBACK_SEND_FAILED);
    } finally {
      setFeedbackLoading(false);
    }
  }, [feedbackContent, parentId]);

  const handleShowFeedbackForm = useCallback(() => {
    setShowFeedbackForm(true);
  }, []);

  const handleCloseFeedbackForm = useCallback(() => {
    setShowFeedbackForm(false);
    setFeedbackContent("");
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderLoadingState = () => (
    <div className={styles.loadingOverlay}>
      <div className={styles.customSpinner}>
        <div className={styles.spinnerIcon}></div>
        <div className={styles.spinnerText}>Đang tải dữ liệu...</div>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {dataError ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#fef3c7',
            borderRadius: '12px',
            border: '2px solid #f59e0b',
            margin: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
            <h3 style={{ color: '#d97706', marginBottom: '1rem' }}>Có lỗi xảy ra</h3>
            <p style={{ color: '#92400e', fontSize: '1.1rem', lineHeight: '1.6' }}>
              {dataError}
            </p>
            <button
              onClick={fetchData}
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1.5rem',
                backgroundColor: '#20b2aa',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '40px 20px'
          }}>
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <h2 style={{
              color: '#0284c7',
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              Chưa có liên kết học sinh
            </h2>

            <p style={{
              color: '#64748b',
              fontSize: '16px',
              lineHeight: '1.6',
              maxWidth: '500px',
              marginBottom: '32px'
            }}>
              Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ liên kết với con em mình.
            </p>

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
                Các bước để sử dụng hệ thống:
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
                💡 Sau khi liên kết thành công, bạn sẽ có thể sử dụng đầy đủ các tính năng của hệ thống.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  const renderSummaryCards = () => {
    const pendingMedicationCount = myMedicationRequests.filter(
      (req) => req.status === "Chờ duyệt"
    ).length;

    const summaryData = [
      {
        value: myStudents.length,
        label: "Số con đang học",
        unit: "con",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ),
        color: "blue",
      },
      {
        value: myMedicalEvents.length,
        label: "Sự kiện y tế gần đây",
        unit: "sự kiện",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        ),
        color: "green",
      },
      {
        value: pendingMedicationCount,
        label: "Yêu cầu thuốc",
        unit: "chờ xử lý",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12,2a10,10,0,0,0-10,10,10,10,0,0,0,10,10h0a10,10,0,0,0,10-10,10,10,0,0,0-10-10Z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
        ),
        color: "purple",
      },
    ];

    return (
      <div className={styles.summaryGrid}>
        {summaryData.map((item, index) => (
          <div key={index} className={`${styles.summaryCard} ${styles[item.color]}`}>
            <div className={styles.summaryIcon}>{item.icon}</div>
            <div className={styles.summaryInfo}>
              <span className={styles.summaryValue}>{item.value}</span>
              <span className={styles.summaryLabel}>{item.label}</span>
            </div>
            {item.value > 0 && <span className={styles.summaryUnit}>{item.value} {item.unit}</span>}
          </div>
        ))}
      </div>
    );
  };

  const renderStudentInfo = () => (
    <div className={styles.contentCard}>
      <h3 className={styles.cardTitle}>Thông tin con em</h3>
      <p className={styles.cardSubtitle}>Tổng quan về các con đang học</p>
      <div className={styles.studentList}>
        {myStudents.map((student, index) => (
          <div key={index} className={styles.studentItem}>
            <div className={styles.studentAvatar}>
              <span>{student.fullName?.charAt(0)}</span>
            </div>
            <div className={styles.studentDetails}>
              <strong>{student.fullName}</strong>
              <p>Lớp {student.className} <span>|</span> {formatDateTime(student.dateOfBirth)}</p>
            </div>
            {/* Assumption: student.healthStatus exists. Values: "Tốt", "Bình thường" */}
            <span className={`${styles.statusBadge} ${student.healthStatus === 'Tốt' ? styles.statusGood : styles.statusNormal}`}>
              {student.healthStatus || 'Bình thường'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const getEventVisuals = (eventType) => {
    if (eventType?.toLowerCase().includes("khám")) {
      return { icon: '🩺', status: 'Hoàn thành', color: 'green' };
    }
    if (eventType?.toLowerCase().includes("sốt")) {
      return { icon: '🌡️', status: 'Theo dõi', color: 'orange' };
    }
    if (eventType?.toLowerCase().includes("tiêm") || eventType?.toLowerCase().includes("vaccine")) {
      return { icon: '❤️', status: 'Hoàn thành', color: 'green' };
    }
    if (eventType?.toLowerCase().includes("trầy xước")) {
      return { icon: '🩹', status: 'Đã xử lý', color: 'blue' };
    }
    if (eventType?.toLowerCase().includes("thị lực")) {
      return { icon: '👁️', status: 'Hoàn thành', color: 'green' };
    }
    return { icon: '❤️‍🩹', status: 'Đã xử lý', color: 'blue' };
  };

  const renderMedicalEvents = () => (
    <div className={styles.contentCard}>
      <h3 className={styles.cardTitle}>Sự kiện y tế gần đây</h3>
      <p className={styles.cardSubtitle}>5 sự kiện y tế mới nhất của con em</p>
      <div className={styles.eventList}>
        {myMedicalEvents.slice(0, 5).map((event, index) => {
          const visuals = getEventVisuals(event.eventType);
          return (
            <div key={index} className={styles.eventItem}>
              <div className={`${styles.eventIcon} ${styles[visuals.color]}`}>{visuals.icon}</div>
              <div className={styles.eventDetails}>
                <strong>{event.eventType}</strong>
                <p>{event.studentName}<span>|</span>{event.severity || 'Bình thường'}</p>
                <span>{formatDateTime(event.eventDate, "DD/MM/YYYY - HH:mm")}</span>
              </div>
              <span className={`${styles.statusBadge} ${styles['status' + visuals.status.replace(/\s/g, '')]}`}>
                {visuals.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const getMedicationStatus = (status) => {
    switch (status) {
      case "Đã duyệt": return { text: "Đã duyệt", className: styles.statusApproved };
      case "Chờ duyệt": return { text: "Chờ duyệt", className: styles.statusPending };
      case "Bị từ chối": return { text: "Từ chối", className: styles.statusRejected };
      case "Đã hoàn thành": return { text: "Hoàn thành", className: styles.statusCompleted };
      default: return { text: status, className: styles.statusNormal };
    }
  };

  const renderMedicationRequests = () => (
    <div className={styles.contentCard}>
      <h3 className={styles.cardTitle}>Yêu cầu thuốc</h3>
      <p className={styles.cardSubtitle}>5 yêu cầu thuốc gần đây và trạng thái</p>
      <div className={styles.medicationList}>
        {myMedicationRequests.slice(0, 5).map((req, index) => {
          const status = getMedicationStatus(req.status);
          return (
            <div key={index} className={styles.medicationItem}>
              <div className={styles.medicationIconWrapper}>
                <div className={styles.medicationIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12,2a10,10,0,0,0-10,10,10,10,0,0,0,10,10h0a10,10,0,0,0,10-10,10,10,0,0,0-10-10Z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                </div>
              </div>
              <div className={styles.medicationDetails}>
                <strong>{req.medicationName}</strong>
                <p><strong>{req.studentName}</strong></p>
                <span>{formatDateTime(req.requestDate, "DD/MM/YYYY")}</span>
              </div>
              <span className={`${styles.statusBadge} ${status.className}`}>{status.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const getNotificationVisuals = (notification) => {
    const title = notification.title?.toLowerCase();
    if (title.includes('nghỉ')) {
        return { icon: '⚠️', tag: 'Quan trọng', color: 'red' };
    }
    if (title.includes('họp')) {
        return { icon: 'ℹ️', tag: 'Thông tin', color: 'blue' };
    }
    return { icon: '🔔', tag: 'Thông báo', color: 'gray' };
  };

  const renderSchoolAnnouncements = () => (
      <div className={styles.contentCard}>
          <h3 className={styles.cardTitle}>Thông báo từ trường</h3>
          <p className={styles.cardSubtitle}>3 thông báo quan trọng mới nhất</p>
          <div className={styles.announcementList}>
              {healthNotifications.slice(0, 3).map((noti, index) => {
                  const visuals = getNotificationVisuals(noti);
                  return (
                      <div key={index} className={styles.announcementItem}>
                          <div className={`${styles.announcementIcon} ${styles[visuals.color]}`}>{visuals.icon}</div>
                          <div className={styles.announcementDetails}>
                              <strong>{noti.title}</strong>
                              <p>{noti.message}</p>
                              {/* Assumption: noti.createdAt exists */}
                              <span>{formatDateTime(noti.createdAt, "DD/MM/YYYY - HH:mm")}</span>
                          </div>
                          <span className={`${styles.tagBadge} ${styles['tag' + visuals.tag.replace(/\s/g, '')]}`}>{visuals.tag}</span>
                      </div>
                  );
              })}
          </div>
      </div>
  );

  const renderFeedbackModal = () => {
    if (!showFeedbackForm) return null;

    return (
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
            <button
              onClick={handleSubmitFeedback}
              disabled={feedbackLoading || !feedbackContent.trim()}
            >
              {feedbackLoading ? "Đang gửi..." : "Gửi"}
            </button>
            <button onClick={handleCloseFeedbackForm}>Hủy</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) return renderLoadingState();
  if (myStudents.length === 0) return renderEmptyState();

  const renderHeader = () => (
    <div className={styles.header}>
      <h1 className={styles.headerTitle}>Dashboard</h1>
      <p className={styles.welcomeMessage}>Chào mừng trở lại, phụ huynh của {myStudents[0]?.fullName || 'học sinh'}!</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <div className={styles.contentWrapper}>
          {renderHeader()}
          {renderSummaryCards()}
          <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>
              {renderStudentInfo()}
              {renderMedicationRequests()}
            </div>
            <div className={styles.rightColumn}>
              {renderMedicalEvents()}
              {renderSchoolAnnouncements()}
            </div>
          </div>
        </div>
        {renderFeedbackModal()}
      </main>
    </div>
  );
};

export default ParentDashboard;



