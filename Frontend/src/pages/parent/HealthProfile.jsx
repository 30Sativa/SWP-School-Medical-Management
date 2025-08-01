import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/Healthprofile.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/Modal";

// Constants
const API_BASE = "/api"; // Sử dụng proxy để tránh lỗi CORS

// Error messages
const ERROR_MESSAGES = {
  NO_TOKEN_OR_PARENT_ID: "Thiếu token hoặc parentId!",
  LOAD_PROFILES_FAILED: "Không thể tải dữ liệu hồ sơ sức khỏe.",
  NO_STUDENTS_LINKED: "Tài khoản của bạn chưa được liên kết với học sinh nào. Vui lòng liên hệ nhà trường để được hỗ trợ liên kết với con em mình.",
  NO_HEALTH_PROFILE: "Học sinh chưa có hồ sơ sức khỏe. Vui lòng tạo hồ sơ sức khỏe cho con em để theo dõi tình trạng sức khỏe tốt hơn.",
  NETWORK_ERROR: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại."
};

// API endpoints
const API_ENDPOINTS = {
  STUDENTS_BY_PARENT: (parentId) => `${API_BASE}/Student/by-parent/${parentId}`,
  HEALTH_PROFILE: (studentId) => `${API_BASE}/health-profiles/student/${studentId}`
};

const HealthProfile = () => {
  const navigate = useNavigate();
  
  // State management
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalStudent, setModalStudent] = useState(null);
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    chronicDiseases: "",
    allergies: "",
    generalNote: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [medicalHistories, setMedicalHistories] = useState([
    { diseaseName: '', note: '', diagnosedDate: '' }
  ]);
  const [medicalHistoryMap, setMedicalHistoryMap] = useState({}); // { studentId: [medicalHistory, ...] }
  const [isInitialized, setIsInitialized] = useState(false); // Prevent multiple calls

  // State for editing health profile
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    height: "",
    weight: "",
    chronicDiseases: "",
    allergies: "",
    generalNote: "",
  });

  // State for adding medical history
  const [isAddHistoryModalOpen, setIsAddHistoryModalOpen] = useState(false);
  const [studentForHistory, setStudentForHistory] = useState(null);
  const [newMedicalHistories, setNewMedicalHistories] = useState([
    { diseaseName: '', note: '', diagnosedDate: '' }
  ]);


  // Get auth data from localStorage
  const token = localStorage.getItem("token");
  const parentId = localStorage.getItem("userId"); // Unified with SendMedicine.jsx

  // Validate authentication on component mount
  useEffect(() => {
    if (!token || !parentId) {
      toast.error("Vui lòng đăng nhập để truy cập trang này!");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    }
  }, [token, parentId, navigate]);

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
  // Sửa fetchProfiles để gọi luôn fetchAllMedicalHistories
  const fetchProfiles = useCallback(async () => {
    if (!parentId || !token) {
      toast.error(ERROR_MESSAGES.NO_TOKEN_OR_PARENT_ID);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setIsInitialized(true);
      
      // 1. Lấy danh sách học sinh
      const studentResponse = await axios.get(
        API_ENDPOINTS.STUDENTS_BY_PARENT(parentId),
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 10000 // 10 seconds timeout
        }
      );

      // Kiểm tra response status và xử lý trường hợp không có học sinh
      if (studentResponse.data.status === "404" || !studentResponse.data.data) {
        setStudentList([]);
        setMedicalHistoryMap({});
        return; // Không hiển thị toast ở đây, sẽ xử lý ở component render
      }

      const students = Array.isArray(studentResponse.data.data) 
        ? studentResponse.data.data 
        : [];
        
      if (students.length === 0) {
        setStudentList([]);
        setMedicalHistoryMap({});
        return; // Không hiển thị toast ở đây, sẽ xử lý ở component render
      }

      // 2. Lấy health profile cho từng học sinh
      const studentDataPromises = students.map(async (student) => {
        try {
          const profileResponse = await axios.get(
            API_ENDPOINTS.HEALTH_PROFILE(student.studentId),
            { 
              headers: { Authorization: `Bearer ${token}` },
              timeout: 10000 // 10 seconds timeout
            }
          );
          return {
            studentInfo: student,
            profile: profileResponse.data.data
          };
        } catch (error) {
          // Chỉ log lỗi trong development và lỗi nghiêm trọng
          if (import.meta.env.DEV) {
            console.error(`Failed to fetch health profile for student ${student.studentId}:`, error);
          }
          return {
            studentInfo: student,
            profile: null
          };
        }
      });
      
      const fetchedData = await Promise.all(studentDataPromises);
      
      // Chỉ set studentList nếu có dữ liệu
      if (fetchedData.length > 0) {
        setStudentList(fetchedData);
      }

      // 3. Lấy medical history cho tất cả học sinh
      // Note: Việc call API nhiều lần là do React StrictMode trong development mode
      // Nó sẽ chỉ chạy 1 lần trong production mode
      const medicalHistoryMap = {};
      await Promise.all(students.map(async (student) => {
        try {
          const res = await axios.get(
            `${API_BASE}/MedicalHistory/student/${student.studentId}`,
            { 
              headers: { Authorization: `Bearer ${token}`, Accept: '*/*' },
              timeout: 10000 // 10 seconds timeout
            }
          );
          
          // Kiểm tra xem response có data không
          let medicalHistory = [];
          if (res.data && res.data.data) {
            // Nếu response có structure { data: [...] }
            medicalHistory = Array.isArray(res.data.data) ? res.data.data : [];
          } else if (Array.isArray(res.data)) {
            // Nếu response trực tiếp là array
            medicalHistory = res.data;
          }
          
          medicalHistoryMap[student.studentId] = medicalHistory;
        } catch (err) {
          // Chỉ log lỗi nghiêm trọng, không log 404 (normal case)
          if (err.response?.status !== 404 && import.meta.env.DEV) {
            console.error(`Error fetching medical history for student ${student.studentId}:`, err);
          }
          medicalHistoryMap[student.studentId] = [];
        }
      }));
      setMedicalHistoryMap(medicalHistoryMap);
      
    } catch (error) {
      console.error("Error fetching profiles:", error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        // Redirect to login page
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
        return;
      } else if (error.response?.status === 404) {
        setStudentList([]);
        setMedicalHistoryMap({});
        return; // Không hiển thị toast error, sẽ hiển thị thông báo thân thiện
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Vui lòng thử lại sau!");
      } else if (!error.response) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        const errorMessage = error.response?.data?.message || ERROR_MESSAGES.LOAD_PROFILES_FAILED;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [parentId, token, navigate]);

  const handleOpenModal = useCallback((student) => {
    setModalStudent(student);
    setFormData({ height: "", weight: "", chronicDiseases: "", allergies: "", generalNote: "" });
    setMedicalHistories([{ diseaseName: '', note: '', diagnosedDate: '' }]);
    setShowModal(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalStudent(null);
    setMedicalHistories([{ diseaseName: '', note: '', diagnosedDate: '' }]);
  }, []);
  
  const handleFormChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);
  
  const handleMedicalHistoryChange = useCallback((idx, e) => {
    const { name, value } = e.target;
    setMedicalHistories((prev) => {
      const arr = [...prev];
      arr[idx][name] = value;
      return arr;
    });
  }, []);
  
  const handleAddMedicalHistory = useCallback(() => {
    setMedicalHistories((prev) => [...prev, { diseaseName: '', note: '', diagnosedDate: '' }]);
  }, []);
  
  const handleRemoveMedicalHistory = useCallback((idx) => {
    setMedicalHistories((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  }, []);
  const handleCreateProfile = useCallback(async (e) => {
    e.preventDefault();
    if (!modalStudent) return;
    setSubmitting(true);
    try {
      // 1. Tạo hồ sơ sức khỏe
      await axios.post(
        `${API_BASE}/health-profiles`,
        {
          studentId: modalStudent.studentId,
          height: Number(formData.height),
          weight: Number(formData.weight),
          chronicDiseases: formData.chronicDiseases,
          allergies: formData.allergies,
          generalNote: formData.generalNote,
          isActive: true,
        },
        { 
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          timeout: 10000 // 10 seconds timeout
        }
      );
      // 2. Tạo medical history nếu có
      const validHistories = medicalHistories.filter(h => h.diseaseName && h.diagnosedDate);
      if (validHistories.length > 0) {
        await Promise.all(validHistories.map(async (h) => {
          await axios.post(
            `${API_BASE}/MedicalHistory`,
            {
              studentId: modalStudent.studentId,
              diseaseName: h.diseaseName,
              note: h.note,
              diagnosedDate: h.diagnosedDate
            },
            { 
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              timeout: 10000 // 10 seconds timeout
            }
          );
        }));
      }
      toast.success("Tạo hồ sơ sức khỏe và tiền sử bệnh thành công!");
      setShowModal(false);
      setModalStudent(null);
      setMedicalHistories([{ diseaseName: '', note: '', diagnosedDate: '' }]);
      // Reload profiles to get updated medical history
      await fetchProfiles();
    } catch (error) {
      console.error("Error creating health profile:", error);
      
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Vui lòng thử lại sau!");
      } else {
        toast.error("Tạo hồ sơ/thêm tiền sử bệnh thất bại! " + (error.response?.data?.message || ""));
      }
    } finally {
      setSubmitting(false);
    }
  }, [modalStudent, formData, medicalHistories, token, fetchProfiles, navigate]);

  // Handlers for adding new medical history
  const handleOpenAddHistoryModal = useCallback((student) => {
    setStudentForHistory(student);
    setNewMedicalHistories([{ diseaseName: '', note: '', diagnosedDate: '' }]);
    setIsAddHistoryModalOpen(true);
  }, []);

  const handleCloseAddHistoryModal = useCallback(() => {
    setIsAddHistoryModalOpen(false);
    setStudentForHistory(null);
  }, []);

  const handleNewMedicalHistoryChange = useCallback((idx, e) => {
    const { name, value } = e.target;
    setNewMedicalHistories((prev) => {
      const arr = [...prev];
      arr[idx][name] = value;
      return arr;
    });
  }, []);

  const handleAddNewMedicalHistoryRow = useCallback(() => {
    setNewMedicalHistories((prev) => [...prev, { diseaseName: '', note: '', diagnosedDate: '' }]);
  }, []);

  const handleRemoveNewMedicalHistoryRow = useCallback((idx) => {
    setNewMedicalHistories((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)));
  }, []);

  const handleAddMedicalHistorySubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!studentForHistory) return;

    setSubmitting(true);
    try {
      const validHistories = newMedicalHistories.filter(h => h.diseaseName && h.diagnosedDate);
      if (validHistories.length > 0) {
        await Promise.all(validHistories.map(async (h) => {
          await axios.post(
            `${API_BASE}/MedicalHistory`,
            {
              studentId: studentForHistory.studentId,
              diseaseName: h.diseaseName,
              note: h.note,
              diagnosedDate: h.diagnosedDate
            },
            { 
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              timeout: 10000
            }
          );
        }));
        toast.success("Thêm tiền sử bệnh thành công!");
        handleCloseAddHistoryModal();
        await fetchProfiles();
      } else {
        toast.warn("Vui lòng nhập đầy đủ thông tin bệnh và ngày chẩn đoán.");
      }
    } catch (error) {
      console.error("Error adding medical history:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Vui lòng thử lại sau!");
      } else {
        toast.error("Thêm tiền sử bệnh thất bại! " + (error.response?.data?.message || ""));
      }
    } finally {
      setSubmitting(false);
    }
  }, [studentForHistory, newMedicalHistories, token, fetchProfiles, navigate, handleCloseAddHistoryModal]);

  // Handlers for updating profile
  const handleUpdateClick = useCallback((profile) => {
    setEditingProfileId(profile.profileId);
    setEditFormData({
      height: profile.height || "",
      weight: profile.weight || "",
      chronicDiseases: profile.chronicDiseases || "",
      allergies: profile.allergies || "",
      generalNote: profile.generalNote || "",
    });
  }, []);

  const handleCancelUpdate = useCallback(() => {
    setEditingProfileId(null);
    setEditFormData({ height: "", weight: "", chronicDiseases: "", allergies: "", generalNote: "" });
  }, []);

  const handleEditFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSaveUpdate = useCallback(async (e, studentId, healthProfileId) => {
    e.preventDefault();
    if (!healthProfileId) {
      toast.error("Không tìm thấy ID hồ sơ sức khỏe.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.put(
        `${API_BASE}/health-profiles/${healthProfileId}`,
        {
          studentId: studentId,
          height: editFormData.height && !isNaN(parseFloat(editFormData.height)) ? parseFloat(editFormData.height) : null,
          weight: editFormData.weight && !isNaN(parseFloat(editFormData.weight)) ? parseFloat(editFormData.weight) : null,
          chronicDiseases: editFormData.chronicDiseases,
          allergies: editFormData.allergies,
          generalNote: editFormData.generalNote,
          isActive: true,
        },
        { 
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          timeout: 10000 
        }
      );
      toast.success("Cập nhật hồ sơ sức khỏe thành công!");
      setEditingProfileId(null);
      await fetchProfiles();
    } catch (error) {
      console.error("Error updating health profile:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        setTimeout(() => {
          localStorage.clear();
          navigate("/login");
        }, 2000);
      } else if (error.code === 'ECONNABORTED') {
        toast.error("Request timeout. Vui lòng thử lại sau!");
      } else if (!error.response) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        toast.error("Cập nhật hồ sơ thất bại! " + (error.response?.data?.message || ""));
      }
    } finally {
      setSubmitting(false);
    }
  }, [editFormData, token, fetchProfiles, navigate]);


  // Effects
  useEffect(() => {
    if (!isInitialized) {
      fetchProfiles();
    }
  }, [fetchProfiles, isInitialized]);

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
              Các bước để liên kết với con em:
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
              💡 Sau khi liên kết thành công, bạn sẽ có thể xem và quản lý hồ sơ sức khỏe của con em tại đây.
            </p>
          </div>
        </div>
      </main>
    </div>
  );

  // Render functions - Memoized to prevent unnecessary re-renders
  const renderPersonalInfo = useCallback((studentInfo, profile) => {
    const studentMedicalHistory = medicalHistoryMap[studentInfo.studentId] || [];
    const isEditing = editingProfileId === profile.profileId;
    
    return (
      <>
        <div className={styles.studentHeader}>
          <h3 className={styles.name}>{studentInfo.fullName}</h3>
          <p className={styles.subInfo}>Lớp: {studentInfo.className}</p>
        </div>
        <h4 className={styles.sectionTitle}>Thông tin hồ sơ sức khỏe</h4>
        <div className={styles.infoBox}>
          {isEditing ? (
            <form onSubmit={(e) => handleSaveUpdate(e, studentInfo.studentId, profile.profileId)}>
              <div className={styles.infoGrid}>
                <div><span className={styles.label}>Họ và tên:</span> {studentInfo.fullName}</div>
                <div><span className={styles.label}>Lớp:</span> {studentInfo.className}</div>
                <div><span className={styles.label}>Giới tính:</span> {studentInfo.gender}</div>
                <div><span className={styles.label}>Tuổi:</span> {calculateAge(studentInfo.dateOfBirth)}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="height" className={styles.label}>Chiều cao:</label>
                  <input type="number" id="height" name="height" value={editFormData.height} onChange={handleEditFormChange} style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }} /> cm
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label htmlFor="weight" className={styles.label}>Cân nặng:</label>
                  <input type="number" id="weight" name="weight" value={editFormData.weight} onChange={handleEditFormChange} style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }} /> kg
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="chronicDiseases" className={styles.label}>Bệnh mãn tính:</label>
                  <input type="text" id="chronicDiseases" name="chronicDiseases" value={editFormData.chronicDiseases} onChange={handleEditFormChange} style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="allergies" className={styles.label}>Dị ứng:</label>
                  <input type="text" id="allergies" name="allergies" value={editFormData.allergies} onChange={handleEditFormChange} style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="generalNote" className={styles.label}>Ghi chú y tế:</label>
                  <input type="text" id="generalNote" name="generalNote" value={editFormData.generalNote} onChange={handleEditFormChange} style={{ width: '100%', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}/>
                </div>
                <div><span className={styles.label}>Trạng thái hồ sơ:</span> Đang hoạt động</div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="submit" disabled={submitting} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#20b2aa', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
                <button type="button" onClick={handleCancelUpdate} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ccc', background: '#f8f8f8', cursor: 'pointer', fontWeight: '600' }}>
                  Hủy
                </button>
              </div>
            </form>
          ) : (
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
              <div style={{ gridColumn: '1 / -1' }}>
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
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button onClick={() => handleUpdateClick(profile)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
              Cập nhật
            </button>
          </div>
        )}

        {/* Medical History Table */}
        <div style={{ marginTop: 24 }}>
          <h4 style={{ color: '#20b2aa', marginBottom: 12, fontSize: 18, fontWeight: 600 }}>Tiền sử bệnh</h4>
          {studentMedicalHistory.length === 0 ? (
            <div style={{ 
              color: '#64748b', 
              fontStyle: 'italic', 
              padding: '16px', 
              background: '#f8fafc', 
              borderRadius: 8,
              border: '1px dashed #cbd5e1'
            }}>
              Không có tiền sử bệnh
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                background: '#fff', 
                borderRadius: 8,
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <thead>
                  <tr style={{ background: '#20b2aa' }}>
                    <th style={{ 
                      padding: '12px 16px', 
                      color: '#fff', 
                      fontWeight: 600,
                      textAlign: 'left',
                      fontSize: 14
                    }}>Tên bệnh</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      color: '#fff', 
                      fontWeight: 600,
                      textAlign: 'left',
                      fontSize: 14
                    }}>Ghi chú</th>
                    <th style={{ 
                      padding: '12px 16px', 
                      color: '#fff', 
                      fontWeight: 600,
                      textAlign: 'left',
                      fontSize: 14
                    }}>Ngày chẩn đoán</th>
                  </tr>
                </thead>
                <tbody>
                  {studentMedicalHistory.map((mh, idx) => (
                    <tr key={mh.historyId || idx} style={{ 
                      borderBottom: '1px solid #e2e8f0',
                      '&:hover': { background: '#f8fafc' }
                    }}>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: 14,
                        fontWeight: 500,
                        color: '#1e293b'
                      }}>{mh.diseaseName || 'Không có thông tin'}</td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: 14,
                        color: '#64748b'
                      }}>{mh.note || 'Không có ghi chú'}</td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: 14,
                        color: '#64748b'
                      }}>
                        {mh.diagnosedDate ? new Date(mh.diagnosedDate).toLocaleDateString('vi-VN') : 'Không có thông tin'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => handleOpenAddHistoryModal(studentInfo)}
              style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: 'white', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14m7-7H5"/>
              </svg>
              Thêm Tiền sử bệnh
            </button>
          </div>
        </div>
      </>
    );
  }, [medicalHistoryMap, calculateAge, safeDisplayValue, editingProfileId, editFormData, handleEditFormChange, handleSaveUpdate, handleCancelUpdate, handleUpdateClick, submitting, handleOpenAddHistoryModal]);

  const renderStudentCard = useCallback(({ studentInfo, profile }) => (
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
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef7cd 100%)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #fbbf24',
          marginTop: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
              </svg>
            </div>
            <div>
              <h4 style={{ color: '#92400e', fontSize: '16px', fontWeight: '600', margin: 0 }}>
                Chưa có hồ sơ sức khỏe
              </h4>
              <p style={{ color: '#b45309', fontSize: '14px', margin: '4px 0 0 0' }}>
                {ERROR_MESSAGES.NO_HEALTH_PROFILE}
              </p>
            </div>
          </div>
          
          <button 
            onClick={() => handleOpenModal(studentInfo)} 
            style={{ 
              background: 'linear-gradient(135deg, #20b2aa 0%, #0ea5e9 100%)',
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(32, 178, 170, 0.3)',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(32, 178, 170, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(32, 178, 170, 0.3)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14m7-7H5"/>
            </svg>
            Tạo hồ sơ sức khỏe cho {studentInfo.fullName}
          </button>
        </div>
      ) : (
        renderPersonalInfo(studentInfo, profile)
      )}
    </div>
  ), [handleOpenModal, renderPersonalInfo]);

  // Main render
  if (loading) return renderLoadingState();
  if (studentList.length === 0) return renderEmptyState();

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        {studentList.map(renderStudentCard)}
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} title={`Tạo hồ sơ sức khỏe cho ${modalStudent?.fullName || ''}`}>
          <form onSubmit={handleCreateProfile} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 16, minWidth: 350 }}>
            {/* Health Profile fields */}
            <label style={{ color: '#20b2aa', fontWeight: 600, marginBottom: 4 }}>
              Chiều cao (cm):
              <input name="height" type="number" min="0" value={formData.height} onChange={handleFormChange} required
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#20b2aa', fontWeight: 600, marginBottom: 4 }}>
              Cân nặng (kg):
              <input name="weight" type="number" min="0" value={formData.weight} onChange={handleFormChange} required
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0284c7', fontWeight: 500, marginBottom: 4 }}>
              Bệnh mãn tính:
              <input name="chronicDiseases" value={formData.chronicDiseases} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0284c7', fontWeight: 500, marginBottom: 4 }}>
              Dị ứng:
              <input name="allergies" value={formData.allergies} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0284c7', fontWeight: 500, marginBottom: 4 }}>
              Ghi chú y tế:
              <input name="generalNote" value={formData.generalNote} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            {/* Medical History section */}
            <div style={{ margin: '18px 0 0 0', padding: '12px', background: '#e0f7fa', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: '#20b2aa', marginBottom: 8, fontSize: 17 }}>Tiền sử bệnh</div>
              {medicalHistories.map((mh, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <input
                    name="diseaseName"
                    placeholder="Tên bệnh *"
                    value={mh.diseaseName}
                    onChange={e => handleMedicalHistoryChange(idx, e)}
                    required
                    style={{ flex: 2, minWidth: 120, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <input
                    name="note"
                    placeholder="Ghi chú"
                    value={mh.note}
                    onChange={e => handleMedicalHistoryChange(idx, e)}
                    style={{ flex: 2, minWidth: 100, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <input
                    name="diagnosedDate"
                    type="date"
                    value={mh.diagnosedDate}
                    onChange={e => handleMedicalHistoryChange(idx, e)}
                    required
                    style={{ flex: 1, minWidth: 120, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <button type="button" onClick={() => handleRemoveMedicalHistory(idx)} style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }} disabled={medicalHistories.length === 1}>-</button>
                  {idx === medicalHistories.length - 1 && (
                    <button type="button" onClick={handleAddMedicalHistory} style={{ background: '#22d3ee', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                  )}
                </div>
              ))}
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>* Có thể thêm nhiều bệnh, tên bệnh và ngày chẩn đoán là bắt buộc</div>
            </div>
            <button type="submit" disabled={submitting}
              style={{ marginTop: 10, background: submitting ? '#a7f3d0' : '#10b981', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
              {submitting ? "Đang tạo..." : "Tạo hồ sơ"}
            </button>
          </form>
        </Modal>
      )}

      {/* New Modal for Adding Medical History */}
      {isAddHistoryModalOpen && (
        <Modal isOpen={isAddHistoryModalOpen} onClose={handleCloseAddHistoryModal} title={`Thêm tiền sử bệnh cho ${studentForHistory?.fullName || ''}`}>
          <form onSubmit={handleAddMedicalHistorySubmit} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 16, minWidth: 450 }}>
            <div style={{ padding: '12px', background: '#e0f7fa', borderRadius: 8 }}>
              {newMedicalHistories.map((mh, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
                  <input
                    name="diseaseName"
                    placeholder="Tên bệnh *"
                    value={mh.diseaseName}
                    onChange={e => handleNewMedicalHistoryChange(idx, e)}
                    required
                    style={{ flex: 2, minWidth: 120, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <input
                    name="note"
                    placeholder="Ghi chú"
                    value={mh.note}
                    onChange={e => handleNewMedicalHistoryChange(idx, e)}
                    style={{ flex: 2, minWidth: 100, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <input
                    name="diagnosedDate"
                    type="date"
                    value={mh.diagnosedDate}
                    onChange={e => handleNewMedicalHistoryChange(idx, e)}
                    required
                    style={{ flex: 1, minWidth: 120, padding: '8px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
                  />
                  <button type="button" onClick={() => handleRemoveNewMedicalHistoryRow(idx)} style={{ background: '#f87171', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }} disabled={newMedicalHistories.length === 1}>-</button>
                  {idx === newMedicalHistories.length - 1 && (
                    <button type="button" onClick={handleAddNewMedicalHistoryRow} style={{ background: '#22d3ee', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                  )}
                </div>
              ))}
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>* Có thể thêm nhiều bệnh, tên bệnh và ngày chẩn đoán là bắt buộc</div>
            </div>
            <button type="submit" disabled={submitting}
              style={{ marginTop: 10, background: submitting ? '#a7f3d0' : '#10b981', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
              {submitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HealthProfile;



