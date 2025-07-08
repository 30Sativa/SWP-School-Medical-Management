import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/Healthprofile.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Constants
const API_BASE_URL = "https://swp-school-medical-management.onrender.com/api";

// Error messages
const ERROR_MESSAGES = {
  NO_TOKEN_OR_PARENT_ID: "Thiếu token hoặc parentId!",
  LOAD_PROFILES_FAILED: "Không thể tải dữ liệu hồ sơ sức khỏe.",
  NO_STUDENTS_LINKED: "Tài khoản chưa có học sinh nào được liên kết.",
  NO_HEALTH_PROFILE: "Tài khoản hiện chưa có hồ sơ sức khỏe nào. Vui lòng liên hệ nhà trường để được hỗ trợ!"
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE_URL}/Student/by-parent/${parentId}`,
  HEALTH_PROFILE: (studentId) => `${API_BASE_URL}/health-profiles/student/${studentId}`
};

const HealthProfile = () => {
  // State management
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get auth data from localStorage
  const token = localStorage.getItem("token");
  const parentId = localStorage.getItem("userId"); // Unified with SendMedicine.jsx

  // Utility functions
  const calculateAge = useCallback((dob) => {
    if (!dob) return 0;
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  // API calls
  const fetchStudentHealthProfile = useCallback(async (studentId) => {
    try {
      const response = await axios.get(
        API_ENDPOINTS.HEALTH_PROFILE(studentId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch health profile for student ${studentId}:`, error);
      return null;
    }
  }, [token]);

  const fetchStudentData = useCallback(async (student) => {
    try {
      console.log(`Fetching data for student: ${student.fullName} (ID: ${student.studentId})`);
      
      const profile = await fetchStudentHealthProfile(student.studentId);

      return {
        studentInfo: student,
        profile
      };
    } catch (error) {
      console.error(`Failed to fetch data for student ${student.studentId}:`, error);
      return {
        studentInfo: student,
        profile: null
      };
    }
  }, [fetchStudentHealthProfile]);

  const fetchProfiles = useCallback(async () => {
    if (!parentId || !token) {
      toast.error(ERROR_MESSAGES.NO_TOKEN_OR_PARENT_ID);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      console.log(`Fetching students for parent ID: ${parentId}`);

      // Fetch students
      const studentResponse = await axios.get(
        API_ENDPOINTS.STUDENTS_BY_PARENT(parentId),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const students = Array.isArray(studentResponse.data.data) 
        ? studentResponse.data.data 
        : [];

      console.log(`Found ${students.length} students`);

      if (students.length === 0) {
        toast.warning(ERROR_MESSAGES.NO_STUDENTS_LINKED);
        setStudentList([]);
        return;
      }

      // Fetch health data for all students
      const studentDataPromises = students.map(fetchStudentData);
      const fetchedData = await Promise.all(studentDataPromises);
      
      console.log(`Successfully fetched data for ${fetchedData.length} students`);
      setStudentList(fetchedData);

    } catch (error) {
      console.error("Error fetching profiles:", error);
      const errorMessage = error.response?.data?.message || ERROR_MESSAGES.LOAD_PROFILES_FAILED;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [parentId, token, fetchStudentData]);

  // Effects
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Helper function to safely display data
  const safeDisplayValue = useCallback((value, defaultValue = "Không có") => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return defaultValue;
    }
    return value;
  }, []);

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
        <p style={{ padding: "20px", color: "#f59e0b" }}>
          ⚠️ {ERROR_MESSAGES.NO_HEALTH_PROFILE}
        </p>
        <ToastContainer />
      </main>
    </div>
  );

  const renderPersonalInfo = (studentInfo, profile) => (
    <>
      <div className={styles.studentHeader}>
        <h3 className={styles.name}>{studentInfo.fullName}</h3>
        <p className={styles.subInfo}>Lớp: {studentInfo.className}</p>
      </div>
      
      <h4 className={styles.sectionTitle}>Thông tin hồ sơ sức khỏe</h4>
      <div className={styles.infoBox}>
        <div className={styles.infoGrid}>
          <div>
            <span className={styles.label}>Họ và tên:</span> {studentInfo.fullName}
          </div>
          <div>
            <span className={styles.label}>Lớp:</span> {studentInfo.className}
          </div>
          <div>
            <span className={styles.label}>Giới tính:</span> {studentInfo.gender}
          </div>
          <div>
            <span className={styles.label}>Tuổi:</span> {calculateAge(studentInfo.dateOfBirth)}
          </div>
          <div>
            <span className={styles.label}>Chiều cao:</span> {
              profile.height > 0 ? `${profile.height} cm` : "Chưa có thông tin"
            }
          </div>
          <div>
            <span className={styles.label}>Cân nặng:</span> {
              profile.weight > 0 ? `${profile.weight} kg` : "Chưa có thông tin"
            }
          </div>
          <div>
            <span className={styles.label}>Bệnh mãn tính:</span> {
              safeDisplayValue(profile.chronicDiseases)
            }
          </div>
          <div>
            <span className={styles.label}>Dị ứng:</span> {
              safeDisplayValue(profile.allergies)
            }
          </div>
          <div>
            <span className={styles.label}>Ghi chú y tế:</span> {
              safeDisplayValue(profile.generalNote)
            }
          </div>
          <div>
            <span className={styles.label}>Trạng thái hồ sơ:</span> {
              profile.isActive ? "Đang hoạt động" : "Ngừng hoạt động"
            }
          </div>
        </div>
      </div>
    </>
  );

  const renderStudentCard = ({ studentInfo, profile }) => (
    <div
      key={`student-${studentInfo.studentId}`}
      className={styles.cardBox}
      style={{
        maxWidth: "1000px",
        margin: "0 auto 40px auto",
        borderRadius: "20px",
        background: "#fff",
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ color: "#0e2a47", marginBottom: "20px" }}>
        Hồ sơ sức khỏe học sinh
      </h2>

      {!profile ? (
        <p style={{ color: "#dc2626", fontWeight: "500" }}>
          ⚠️ Chưa có hồ sơ sức khỏe cho học sinh này.
        </p>
      ) : (
        renderPersonalInfo(studentInfo, profile)
      )}
    </div>
  );

  // Main render
  if (loading) return renderLoadingState();
  if (studentList.length === 0) return renderEmptyState();

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Sidebar />
      <div className={styles.content}>
        {studentList.map(renderStudentCard)}
      </div>
    </div>
  );
};

export default HealthProfile;



