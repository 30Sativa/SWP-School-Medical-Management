import React, { useEffect, useState, useCallback, useMemo } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/parentDashboard.module.css";
import axios from "axios";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
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
      console.error(`❌ Students failed after ${loadTime}ms:`, error);
      throw error;
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
          <p style={{ padding: 20, color: "#ef4444" }}>
            ❌ {dataError}
          </p>
        ) : (
          <p style={{ padding: 20, color: "#f59e0b" }}>
            ⚠️ {ERROR_MESSAGES.NO_STUDENTS_LINKED}
          </p>
        )}
        <ToastContainer />
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
          <h4>Hướng dẫn sử dụng</h4>
          <a href="#">TÌM HIỂU THÊM →</a>
        </div>
        <div className={styles["card-icon"]}>
          <div className={styles["icon-circle"]}>📘</div>
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

  const renderMedicationItem = (item, index) => (
    <div className={styles["health-item"]} key={`medication-${index}`}>
      <div className={styles["health-left"]}>
        <h5>{item.studentName}</h5>
        <p>Thuốc: {item.medicationName}</p>
        <p>Ngày gửi: {formatDateTime(item.requestDate)}</p>
        <span className={`${styles.tag} ${styles.blue}`}>{item.status}</span>
      </div>
    </div>
  );

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
      className={`${styles["reminder-card"]} ${
        SEVERITY_COLORS[event.severity] || styles.yellow
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
  if (!overview || myStudents.length === 0) return renderEmptyState();

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        {renderHeader()}
        {renderActionCards()}
        {renderInfoSection()}
        {renderMainContent()}
        {renderFeedbackModal()}
        <ToastContainer />
      </main>
    </div>
  );
};

export default ParentDashboard;



