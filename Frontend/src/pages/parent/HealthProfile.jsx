import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/HealthProfile.module.css";
import axios from "axios";

const HealthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentInfo, setStudentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const studentRes = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/Student"
        );
        const student = studentRes.data.find(
          (s) => String(s.parentId) === String(userId)
        );

        if (!student) throw new Error("Không tìm thấy học sinh!");

        setStudentName(student.fullName);
        setStudentInfo({
          gender: student.gender,
          age:
            new Date().getFullYear() -
            new Date(student.dateOfBirth).getFullYear(),
          class: student.class,
        });

        localStorage.setItem("studentId", student.studentId);

        const profileRes = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/HealthProfile"
        );
        const studentProfile = profileRes.data.find(
          (p) => p.studentId === student.studentId
        );

        setProfile(studentProfile);
        setFormData(studentProfile);
      } catch (error) {
        console.error("Lỗi khi gọi API hồ sơ sức khỏe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "isActive" ? value === "true" : value;
    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/HealthProfile/${profile.profileId}`,
        {
          ...formData,
          studentId: profile.studentId,
        }
      );
      alert("Cập nhật thành công!");
      setProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      alert("Đã xảy ra lỗi khi cập nhật!");
    }
  };

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
          <div className={`${styles.card} ${styles["profile-card"]}`}>
            <img
              className={styles.avatar}
              src="https://i.pravatar.cc/100"
              alt="User"
            />
            <h3>{studentName || "Thông tin học sinh"}</h3>

            <div className={styles["info-section"]}>
              {isEditing ? (
                <>
                  <div className={styles.inputGroup}>
                    <label>Chiều cao</label>
                    <input
                      className={styles.input}
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Cân nặng</label>
                    <input
                      className={styles.input}
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Bệnh mãn tính</label>
                    <input
                      className={styles.input}
                      name="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Dị ứng</label>
                    <input
                      className={styles.input}
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Ghi chú</label>
                    <textarea
                      className={styles.textarea}
                      name="generalNote"
                      value={formData.generalNote}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Trạng thái</label>
                    <select
                      className={styles.select}
                      name="isActive"
                      value={formData.isActive}
                      onChange={handleChange}
                    >
                      <option value={true}>Đang hoạt động</option>
                      <option value={false}>Ngừng hoạt động</option>
                    </select>
                  </div>
                  <div className={styles.buttonRow}>
                    <button
                      className={styles["cancel-button"]}
                      onClick={() => setIsEditing(false)}
                    >
                      Huỷ
                    </button>
                    <button
                      className={styles["save-button"]}
                      onClick={handleUpdate}
                    >
                      Lưu
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {!isEditing && (
              <button
                className={styles["update-btn"]}
                onClick={() => setIsEditing(true)}
              >
                Cập nhật
              </button>
            )}
          </div>

          <div className={styles["card-group"]}>
            <div className={`${styles.card} ${styles["vitals-card"]}`}>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>👤</div>
                <div className={styles["vital-title"]}>Giới tính</div>
                <div className={styles["vital-value"]}>
                  {studentInfo.gender}
                </div>
              </div>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>🎂</div>
                <div className={styles["vital-title"]}>Tuổi</div>
                <div className={styles["vital-value"]}>{studentInfo.age}</div>
              </div>
              <div className={styles["vital-box"]}>
                <div className={styles["vital-icon"]}>🏫</div>
                <div className={styles["vital-title"]}>Lớp</div>
                <div className={styles["vital-value"]}>{studentInfo.class}</div>
              </div>
            </div>

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
