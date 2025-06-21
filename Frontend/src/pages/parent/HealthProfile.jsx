import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/HealthProfile.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HealthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const studentId = localStorage.getItem("studentId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, studentRes] = await Promise.all([
          axios.get(
            `https://swp-school-medical-management.onrender.com/api/health-profiles/student/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(
            `https://swp-school-medical-management.onrender.com/api/Student/${studentId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const healthData = healthRes.data.data;
        const studentData = studentRes.data.data;

        setProfile(healthData);
        setFormData(healthData);
        setStudentInfo(studentData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        toast.error("Không thể tải hồ sơ sức khỏe hoặc thông tin học sinh.");
      } finally {
        setLoading(false);
      }
    };

    if (studentId && token) {
      fetchData();
    } else {
      toast.error("Thiếu studentId hoặc token!");
      setLoading(false);
    }
  }, [studentId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/health-profiles/student/${studentId}`,
        {
          height: formData.height,
          weight: formData.weight,
          chronicDiseases: formData.chronicDiseases,
          allergies: formData.allergies,
          generalNote: formData.generalNote,
          isActive: formData.isActive,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Cập nhật thành công!");
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast.error("❌ Cập nhật thất bại!");
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!profile || !studentInfo) return <p>Không có hồ sơ sức khỏe.</p>;

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>
          <span className={styles.accent}>|</span> Hồ sơ{" "}
          <span className={styles.greenText}>sức khỏe học sinh</span>
        </h2>

        <div className={styles.profileWrapper}>
          <div className={styles.leftPanel}>
            <img
              src="https://i.pravatar.cc/120"
              alt="avatar"
              className={styles.avatar}
            />
            <h3 className={styles.name}>{studentInfo.fullName}</h3>

            <div className={styles.infoBlock}>
              <div className={styles.infoItem}>
                <span>Chiều cao:</span>
                <span>
                  {isEditing ? (
                    <input
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  ) : (
                    `${profile.height} cm`
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Cân nặng:</span>
                <span>
                  {isEditing ? (
                    <input
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  ) : (
                    `${profile.weight} kg`
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Bệnh mãn tính:</span>
                <span>
                  {isEditing ? (
                    <input
                      name="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={handleChange}
                    />
                  ) : (
                    profile.chronicDiseases
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Dị ứng:</span>
                <span>
                  {isEditing ? (
                    <input
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  ) : (
                    profile.allergies
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Ghi chú:</span>
                <span>
                  {isEditing ? (
                    <input
                      name="generalNote"
                      value={formData.generalNote}
                      onChange={handleChange}
                    />
                  ) : (
                    profile.generalNote
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Trạng thái:</span>
                <span>
                  {isEditing ? (
                    <select
                      name="isActive"
                      value={formData.isActive}
                      onChange={handleChange}
                    >
                      <option value={true}>Đang hoạt động</option>
                    </select>
                  ) : profile.isActive ? (
                    "Đang hoạt động"
                  ) : (
                    "Ngừng hoạt động"
                  )}
                </span>
              </div>
            </div>

            {!isEditing ? (
              <button
                className={styles.updateButton}
                onClick={() => setIsEditing(true)}
              >
                Cập nhật
              </button>
            ) : (
              <>
                <button className={styles.updateButton} onClick={handleSave}>
                  Lưu
                </button>
                <button
                  className={styles.updateButton}
                  onClick={() => setIsEditing(false)}
                >
                  Huỷ
                </button>
              </>
            )}
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.basicInfoRow}>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>👩‍⚕️</div>
                <div className={styles.basicLabel}>Giới tính</div>
                <div className={styles.basicValue}>
                  {studentInfo?.genderName || "Không rõ"}
                </div>
              </div>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>🎂</div>
                <div className={styles.basicLabel}>Tuổi</div>
                <div className={styles.basicValue}>
                  {calculateAge(studentInfo.dateOfBirth)}
                </div>
              </div>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>🏫</div>
                <div className={styles.basicLabel}>Lớp</div>
                <div className={styles.basicValue}>{studentInfo.class}</div>
              </div>
            </div>

            <div className={styles.infoBox}>
              <h4>🩺 Test Reports</h4>
              <ul className={styles.reportList}>
                <li>CT Scan - Full Body <span>(12th Feb 2020)</span></li>
                <li>Creatine Kinase T <span>(12th Feb 2020)</span></li>
                <li>Eye Fluorescein Test <span>(12th Feb 2020)</span></li>
              </ul>
            </div>

            <div className={styles.infoBox}>
              <h4>💊 Prescriptions</h4>
              <p className={styles.addPrescription}>+ Add a prescription</p>
              <ul className={styles.reportList}>
                <li>
                  <b>Heart Diseases</b> – 25th Oct 2019 – 3 months
                </li>
                <li>
                  <b>Skin Care</b> – 8th Aug 2019 – 2 months
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
