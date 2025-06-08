import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/HealthProfile.module.css";
import axios from "axios";

const HealthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");

        // Lấy student theo parentId
        const studentRes = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/Student"
        );
        // So sánh kiểu string để tránh lỗi không tìm thấy học sinh
        const student = studentRes.data.find(
          (s) => String(s.parentId) === String(userId)
        );

        if (!student) throw new Error("Không tìm thấy học sinh!");

        setStudentName(student.fullName);
        localStorage.setItem("studentId", student.studentId);

        // Lấy health profile theo studentId
        const profileRes = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/HealthProfile"
        );
        const studentProfile = profileRes.data.find(
          (p) => p.studentId === student.studentId
        );

        setProfile(studentProfile);
      } catch (error) {
        console.error("Lỗi khi gọi API hồ sơ sức khỏe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  if (!profile)
    return (
      <div>
        <p>Không có hồ sơ sức khỏe.</p>
        <button onClick={() => alert("Chuyển tới trang tạo hồ sơ")}>
          Tạo hồ sơ mới
        </button>
      </div>
    );

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.content}>
        <header>
          <div className={styles["dashboard-header-bar"]}>
            <div className={styles["title-group"]}>
              <h1>
                <span className={styles["text-accent"]}>|</span>
                <span className={styles["text-black"]}>Hồ sơ</span>
                <span className={styles["text-accent"]}> sức khỏe</span>
              </h1>
            </div>
          </div>
        </header>

        <div style={{ display: "flex", gap: "20px" }}>
          {/* Profile Card */}
          <div className={`${styles.card} ${styles["profile-card"]}`}>
            <img
              className={styles.avatar}
              src="https://i.pravatar.cc/100"
              alt="User"
            />
            <h3>{studentName || "Thông tin học sinh"}</h3>
            <button className={styles["update-btn"]}>Cập nhật</button>

            <div className={styles["info-section"]}>
              <p>
                <strong>Chiều cao:</strong> {profile.height}
              </p>
              <p>
                <strong>Cân nặng:</strong> {profile.weight}
              </p>
              <p>
                <strong>Bệnh mãn tính:</strong> {profile.chronicDiseases}
              </p>
              <p>
                <strong>Dị ứng:</strong> {profile.allergies}
              </p>
              <p>
                <strong>Ghi chú:</strong> {profile.generalNote}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {profile.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles["card-group"]}>
            {/* Vital Stats */}
            <div className={`${styles.card} ${styles["vitals-card"]}`}>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>❤️</div>
                <div className={styles["vital-title"]}>Heart Rate</div>
                <div className={styles["vital-value"]}>80 bpm</div>
              </div>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>🌡️</div>
                <div className={styles["vital-title"]}>Body Temperature</div>
                <div className={styles["vital-value"]}>36.5℃</div>
              </div>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>🩸</div>
                <div className={styles["vital-title"]}>Glucose</div>
                <div className={styles["vital-value"]}>100 mg/dl</div>
              </div>
            </div>

            {/* Test Reports */}
            <div className={`${styles.card} ${styles["report-card"]}`}>
              <div className={styles["report-header"]}>
                🧪 <span>Test Reports</span>
              </div>
              <ul className={styles["report-list"]}>
                <li>
                  CT Scan - Full Body <span>(12th Feb 2020)</span>
                </li>
                <li>
                  Creatine Kinase T <span>(12th Feb 2020)</span>
                </li>
                <li>
                  Eye Fluorescein Test <span>(12th Feb 2020)</span>
                </li>
              </ul>
            </div>

            {/* Prescriptions */}
            <div className={`${styles.card} ${styles["prescription-card"]}`}>
              <div className={styles["report-header"]}>
                💊 <span>Prescriptions</span>
              </div>
              <button className={styles["add-btn"]}>
                + Add a prescription
              </button>
              <ul className={styles["report-list"]}>
                <li>
                  <strong>Heart Diseases</strong> – 25th Oct 2019 – 3 months
                </li>
                <li>
                  <strong>Skin Care</strong> – 8th Aug 2019 – 2 months
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HealthProfile;
