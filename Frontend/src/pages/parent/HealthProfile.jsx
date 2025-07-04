import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/Healthprofile.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HealthProfile = () => {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const parentId = localStorage.getItem("parentId");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const studentRes = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/Student/by-parent/${parentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const students = studentRes.data.data || [];
        const fetchedData = await Promise.all(
          students.map(async (student) => {
            try {
              const [profileRes, summaryRes] = await Promise.all([
                axios.get(
                  `https://swp-school-medical-management.onrender.com/api/health-profiles/student/${student.studentId}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                ),
                axios.get(
                  `https://swp-school-medical-management.onrender.com/api/health-checks/summaries`,
                  { headers: { Authorization: `Bearer ${token}` } }
                ),
              ]);
              const summaries = summaryRes.data.data;
              const matchedSummaries = Array.isArray(summaries)
                ? summaries.filter((s) => s.studentId === student.studentId)
                : [];
              return {
                studentInfo: student,
                profile: profileRes.data.data,
                summaries: matchedSummaries,
              };
            } catch {
              return {
                studentInfo: student,
                profile: null,
                summaries: [],
              };
            }
          })
        );

        setStudentList(fetchedData);
      } catch (err) {
        console.error("Lỗi khi tải danh sách hồ sơ:", err);
        toast.error("Không thể tải dữ liệu hồ sơ sức khỏe.");
      } finally {
        setLoading(false);
      }
    };

    if (parentId && token) {
      fetchProfiles();
    } else {
      toast.error("Thiếu token hoặc parentId!");
      setLoading(false);
    }
  }, [token, parentId]);

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

  const getPriority = (title) => {
    if (!title) return 0;
    const lower = title.toLowerCase();
    if (lower.includes("giữa kỳ 2025")) return 3;
    if (lower.includes("cuối năm 2025")) return 2;
    if (lower.includes("định kỳ")) return 1;
    return 0;
  };

  if (loading)
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.customSpinner}>
          <div className={styles.spinnerIcon}></div>
          <div className={styles.spinnerText}>Đang tải dữ liệu...</div>
        </div>
      </div>
    );

  if (studentList.length === 0) return <p>Không có hồ sơ sức khỏe nào.</p>;

  return (
    <div className={styles.container}>
      <ToastContainer />
      <Sidebar />
      <div className={styles.content}>
        {studentList.map(({ studentInfo, profile, summaries }) => (
          <div
            key={studentInfo.studentId}
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
              🩺 Hồ sơ sức khỏe của bé {studentInfo.fullName}
            </h2>

            {!profile ? (
              <p style={{ color: "#dc2626", fontWeight: "500" }}>
                ⚠️ Chưa có hồ sơ sức khỏe cho bé này.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth < 600 ? "column" : "row",
                    alignItems: "center",
                    gap: "24px",
                    marginBottom: "28px",
                  }}
                >
                  <img
                    src="https://i.pravatar.cc/120"
                    alt="avatar"
                    className={styles.avatar}
                  />
                  <div>
                    <h3 className={styles.name}>👦 {studentInfo.fullName}</h3>
                    <p className={styles.subInfo}>Lớp: {studentInfo.className}</p>
                  </div>
                </div>

                <h4 className={styles.sectionTitle}>👤 Thông tin cá nhân</h4>
                <div className={styles.infoBox}>
                  <div className={styles.infoGrid}>
                    <div><span className={styles.label}>Giới tính:</span> {studentInfo.gender}</div>
                    <div><span className={styles.label}>Tuổi:</span> {calculateAge(studentInfo.dateOfBirth)}</div>
                    <div><span className={styles.label}>Chiều cao:</span> {profile.height > 0 ? `${profile.height} cm` : "Chưa có thông tin"}</div>
                    <div><span className={styles.label}>Cân nặng:</span> {profile.weight > 0 ? `${profile.weight} kg` : "Chưa có thông tin"}</div>
                    <div><span className={styles.label}>Bệnh mãn tính:</span> {profile.chronicDiseases !== "string" ? profile.chronicDiseases : "Không có"}</div>
                    <div><span className={styles.label}>Dị ứng:</span> {profile.allergies !== "string" ? profile.allergies : "Không có"}</div>
                    <div><span className={styles.label}>Ghi chú:</span> {profile.generalNote !== "string" ? profile.generalNote : "Không có"}</div>
                    <div><span className={styles.label}>Trạng thái:</span> {profile.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
                  </div>
                </div>

                {summaries.length > 0 && (
                  <div
                    style={{
                      background: "#f1f5f9",
                      padding: "20px",
                      borderRadius: "14px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h4 style={{ marginBottom: "16px", color: "#0e2a47", fontSize: "1.1rem" }}>
                      📋 Thông tin khám sức khỏe
                    </h4>

                    {[...summaries]
                      .sort((a, b) => getPriority(b.campaignTitle) - getPriority(a.campaignTitle))
                      .map((item, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "20px",
                            padding: "12px 16px",
                            borderRadius: "10px",
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                          }}
                        >
                          <h5 style={{ marginBottom: "10px", fontSize: "1.05rem", color: "#0284c7" }}>
                            📌 {item.campaignTitle}
                          </h5>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                window.innerWidth < 600
                                  ? "1fr"
                                  : "repeat(auto-fit, minmax(260px, 1fr))",
                              gap: "12px",
                              fontSize: "0.95rem",
                              color: "#1e293b",
                            }}
                          >
                            <div><strong>Chiều cao:</strong> {item.height} cm</div>
                            <div><strong>Cân nặng:</strong> {item.weight} kg</div>
                            <div><strong>Huyết áp:</strong> {item.bloodPressure}</div>
                            <div><strong>Thị lực:</strong> {item.visionSummary}</div>
                            <div><strong>Tai mũi họng:</strong> {item.ent}</div>
                            <div><strong>Ghi chú:</strong> {item.generalNote}</div>
                            <div><strong>Theo dõi:</strong> {item.followUpNote}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthProfile;


