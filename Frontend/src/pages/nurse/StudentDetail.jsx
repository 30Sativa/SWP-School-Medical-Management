import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/studentDetail.module.css";
import axios from "axios";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const API_BASE = "https://swp-school-medical-management.onrender.com/api";

// --- Child Component for Basic Info ---
const StudentInfoSection = ({ student, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (student) {
            setFormData({
                fullName: student.fullName || "",
                dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
                class: student.class || "",
                genderName: student.genderName || "",
            });
        }
    }, [student]);

    if (!student) return null;

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data on cancel
        setFormData({
            fullName: student.fullName || "",
            dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
            class: student.class || "",
            genderName: student.genderName || "",
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        let genderId = null;
        if (formData.genderName === 'Nam') genderId = 1;
        else if (formData.genderName === 'Nữ') genderId = 2;

        const payload = {
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            className: formData.class,
            genderId: genderId,
            parentId: student.parentId,
        };

        try {
            await onSave(payload);
            setIsEditing(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={style.section}>
            <div className={style.sectionHeader}>
                <h4 className={style.sectionTitle}>Thông tin cá nhân</h4>
            </div>
            <form onSubmit={handleSave}>
                <div className={style.infoGrid}>
                    {/* Form Fields */}
                    <div>
                        <span className={style.label}>Họ và tên:</span>
                        {isEditing ? <input type="text" name="fullName" value={formData.fullName} onChange={handleFormChange} className={style.inputField} /> : ` ${student.fullName}`}
                    </div>
                    <div>
                        <span className={style.label}>Phụ huynh:</span> {student.parentName}
                    </div>
                    <div>
                        <span className={style.label}>Giới tính:</span>
                        {isEditing ? (
                            <select name="genderName" value={formData.genderName} onChange={handleFormChange} className={style.inputField}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                            </select>
                        ) : ` ${student.genderName}`}
                    </div>
                    <div>
                        <span className={style.label}>Ngày sinh:</span>
                        {isEditing ? <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleFormChange} className={style.inputField} /> : ` ${new Date(student.dateOfBirth).toLocaleDateString('vi-VN')}`}
                    </div>
                    <div>
                        <span className={style.label}>Lớp:</span>
                        {isEditing ? <input type="text" name="class" value={formData.class} onChange={handleFormChange} className={style.inputField} /> : ` ${student.class}`}
                    </div>
                </div>
                {isEditing && (
                    <div className={style.actionRow}>
                        <button type="submit" className={style.saveBtn} disabled={submitting}>Lưu</button>
                        <button type="button" className={style.cancelBtn} onClick={handleCancel}>Hủy</button>
                    </div>
                )}
            </form>
             {!isEditing && (
                <div className={style.actionRow}>
                    <button type="button" className={style.editBtn} onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                </div>
            )}
        </div>
    );
};

// --- Child Component for Health Profile ---
const HealthProfileSection = ({ healthProfile, studentId, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            height: healthProfile?.height || "",
            weight: healthProfile?.weight || "",
            chronicDiseases: healthProfile?.chronicDiseases || "",
            allergies: healthProfile?.allergies || "",
            generalNote: healthProfile?.generalNote || "",
        });
    }, [healthProfile]);

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
             height: healthProfile?.height || "",
            weight: healthProfile?.weight || "",
            chronicDiseases: healthProfile?.chronicDiseases || "",
            allergies: healthProfile?.allergies || "",
            generalNote: healthProfile?.generalNote || "",
        });
    };
    
    const handleSave = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const payload = {
            studentId: studentId,
            height: formData.height ? Number(formData.height) : null,
            weight: formData.weight ? Number(formData.weight) : null,
            chronicDiseases: formData.chronicDiseases,
            allergies: formData.allergies,
            generalNote: formData.generalNote,
            isActive: true,
        };
        try {
            await onSave(payload);
            setIsEditing(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={style.section}>
            <div className={style.sectionHeader}>
                <h4 className={style.sectionTitle}>Thông tin sức khỏe</h4>
            </div>
            {healthProfile ? (
                <form onSubmit={handleSave}>
                    <div className={style.infoGrid}>
                        {/* Form Fields */}
                        <div>
                            <span className={style.label}>Chiều cao:</span>
                            {isEditing ? <><input type="number" name="height" value={formData.height} onChange={handleFormChange} className={style.inputField} /> cm</> : ` ${healthProfile.height || 'N/A'} cm`}
                        </div>
                        <div>
                            <span className={style.label}>Cân nặng:</span>
                            {isEditing ? <><input type="number" name="weight" value={formData.weight} onChange={handleFormChange} className={style.inputField} /> kg</> : ` ${healthProfile.weight || 'N/A'} kg`}
                        </div>
                        <div className={style.fullWidth}>
                            <span className={style.label}>Bệnh mãn tính:</span>
                            {isEditing ? <input type="text" name="chronicDiseases" value={formData.chronicDiseases} onChange={handleFormChange} className={style.inputFieldFull} /> : ` ${healthProfile.chronicDiseases || 'Không có'}`}
                        </div>
                        <div className={style.fullWidth}>
                            <span className={style.label}>Dị ứng:</span>
                            {isEditing ? <input type="text" name="allergies" value={formData.allergies} onChange={handleFormChange} className={style.inputFieldFull} /> : ` ${healthProfile.allergies || 'Không có'}`}
                        </div>
                        <div className={style.fullWidth}>
                            <span className={style.label}>Ghi chú y tế chung:</span>
                            {isEditing ? <textarea name="generalNote" value={formData.generalNote} onChange={handleFormChange} className={style.textareaField} /> : ` ${healthProfile.generalNote || 'Không có'}`}
                        </div>
                    </div>
                    {isEditing && (
                        <div className={style.actionRow}>
                            <button type="submit" className={style.saveBtn} disabled={submitting}>Lưu thay đổi</button>
                            <button type="button" className={style.cancelBtn} onClick={handleCancel}>Hủy</button>
                        </div>
                    )}
                </form>
            ) : (
                <p className={style.notice}>Chưa có hồ sơ sức khỏe. Phụ huynh cần tạo hồ sơ cho học sinh.</p>
            )}
             {!isEditing && healthProfile && (
                <div className={style.actionRow}>
                    <button type="button" className={style.editBtn} onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
                </div>
            )}
        </div>
    );
};


// --- Main Parent Component ---
const StudentDetail = () => {
  // Tất cả hook phải ở đầu function component
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [healthProfile, setHealthProfile] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true); // luôn set loading true khi fetch
    try {
      const token = localStorage.getItem("token"); // đồng bộ key token
      const headers = { Authorization: `Bearer ${token}` };
      const studentPromise = axios.get(`${API_BASE}/Student/${id}`, { headers });
      const healthProfilePromise = axios.get(`${API_BASE}/health-profiles/student/${id}`, { headers });
      const medicalHistoryPromise = axios.get(`${API_BASE}/MedicalHistory/student/${id}`, { headers });
      const [studentRes, healthProfileRes, medicalHistoryRes] = await Promise.allSettled([
        studentPromise,
        healthProfilePromise,
        medicalHistoryPromise,
      ]);
      if (studentRes.status === "fulfilled") {
        setStudent(studentRes.value.data.data);
      } else {
        console.error("Lỗi tải thông tin học sinh:", studentRes.reason);
        notifyError("Không thể tải thông tin học sinh.");
        navigate("/students");
        return;
      }
      if (healthProfileRes.status === "fulfilled" && healthProfileRes.value.data.data) {
        setHealthProfile(healthProfileRes.value.data.data);
      } else {
        setHealthProfile(null);
      }
      if (medicalHistoryRes.status === "fulfilled" && medicalHistoryRes.value.data.data) {
        setMedicalHistory(Array.isArray(medicalHistoryRes.value.data.data) ? medicalHistoryRes.value.data.data : []);
      } else {
        setMedicalHistory([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
      notifyError("Đã xảy ra lỗi khi tải dữ liệu chi tiết.");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveBasic = async (payload) => {
    setSubmitting(true);
    try {
        await axios.put(`${API_BASE}/Student/${student.studentId}`, payload);
        notifySuccess("Cập nhật thông tin học sinh thành công!");
        await fetchData(); // Refetch all data
    } catch (error) {
        console.error("Lỗi cập nhật thông tin học sinh:", error);
        notifyError("Cập nhật thông tin thất bại: " + (error.response?.data?.message || ""));
        throw error; // Propagate error to child to stop submitting state
    } finally {
        setSubmitting(false);
    }
  };

  const handleSaveHealth = async (payload) => {
    setSubmitting(true);
    try {
        await axios.put(`${API_BASE}/health-profiles/student/${student.studentId}`, payload);
        notifySuccess("Cập nhật hồ sơ sức khỏe thành công!");
        await fetchData(); // Refetch all data
    } catch (error) {
        console.error("Lỗi cập nhật hồ sơ sức khỏe:", error);
        notifyError("Cập nhật hồ sơ thất bại: " + (error.response?.data?.message || ""));
        throw error; // Propagate error to child
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Đang tải dữ liệu học sinh..." />;
  }

  if (!student) {
    return (
      <div className={style.layoutContainer}>
        <Sidebar />
        <main className={style.mainContent}>
          <p>Không tìm thấy thông tin học sinh.</p>
          <button className={style.backBtn} onClick={() => navigate("/students")}>
            ← Quay lại danh sách
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.mainContent}>
        {(submitting) && <LoadingOverlay text="Đang cập nhật..." />}
        <Notification />

        <header className={style.dashboardHeaderBar}>
          <div className={style.titleGroup}>
            <h1>
              <span className={style.textBlack}>Chi tiết</span>
              <span className={style.textAccent}> học sinh</span>
            </h1>
          </div>
        </header>

        <div className={style.cardBox}>
            <div className={style.studentHeader}>
                <div>
                    <h2 className={style.name}>{student.fullName}</h2>
                    <p className={style.subInfo}>
                      Lớp: {student.class || 'N/A'} | Phụ huynh: {student.parentName || 'N/A'}
                    </p>
                </div>
            </div>

            <StudentInfoSection student={student} onSave={handleSaveBasic} />
            
            <HealthProfileSection 
              healthProfile={healthProfile}
              studentId={student.studentId}
              onSave={handleSaveHealth}
            />
            
            <div className={style.section}>
                <h4 className={style.sectionTitle}>Tiền sử bệnh</h4>
                {medicalHistory.length > 0 ? (
                    <table className={style.historyTable}>
                        <thead>
                            <tr>
                                <th>Tên bệnh</th>
                                <th>Ghi chú</th>
                                <th>Ngày chẩn đoán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalHistory.map((mh, idx) => (
                                <tr key={mh.historyId || idx}>
                                    <td>{mh.diseaseName || 'Không có'}</td>
                                    <td>{mh.note || 'Không có'}</td>
                                    <td>{mh.diagnosedDate ? new Date(mh.diagnosedDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className={style.notice}>Không có tiền sử bệnh nào được ghi nhận.</p>
                )}
            </div>

        </div>

        <div className={style.backContainer}>
          <button className={style.backBtn} onClick={() => navigate("/students")}>
            ← Quay lại danh sách
          </button>
        </div>
      </main>
    </div>
  );
};

export default StudentDetail;
