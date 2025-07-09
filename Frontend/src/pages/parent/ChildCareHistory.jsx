import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/ChildCareHistory.module.css";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";

// Error messages
const ERROR_MESSAGES = {
  FETCH_STUDENTS_FAILED: "Lỗi khi tải danh sách học sinh",
  FETCH_DATA_FAILED: "Đã xảy ra lỗi khi tải dữ liệu",
  NO_STUDENTS_LINKED: "Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ liên kết với con em mình."
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  HEALTH_SUMMARIES: `${API_BASE_URL}/health-checks/summaries`,
  VACCINATION_RECORDS: (studentId) => `${API_BASE_URL}/VaccinationCampaign/records/student/${studentId}`,
  MEDICAL_EVENTS: (studentId) => `${API_BASE_URL}/MedicalEvent/student/${studentId}`,
  STUDENT_DETAILS: (studentId) => `${API_BASE_URL}/Student/${studentId}`
};

const ChildCareHistory = () => {
  // State management
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [healthSummaries, setHealthSummaries] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalVaccinesThisMonth, setTotalVaccinesThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get auth data from localStorage
  const parentId = localStorage.getItem("userId");

  // Utility functions
  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD/MM/YYYY");
  }, []);

  const matchesSearch = useCallback((text, dateStr, extra = "") => {
    const keyword = searchKeyword.toLowerCase().trim();
    if (!keyword) return true;

    const formattedDate = dayjs(dateStr).format("DD/MM/YYYY");
    return (
      (text && text.toLowerCase().includes(keyword)) ||
      formattedDate.includes(keyword) ||
      (extra && extra.toLowerCase().includes(keyword))
    );
  }, [searchKeyword]);

  const calculateVaccineStats = useCallback((vaccinationData) => {
    const currentMonth = dayjs().month() + 1;
    const currentYear = dayjs().year();

    const vaccineCount = vaccinationData?.filter(item => {
      const date = dayjs(item.vaccinationDate);
      return date.month() + 1 === currentMonth && date.year() === currentYear;
    }).length || 0;

    setTotalVaccinesThisMonth(vaccineCount);
  }, []);

  // API calls with error handling
  const fetchWithErrorHandling = useCallback(async (url, defaultValue = []) => {
    try {
      const response = await axios.get(url);
      return response.data?.data || defaultValue;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn(`404 Error for ${url} - returning default value`);
        return defaultValue;
      }
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!parentId) {
      console.error("No parentId found");
      setStudents([]);
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching students for parent ID: ${parentId}`);
      const studentList = await fetchWithErrorHandling(
        API_ENDPOINTS.STUDENTS_BY_PARENT(parentId),
        []
      );

      setStudents(studentList);

      if (studentList.length > 0) {
        const defaultId = studentList[0].studentId;
        setSelectedStudentId(defaultId);
        localStorage.setItem("studentId", defaultId);
        console.log(`Selected default student: ${studentList[0].fullName} (ID: ${defaultId})`);
      } else {
        localStorage.removeItem("studentId");
        console.warn("No students found for this parent");
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED, error);
      toast.error(ERROR_MESSAGES.FETCH_STUDENTS_FAILED);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [parentId, fetchWithErrorHandling]);

  const fetchStudentData = useCallback(async () => {
    if (!selectedStudentId) {
      console.warn("No student selected");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log(`Fetching data for student ID: ${selectedStudentId}`);

      const [
        healthSummariesData,
        vaccinationData,
        medicalEventsData,
        studentResponse
      ] = await Promise.all([
        fetchWithErrorHandling(API_ENDPOINTS.HEALTH_SUMMARIES),
        fetchWithErrorHandling(API_ENDPOINTS.VACCINATION_RECORDS(selectedStudentId)),
        fetchWithErrorHandling(API_ENDPOINTS.MEDICAL_EVENTS(selectedStudentId)),
        fetchWithErrorHandling(API_ENDPOINTS.STUDENT_DETAILS(selectedStudentId))
      ]);

      // Filter health summaries for the selected student
      const filteredHealthSummaries = Array.isArray(healthSummariesData) 
        ? healthSummariesData.filter(summary => summary.studentId === selectedStudentId)
        : [];

      // Set data with proper validation
      setHealthSummaries(filteredHealthSummaries);
      setVaccinationHistory(Array.isArray(vaccinationData) ? vaccinationData : []);
      setMedicalEvents(Array.isArray(medicalEventsData) ? medicalEventsData : []);
      setStudentName(studentResponse?.fullName || "");

      // Calculate statistics
      calculateVaccineStats(vaccinationData);

      console.log(`Successfully loaded data for ${studentResponse?.fullName || 'student'}`);
      console.log(`Health summaries: ${filteredHealthSummaries?.length || 0} records`);
      console.log(`Vaccination history: ${vaccinationData?.length || 0} records`);
      console.log(`Medical events: ${medicalEventsData?.length || 0} records`);

    } catch (error) {
      console.error(ERROR_MESSAGES.FETCH_DATA_FAILED, error);
      setError(ERROR_MESSAGES.FETCH_DATA_FAILED);
      toast.error(ERROR_MESSAGES.FETCH_DATA_FAILED);
    } finally {
      setLoading(false);
    }
  }, [selectedStudentId, fetchWithErrorHandling, calculateVaccineStats]);

  // Event handlers
  const handleStudentChange = useCallback((e) => {
    const selected = Number(e.target.value);
    localStorage.setItem("studentId", selected);
    setSelectedStudentId(selected);
    console.log(`Student changed to ID: ${selected}`);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchKeyword(e.target.value);
  }, []);

  // Effects
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Filter functions
  const getFilteredHealthSummaries = useCallback(() => {
    return healthSummaries.filter(item =>
      matchesSearch(item.campaignTitle, item.checkDate, item.generalNote)
    );
  }, [healthSummaries, matchesSearch]);

  const getFilteredVaccinationHistory = useCallback(() => {
    return vaccinationHistory.filter(item =>
      matchesSearch(item.campaignName, item.vaccinationDate, item.followUpNote)
    );
  }, [vaccinationHistory, matchesSearch]);

  const getFilteredMedicalEvents = useCallback(() => {
    return medicalEvents.filter(item =>
      matchesSearch(item.eventType, item.eventDate)
    );
  }, [medicalEvents, matchesSearch]);

  // Render functions
  const renderEmptyState = () => (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
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
              Các bước để xem lịch sử chăm sóc:
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
              💡 Sau khi liên kết thành công, bạn sẽ có thể theo dõi lịch sử chăm sóc sức khỏe của con em tại đây.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
        <p>Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  const renderStudentSelector = () => (
    <>
      <label style={{ 
        color: '#059669', 
        fontWeight: 'bold', 
        marginBottom: '8px', 
        display: 'inline-block' 
      }}>
        Chọn học sinh:
      </label>
      <select
        value={selectedStudentId || ""}
        onChange={handleStudentChange}
        style={{
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #3b82f6",
          fontSize: "15px",
          outline: "none",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "400px"
        }}
      >
        {students.map((student) => (
          <option key={student.studentId} value={student.studentId}>
            {student.fullName} - Lớp {student.className}
          </option>
        ))}
      </select>
    </>
  );

  const renderSearchBox = () => (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="🔍 Tìm kiếm theo chiến dịch khám, ngày khám, ghi chú hoặc theo dõi..."
        value={searchKeyword}
        onChange={handleSearchChange}
        style={{
          padding: "10px 16px",
          width: "100%",
          maxWidth: "500px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "15px",
          outline: "none",
        }}
      />
    </div>
  );

  const renderStatistics = () => (
    <div style={{ marginBottom: "30px", fontSize: "16px" }}>
      🧮 <strong>Thống kê tháng này:</strong> {totalVaccinesThisMonth} lần tiêm
    </div>
  );

  const renderHealthSummariesSection = () => {
    const filteredData = getFilteredHealthSummaries();
    
    return (
      <div className={styles.section}>
        <h3>🩺 Lịch Sử Khám Sức Khỏe Định Kỳ</h3>
        {filteredData.length === 0 ? (
          <p>Không có kết quả khám sức khỏe phù hợp.</p>
        ) : (
          filteredData.map((item) => (
            <div className={styles.historyCard} key={item.summaryId}>
              <h4>{item.campaignTitle}</h4>
              <p><strong>Ngày khám:</strong> {formatDate(item.checkDate)}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px", margin: "10px 0" }}>
                <p><strong>Chiều cao:</strong> {item.height} cm</p>
                <p><strong>Cân nặng:</strong> {item.weight} kg</p>
                <p><strong>Huyết áp:</strong> {item.bloodPressure}</p>
                <p><strong>Thị lực:</strong> {item.visionSummary}</p>
                <p><strong>Tai mũi họng:</strong> {item.ent}</p>
              </div>
              {item.generalNote && (
                <p><strong>Ghi chú:</strong> {item.generalNote}</p>
              )}
              {item.followUpNote && (
                <p><strong>Theo dõi:</strong> {item.followUpNote}</p>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderVaccinationHistorySection = () => {
    const filteredData = getFilteredVaccinationHistory();
    
    return (
      <div className={styles.section}>
        <h3>💉 Lịch Sử Tiêm Chủng</h3>
        {filteredData.length === 0 ? (
          <p>Không có lịch sử tiêm chủng phù hợp.</p>
        ) : (
          filteredData.map((item) => (
            <div className={styles.historyCard} key={item.recordId}>
              <p><strong>Chiến dịch:</strong> {item.campaignName}</p>
              <p><strong>Ngày tiêm:</strong> {formatDate(item.vaccinationDate)}</p>
              <p><strong>Kết quả:</strong> {item.result || "Chưa có kết quả"}</p>
              <p><strong>Theo dõi sau tiêm:</strong> {item.followUpNote || "Không có ghi chú"}</p>
            </div>
          ))
        )}
      </div>
    );
  };

  const renderMedicalEventsSection = () => {
    const filteredData = getFilteredMedicalEvents();
    
    return (
      <div className={styles.section}>
        <h3>🚨 Sự Kiện Y Tế</h3>
        {filteredData.length === 0 ? (
          <p>Không có sự kiện y tế phù hợp.</p>
        ) : (
          filteredData.map((item) => (
            <div className={styles.historyCard} key={item.eventId}>
              <h4>{item.eventType}</h4>
              <p><strong>Mức độ:</strong> {item.severityLevelName || "Không xác định"}</p>
              <p><strong>Ngày:</strong> {formatDate(item.eventDate)}</p>
              <p><strong>Ghi chú:</strong> {item.description || "Không có mô tả"}</p>
              <p><strong>Điều dưỡng phụ trách:</strong> {item.nurseName || "Chưa xác định"}</p>
            </div>
          ))
        )}
      </div>
    );
  };

  // Main render logic
  if (students.length === 0 && !loading) {
    return renderEmptyState();
  }

  if (loading) {
    return renderLoadingState();
  }

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
        <p className={styles.subtitle}>
          Xin chào, bạn đang đăng nhập với tư cách phụ huynh em{" "}
          <strong>{studentName || "..."}</strong>
        </p>

        {renderStudentSelector()}
        {renderSearchBox()}
        {renderStatistics()}

        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            {renderHealthSummariesSection()}
            {renderVaccinationHistorySection()}
            {renderMedicalEventsSection()}
          </>
        )}
      </div>
    </div>
  );
};

export default ChildCareHistory;
