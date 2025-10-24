import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css"; // Reuse the consistent style
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiHeart, FiShield, FiAlertTriangle, FiInbox, FiSearch } from 'react-icons/fi';

// Constants
const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";
const FILTERS = {
  ALL: "all",
  HEALTH: "health",
  VACCINE: "vaccine",
  EVENT: "event",
};

// Error messages
const ERROR_MESSAGES = {
  FETCH_STUDENTS_FAILED: "Lỗi khi tải danh sách học sinh",
  FETCH_DATA_FAILED: "Đã xảy ra lỗi khi tải dữ liệu",
  NO_STUDENTS_LINKED: "Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ.",
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  HEALTH_SUMMARIES: (studentId) => `${API_BASE_URL}/health-checks/summaries/student/${studentId}`, // REVERTED BACK to the correct endpoint
  VACCINATION_RECORDS: (studentId) => `${API_BASE_URL}/VaccinationCampaign/records/student/${studentId}`,
  MEDICAL_EVENTS: (studentId) => `${API_BASE_URL}/MedicalEvent/student/${studentId}`,
};

const ChildCareHistory = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [healthSummaries, setHealthSummaries] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Get auth data from localStorage
  const parentId = localStorage.getItem("userId");

  // Utility functions
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "Chưa có ngày";
    return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
  }, []);

  const fetchWithErrorHandling = useCallback(async (url, defaultValue = []) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data?.data || defaultValue;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return defaultValue;
      }
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }, []);

  // API calls
  const fetchStudents = useCallback(async () => {
    if (!parentId) return;
    try {
      const studentList = await fetchWithErrorHandling(API_ENDPOINTS.STUDENTS_BY_PARENT(parentId));
      setStudents(studentList);
      if (studentList.length > 0) {
        setSelectedStudentId(studentList[0].studentId);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED);
    }
  }, [parentId, fetchWithErrorHandling]);

  const fetchStudentData = useCallback(async () => {
    if (!selectedStudentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [healthData, vaccineData, eventData] = await Promise.all([
        fetchWithErrorHandling(API_ENDPOINTS.HEALTH_SUMMARIES(selectedStudentId)), // Use the correct, specific endpoint
        fetchWithErrorHandling(API_ENDPOINTS.VACCINATION_RECORDS(selectedStudentId)),
        fetchWithErrorHandling(API_ENDPOINTS.MEDICAL_EVENTS(selectedStudentId)),
      ]);

      setHealthSummaries(Array.isArray(healthData) ? healthData : []);
      setVaccinationHistory(Array.isArray(vaccineData) ? vaccineData : []);
      
      const processedEvents = eventData ? (Array.isArray(eventData) ? eventData : [eventData]) : [];
      setMedicalEvents(processedEvents);

    } catch (err) {
      console.error(ERROR_MESSAGES.FETCH_DATA_FAILED, err);
      setError(ERROR_MESSAGES.FETCH_DATA_FAILED);
      toast.error(ERROR_MESSAGES.FETCH_DATA_FAILED);
    } finally {
      setLoading(false);
    }
  }, [selectedStudentId, fetchWithErrorHandling]);

  // Event handlers
  const handleStudentChange = useCallback((e) => {
    const newStudentId = Number(e.target.value);
    setSelectedStudentId(newStudentId);
    localStorage.setItem("studentId", newStudentId); // Restore saving to localStorage
  }, []);

  // Effects
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (selectedStudentId) {
      fetchStudentData();
    } else if (students.length === 0) {
      setLoading(false);
    }
  }, [selectedStudentId, fetchStudentData, students]);

  // Data processing and filtering
  const combinedAndFilteredItems = useMemo(() => {
    const health = healthSummaries
      .filter(item => {
        if (item && item.recordId !== null && item.recordId !== undefined) { // FIX: Use recordId instead of summaryId
          return true;
        }
        console.warn("Health summary item is missing a 'recordId' and will be filtered out:", item);
        return false;
      })
      .map(item => ({ ...item, type: FILTERS.HEALTH, date: item.checkDate, id: `health-${item.recordId}` })); // FIX: Use recordId for the key

    const vaccine = vaccinationHistory
      .filter(item => {
        if (item && item.recordId !== null && item.recordId !== undefined) {
          return true;
        }
        console.warn("Vaccination history item is missing an ID and will be filtered out:", item);
        return false;
      })
      .map(item => ({ ...item, type: FILTERS.VACCINE, date: item.vaccinationDate, id: `vaccine-${item.recordId}` }));

    const events = medicalEvents
      .filter(item => {
        if (item && item.eventId !== null && item.eventId !== undefined) {
          return true;
        }
        console.warn("Medical event item is missing an ID and will be filtered out:", item);
        return false;
      })
      .map(item => ({ ...item, type: FILTERS.EVENT, date: item.eventDate, id: `event-${item.eventId}` }));

    let allItems = [...health, ...vaccine, ...events];

    // Filter by type
    if (filter !== FILTERS.ALL) {
      allItems = allItems.filter(item => item.type === filter);
    }

    // Filter by search keyword
    const keyword = searchKeyword.toLowerCase().trim();
    if (keyword) {
      allItems = allItems.filter(item => {
        const checkText = (text) => text && text.toLowerCase().includes(keyword);
        const dateText = dayjs(item.date).format("DD/MM/YYYY");

        if (item.type === FILTERS.HEALTH) {
          return checkText(item.campaignTitle) || checkText(item.generalNote) || checkText(item.followUpNote) || dateText.includes(keyword);
        }
        if (item.type === FILTERS.VACCINE) {
          return checkText(item.campaignName) || checkText(item.followUpNote) || checkText(item.result) || dateText.includes(keyword);
        }
        if (item.type === FILTERS.EVENT) {
          return checkText(item.eventType) || checkText(item.description) || checkText(item.notes) || dateText.includes(keyword);
        }
        return false;
      });
    }

    // Sort by date descending
    return allItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [healthSummaries, vaccinationHistory, medicalEvents, filter, searchKeyword]);


  // Render functions
  const renderItemCard = (item) => {
    let icon, tag, tagStyle, iconStyle, title, details;

    switch (item.type) {
      case FILTERS.HEALTH:
        icon = <FiHeart />;
        tag = 'Khám sức khỏe';
        tagStyle = styles.tagResult;
        iconStyle = styles.iconHealth;
        title = item.campaignTitle;
        details = (
          <div className={styles.healthDetailsContainer}>
            <div className={styles.healthSection}>
              <h4 className={styles.sectionTitle}>Chỉ số cơ thể</h4>
              <div className={styles.metricsGrid}>
                <span><strong>Chiều cao:</strong> {item.height} cm</span>
                <span><strong>Cân nặng:</strong> {item.weight} kg</span>
                <span><strong>BMI:</strong> {item.bmi}</span>
                <span><strong>Huyết áp:</strong> {item.bloodPressure}</span>
                <span><strong>Nhịp tim:</strong> {item.heartRate}</span>
              </div>
            </div>
            
            <div className={styles.healthSection}>
              <h4 className={styles.sectionTitle}>Kết quả khám chuyên khoa</h4>
              <div className={styles.specialistGrid}>
                <p><strong>Mắt:</strong> {item.visionSummary}</p>
                <p><strong>Tai-Mũi-Họng:</strong> {item.ent} {item.entNotes && `(${item.entNotes})`}</p>
                <p><strong>Răng-Hàm-Mặt:</strong> {item.mouth}, Sâu răng: {item.toothDecay} {item.toothNotes && `(${item.toothNotes})`}</p>
                <p><strong>Họng:</strong> {item.throat}</p>
              </div>
            </div>

            <div className={styles.healthSection}>
              <h4 className={styles.sectionTitle}>Ghi chú & Dặn dò</h4>
              {item.generalNote && <p><strong>Ghi chú chung:</strong> {item.generalNote}</p>}
              {item.followUpNote && <p><strong>Dặn dò của bác sĩ:</strong> {item.followUpNote}</p>}
            </div>
          </div>
        );
        break;
      case FILTERS.VACCINE:
        icon = <FiShield />;
        tag = 'Tiêm chủng';
        tagStyle = styles.tagConsent;
        iconStyle = styles.iconVaccine;
        title = item.campaignName;
        details = (
          <>
            <p><strong>Kết quả:</strong> {item.result || "Chưa có"}</p>
            <p><strong>Ghi chú:</strong> {item.followUpNote || "Không có"}</p>
          </>
        );
        break;
      case FILTERS.EVENT:
        icon = <FiAlertTriangle />;
        tag = 'Sự cố y tế';
        tagStyle = styles.tagGeneral;
        iconStyle = styles.iconGeneral;
        title = item.eventType;
        details = (
          <>
            <p><strong>Mức độ:</strong> {item.severityLevelName}</p>
            <p><strong>Mô tả:</strong> {item.description}</p>
            <p><strong>Ghi chú của điều dưỡng:</strong> {item.notes}</p>
            <p><strong>Người xử lý:</strong> {item.handledByName}</p>
          </>
        );
        break;
      default:
        return null;
    }

    return (
      <div className={styles.notificationCard} key={item.id}>
        <div className={`${styles.cardIcon} ${iconStyle}`}>{icon}</div>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            <h3>{title}</h3>
            <span className={`${styles.cardTag} ${tagStyle}`}>{tag}</span>
          </div>
          <div className={styles.cardBody}>
            {details}
          </div>
          <div className={styles.cardFooter}>
            <span className={styles.cardDate}>{formatDate(item.date)}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = (message, details) => (
    <div className={styles.emptyStateMessage}>
      <FiInbox size={48} style={{ marginBottom: '16px', color: '#94a3b8' }} />
      <h4>{message}</h4>
      {details && <p>{details}</p>}
    </div>
  );

  // Main render logic
  if (students.length === 0 && !loading) {
    return (
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>
          <div className={styles.pageWrapper}>
            <header className={styles.header}>
              <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
            </header>
            {renderEmptyState("Chưa có liên kết học sinh", ERROR_MESSAGES.NO_STUDENTS_LINKED)}
          </div>
        </main>
      </div>
    );
  }

  const getStudentName = () => {
    const student = students.find(s => s.studentId === selectedStudentId);
    return student?.fullName || "";
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div className={styles.pageWrapper}>
          <header className={styles.header}>
            <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
            {students.length > 0 && (
              <div className={styles.studentSelector}>
                <select id="student-select" value={selectedStudentId} onChange={handleStudentChange}>
                  {students.map(student => (
                    <option key={student.studentId} value={student.studentId}>
                      {student.fullName} - Lớp {student.className}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </header>

          <div className={styles.layoutGrid}>
            <div className={styles.mainContent}>
              <div className={styles.itemList}>
                {loading ? (
                  <p>Đang tải dữ liệu...</p>
                ) : combinedAndFilteredItems.length > 0 ? (
                  combinedAndFilteredItems.map(renderItemCard)
                ) : (
                  renderEmptyState("Không tìm thấy dữ liệu", "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.")
                )}
              </div>
            </div>

            <aside className={styles.rightSidebar}>
              <div className={styles.filterCard}>
                <h3><FiSearch /> Tìm kiếm</h3>
                <div className={styles.searchBox}>
                  <input
                    type="text"
                    placeholder="Tìm theo tên, ghi chú, ngày..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.filterCard}>
                <h3>Lọc theo loại</h3>
                <div className={styles.tabList}>
                  <button className={`${styles.tabButton} ${filter === FILTERS.ALL ? styles.active : ""}`} onClick={() => setFilter(FILTERS.ALL)}>Tất cả</button>
                  <button className={`${styles.tabButton} ${filter === FILTERS.HEALTH ? styles.active : ""}`} onClick={() => setFilter(FILTERS.HEALTH)}>Khám sức khỏe</button>
                  <button className={`${styles.tabButton} ${filter === FILTERS.VACCINE ? styles.active : ""}`} onClick={() => setFilter(FILTERS.VACCINE)}>Tiêm chủng</button>
                  <button className={`${styles.tabButton} ${filter === FILTERS.EVENT ? styles.active : ""}`} onClick={() => setFilter(FILTERS.EVENT)}>Sự cố y tế</button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildCareHistory;
