import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/parentDashboard.module.css";
import sendMedicineStyles from "../../assets/css/SendMedicine.module.css";
import Notification from "../../components/Notification";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";

// Error messages
const ERROR_MESSAGES = {
  FETCH_DATA_FAILED: "❌ Lỗi khi tải dữ liệu",
  FEEDBACK_EMPTY: "❌ Nội dung không được để trống",
  FEEDBACK_SEND_FAILED: "🚫 Gửi góp ý thất bại",
  NO_STUDENTS_LINKED: "Tài khoản chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ!"
};

// Success messages
const SUCCESS_MESSAGES = {
  FEEDBACK_SENT: "Gửi góp ý thành công!"
};

// API endpoints
const API_ENDPOINTS = {
  OVERVIEW: `${API_BASE_URL}/Dashboard/overview`,
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  PARENT_FEEDBACK: `${API_BASE_URL}/ParentFeedback`
};

// Severity color mapping
const SEVERITY_COLORS = {
  "Nhẹ": styles.green,
  "Trung bình": styles.yellow,
  "Nặng": styles.red
};

// Request timeout
const REQUEST_TIMEOUT = 10000; // 10 seconds

const ParentDashboard = () => {
  // State management
  const [overview, setOverview] = useState(null);
  const [myStudents, setMyStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [healthNotifications, setHealthNotifications] = useState([]);

  // Filter states
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");

  // Get auth data from localStorage
  const parentId = localStorage.getItem("userId");

  // Utility functions
  const formatDateTime = useCallback((dateString) => {
    return dayjs(dateString).format("DD/MM/YYYY HH:mm");
  }, []);

  // Memoized student names for better performance
  const myStudentNames = useMemo(() => {
    return myStudents.map(student => student.fullName);
  }, [myStudents]);

  const isMyStudent = useCallback((studentName) => {
    return myStudentNames.includes(studentName);
  }, [myStudentNames]);

  // Optimized data filtering with useMemo
  const filteredMedications = useMemo(() => {
    if (!overview?.recentMedicationRequests) return [];

    console.log("Filtering medications...");
    return overview.recentMedicationRequests.filter(item => {
      const matchesStudent = isMyStudent(item.studentName);
      const matchesSearch =
        item.medicationName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesStatus = filterStatus === "" || item.status === filterStatus;

      return matchesStudent && matchesSearch && matchesStatus;
    });
  }, [overview?.recentMedicationRequests, isMyStudent, searchKeyword, filterStatus]);

  const filteredEvents = useMemo(() => {
    if (!overview?.recentMedicalEvents) return [];

    console.log("Filtering events...");
    return overview.recentMedicalEvents.filter(event => {
      const matchesStudent = isMyStudent(event.studentName);
      const matchesSearch =
        event.eventType.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        event.studentName.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchesSeverity = filterSeverity === "" || event.severity === filterSeverity;

      return matchesStudent && matchesSearch && matchesSeverity;
    });
  }, [overview?.recentMedicalEvents, isMyStudent, searchKeyword, filterSeverity]);

  // Optimized API calls with timeout and better error handling
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

      // Handle 404 specifically - this means no students linked
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

      // Parallel fetch with individual error handling
      const results = await Promise.allSettled([
        fetchStudents(),
        fetchOverview()
      ]);

      const totalLoadTime = Date.now() - totalStartTime;
      console.log(`⏱️ Total load time: ${totalLoadTime}ms`);

      // Check for errors
      const studentResult = results[0];
      const overviewResult = results[1];

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

      // Show success if at least one succeeded
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
  }, [fetchStudents, fetchOverview]);

  // Event handlers
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

  const handleSearchChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setFilterStatus(e.target.value);
  }, []);

  const handleSeverityFilterChange = useCallback((e) => {
    setFilterSeverity(e.target.value);
  }, []);

  const handleShowFeedbackForm = useCallback(() => {
    setShowFeedbackForm(true);
  }, []);

  const handleCloseFeedbackForm = useCallback(() => {
    setShowFeedbackForm(false);
    setFeedbackContent("");
  }, []);

  // Effects
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchHealthNotifications();
  }, [fetchHealthNotifications]);

  // Render functions
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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
              Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ liên kết với con em mình.
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
                💡 Sau khi liên kết thành công, bạn sẽ có thể sử dụng đầy đủ các tính năng của hệ thống.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  const renderHeader = () => (
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
  );

  const renderActionCards = () => (
    <div className={styles["top-action-row"]}>
      <div className={styles["action-card-v2"]}>
        <div className={styles["card-text"]}>
          <h4>Đóng góp ý kiến</h4>
          <p>Hãy đóng góp ý kiến về cho trường nhé</p>
          <button className={styles["action-button"]} onClick={handleShowFeedbackForm}>ĐÓNG GÓP →</button>
        </div>
        <div className={styles["card-icon"]}>
          <div className={styles["icon-circle"]}>💬</div>
        </div>
      </div>

      <div className={styles["action-card-v2"]}>
        <div className={styles["card-text"]}>
          <h4>Thông báo kiểm tra sức khỏe</h4>
          {healthNotifications.length === 0 ? (
            <p>Không có thông báo mới.</p>
          ) : (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {healthNotifications.slice(0, 2).map((noti, idx) => (
                <li key={noti.notificationId} style={{ fontSize: 14, marginBottom: 4 }}>
                  <strong>{noti.title}:</strong> {noti.message.split('\n')[0]}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles["card-icon"]}>
          <div className={styles["icon-circle"]}>🩺</div>
        </div>
      </div>
    </div>
  );

  const renderInfoSection = () => (
    <div className={styles["info-section"]}>
      <div className={styles["info-header"]}>
        <h3>Thông tin chung</h3>
        <div className={styles["info-tools"]}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm tên học sinh, thuốc, sự kiện"
            value={searchKeyword}
            onChange={handleSearchChange}
          />
          <select value={filterStatus} onChange={handleStatusFilterChange}>
            <option value="">Trạng thái đơn thuốc</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
          </select>
          <select value={filterSeverity} onChange={handleSeverityFilterChange}>
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
          <ul style={{ marginTop: '8px', paddingLeft: '16px', fontSize: '14px', color: '#334155' }}>
            {myStudents.map((s, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {s.fullName} – {s.className}
              </li>
            ))}
          </ul>
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
  );

  const renderMedicationItem = (item, index) => {
    const getStatusClass = (status) => {
      switch (status) {
        case "Đã duyệt":
        case "Đã hoàn thành":
          return sendMedicineStyles.done;
        case "Chờ duyệt":
          return sendMedicineStyles.pending;
        case "Bị từ chối":
          return sendMedicineStyles.reject;
        default:
          return "";
      }
    };

    const getStatusText = (status) => {
      if (status === "Đã hoàn thành") return "Đã lên lịch";
      return status;
    };

    return (
      <div className={styles["health-item"]} key={`medication-${index}`}>
        <div className={styles["health-left"]}>
          <h5>{item.studentName}</h5>
          <p>Thuốc: {item.medicationName}</p>
          <p>Ngày gửi: {formatDateTime(item.requestDate)}</p>
          <span className={`${sendMedicineStyles.status} ${getStatusClass(item.status)}`}>
            {getStatusText(item.status)}
          </span>
        </div>
      </div>
    );
  };

  const renderMedicationsSection = () => (
    <div className={styles["health-check-box"]}>
      <h4>Đơn thuốc gần đây</h4>
      {filteredMedications.length === 0 ? (
        <p>Không có đơn thuốc gần đây.</p>
      ) : (
        filteredMedications.map(renderMedicationItem)
      )}
    </div>
  );

  const renderEventItem = (event, index) => (
    <div
      key={`event-${index}`}
      className={`${styles["reminder-card"]} ${SEVERITY_COLORS[event.severity] || styles.yellow
        }`}
    >
      <div className={styles["reminder-icon"]}>
        <span>⚠️</span>
      </div>
      <div className={styles["reminder-content"]}>
        <strong>{event.studentName}</strong>
        <p>{event.eventType} - {event.severity}</p>
        <p>{formatDateTime(event.eventDate)}</p>
      </div>
    </div>
  );

  const renderEventsSection = () => (
    <div className={`${styles.box} ${styles.reminders}`}>
      <h4>Sự kiện y tế gần đây</h4>
      <div className={styles["reminder-list"]}>
        {filteredEvents.length === 0 ? (
          <p>Không có sự kiện gần đây.</p>
        ) : (
          filteredEvents.map(renderEventItem)
        )}
      </div>
    </div>
  );

  const renderMainContent = () => (
    <div className={styles["main-right-grid"]}>
      {renderMedicationsSection()}
      {renderEventsSection()}
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

  // Main render logic
  if (loading) return renderLoadingState();
  if (myStudents.length === 0) return renderEmptyState();

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {renderHeader()}
        {renderActionCards()}
        {renderInfoSection()}
        {renderMainContent()}
        {renderFeedbackModal()}
      </main>
    </div>
  );
};

export default ParentDashboard;



