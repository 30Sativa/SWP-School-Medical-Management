import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/Healthprofile.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/Modal";

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

  // Lấy medical history cho tất cả học sinh
  const fetchAllMedicalHistories = useCallback(async (students) => {
    const map = {};
    await Promise.all(students.map(async (student) => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/MedicalHistory/student/${student.studentId}`,
          { headers: { Authorization: `Bearer ${token}`, Accept: '*/*' } }
        );
        map[student.studentId] = Array.isArray(res.data.data) ? res.data.data : [];
      } catch (err) {
        map[student.studentId] = [];
      }
    }));
    setMedicalHistoryMap(map);
    console.log('Fetched all medical histories:', map);
  }, [token]);

  // Sửa fetchProfiles để gọi luôn fetchAllMedicalHistories
  const fetchProfiles = useCallback(async () => {
    if (!parentId || !token) {
      toast.error(ERROR_MESSAGES.NO_TOKEN_OR_PARENT_ID);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const studentResponse = await axios.get(
        API_ENDPOINTS.STUDENTS_BY_PARENT(parentId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const students = Array.isArray(studentResponse.data.data) 
        ? studentResponse.data.data 
        : [];
      if (students.length === 0) {
        toast.warning(ERROR_MESSAGES.NO_STUDENTS_LINKED);
        setStudentList([]);
        setMedicalHistoryMap({});
        return;
      }
      const studentDataPromises = students.map(fetchStudentData);
      const fetchedData = await Promise.all(studentDataPromises);
      setStudentList(fetchedData);
      await fetchAllMedicalHistories(students);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      const errorMessage = error.response?.data?.message || ERROR_MESSAGES.LOAD_PROFILES_FAILED;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [parentId, token, fetchStudentData, fetchAllMedicalHistories]);

  const handleOpenModal = (student) => {
    setModalStudent(student);
    setFormData({ height: "", weight: "", chronicDiseases: "", allergies: "", generalNote: "" });
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setModalStudent(null);
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleMedicalHistoryChange = (idx, e) => {
    const { name, value } = e.target;
    setMedicalHistories((prev) => {
      const arr = [...prev];
      arr[idx][name] = value;
      return arr;
    });
  };
  const handleAddMedicalHistory = () => {
    setMedicalHistories((prev) => [...prev, { diseaseName: '', note: '', diagnosedDate: '' }]);
  };
  const handleRemoveMedicalHistory = (idx) => {
    setMedicalHistories((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  };
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!modalStudent) return;
    setSubmitting(true);
    try {
      // 1. Tạo hồ sơ sức khỏe
      await axios.post(
        `${API_BASE_URL}/health-profiles`,
        {
          studentId: modalStudent.studentId,
          height: Number(formData.height),
          weight: Number(formData.weight),
          chronicDiseases: formData.chronicDiseases,
          allergies: formData.allergies,
          generalNote: formData.generalNote,
          isActive: true,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2. Tạo medical history nếu có
      const validHistories = medicalHistories.filter(h => h.diseaseName && h.diagnosedDate);
      if (validHistories.length > 0) {
        await Promise.all(validHistories.map(async (h) => {
          await axios.post(
            `${API_BASE_URL}/MedicalHistory`,
            {
              studentId: modalStudent.studentId,
              diseaseName: h.diseaseName,
              note: h.note,
              diagnosedDate: h.diagnosedDate
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }));
      }
      toast.success("Tạo hồ sơ sức khỏe và tiền sử bệnh thành công!");
      setShowModal(false);
      setModalStudent(null);
      fetchProfiles();
      setMedicalHistories([{ diseaseName: '', note: '', diagnosedDate: '' }]);
    } catch (error) {
      toast.error("Tạo hồ sơ/thêm tiền sử bệnh thất bại! " + (error.response?.data?.message || ""));
    } finally {
      setSubmitting(false);
    }
  };

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

  const renderPersonalInfo = (studentInfo, profile) => {
    const medicalHistories = medicalHistoryMap[String(studentInfo.studentId)] || [];
    console.log('Medical history for', studentInfo.studentId, medicalHistories);
    return (
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
        {/* Medical History Table */}
        <div style={{ marginTop: 24 }}>
          <h4 style={{ color: '#0e7490', marginBottom: 8 }}>Tiền sử bệnh</h4>
          {medicalHistories.length === 0 ? (
            <div style={{ color: '#64748b', fontStyle: 'italic' }}>Không có tiền sử bệnh</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#f8fafc', borderRadius: 8 }}>
              <thead>
                <tr style={{ background: '#e0f2fe' }}>
                  <th style={{ padding: 8, border: '1px solid #bae6fd' }}>Tên bệnh</th>
                  <th style={{ padding: 8, border: '1px solid #bae6fd' }}>Ghi chú</th>
                  <th style={{ padding: 8, border: '1px solid #bae6fd' }}>Ngày chẩn đoán</th>
                </tr>
              </thead>
              <tbody>
                {medicalHistories.map((mh, idx) => (
                  <tr key={mh.historyId || idx}>
                    <td style={{ padding: 8, border: '1px solid #bae6fd' }}>{mh.diseaseName}</td>
                    <td style={{ padding: 8, border: '1px solid #bae6fd' }}>{mh.note || 'Không ghi chú'}</td>
                    <td style={{ padding: 8, border: '1px solid #bae6fd' }}>{mh.diagnosedDate ? new Date(mh.diagnosedDate).toLocaleDateString() : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  };

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
        <>
          <p style={{ color: "#dc2626", fontWeight: "500" }}>
            ⚠️ Chưa có hồ sơ sức khỏe cho học sinh này.
          </p>
          <button onClick={() => handleOpenModal(studentInfo)} style={{ marginTop: 16, padding: "8px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            Tạo hồ sơ sức khỏe
          </button>
        </>
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
        {/* Debug: render toàn bộ medicalHistoryMap */}
        <div style={{marginTop: 40, background: '#f1f5f9', padding: 16, borderRadius: 8}}>
          <h4>Debug: Toàn bộ medicalHistoryMap</h4>
          {Object.entries(medicalHistoryMap).map(([sid, arr]) => (
            <div key={sid} style={{marginBottom: 12}}>
              <b>studentId: {sid}</b>
              <pre style={{background: '#fff', padding: 8, borderRadius: 4}}>{JSON.stringify(arr, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <Modal isOpen={showModal} onClose={handleCloseModal} title={`Tạo hồ sơ sức khỏe cho ${modalStudent?.fullName || ''}`}>
          <form onSubmit={handleCreateProfile} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 16, minWidth: 350 }}>
            {/* Health Profile fields */}
            <label style={{ color: '#14b8a6', fontWeight: 600, marginBottom: 4 }}>
              Chiều cao (cm):
              <input name="height" type="number" min="0" value={formData.height} onChange={handleFormChange} required
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#14b8a6', fontWeight: 600, marginBottom: 4 }}>
              Cân nặng (kg):
              <input name="weight" type="number" min="0" value={formData.weight} onChange={handleFormChange} required
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0e7490', fontWeight: 500, marginBottom: 4 }}>
              Bệnh mãn tính:
              <input name="chronicDiseases" value={formData.chronicDiseases} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0e7490', fontWeight: 500, marginBottom: 4 }}>
              Dị ứng:
              <input name="allergies" value={formData.allergies} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            <label style={{ color: '#0e7490', fontWeight: 500, marginBottom: 4 }}>
              Ghi chú y tế:
              <input name="generalNote" value={formData.generalNote} onChange={handleFormChange}
                style={{ width: '100%', marginTop: 6, padding: '10px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 16, marginBottom: 2 }}
              />
            </label>
            {/* Medical History section */}
            <div style={{ margin: '18px 0 0 0', padding: '12px', background: '#f0fdfa', borderRadius: 8 }}>
              <div style={{ fontWeight: 700, color: '#0e7490', marginBottom: 8, fontSize: 17 }}>Tiền sử bệnh</div>
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
              style={{ marginTop: 10, background: submitting ? '#a7f3d0' : '#22c55e', color: '#fff', padding: '12px 0', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.08)' }}>
              {submitting ? "Đang tạo..." : "Tạo hồ sơ"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HealthProfile;



