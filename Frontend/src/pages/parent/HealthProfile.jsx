import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/HealthProfile.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HealthProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchHealthProfile = async () => {
      try {
        const response = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/HealthProfile/1"
        );
        const data = {
          ...response.data.data,
          vision: "10/10",
          hearing: "Bình thường",
          exercise: "3 buổi/tuần",
          doctorNote: "Ăn uống đầy đủ, ngủ đủ giấc",
        };
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/HealthProfile/${profile.profileId}`,
        {
          studentId: profile.studentId,
          height: formData.height,
          weight: formData.weight,
          chronicDiseases: formData.chronicDiseases,
          allergies: formData.allergies,
          generalNote: formData.generalNote,
          isActive: formData.isActive,
        }
      );
      toast.success("Cập nhật thành công!", {
        position: "top-center",
        autoClose: 1800,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("❌ Cập nhật thất bại!", {
        position: "top-center",
        autoClose: 1800,
        theme: "colored",
      });
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!profile) return <p>Không có hồ sơ sức khỏe.</p>;

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
            <img src="https://i.pravatar.cc/120" alt="avatar" className={styles.avatar} />
            <h3 className={styles.name}>Lê Trần Đức Thắng</h3>

            <div className={styles.infoBlock}>
              <div className={styles.infoItem}>
                <span>Chiều cao:</span>
                <span>
                  {isEditing ? (
                    <input name="height" value={formData.height} onChange={handleChange} />
                  ) : (
                    `${profile.height} cm`
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Cân nặng:</span>
                <span>
                  {isEditing ? (
                    <input name="weight" value={formData.weight} onChange={handleChange} />
                  ) : (
                    `${profile.weight} kg`
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Bệnh mãn tính:</span>
                <span>
                  {isEditing ? (
                    <input name="chronicDiseases" value={formData.chronicDiseases} onChange={handleChange} />
                  ) : (
                    profile.chronicDiseases
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Dị ứng:</span>
                <span>
                  {isEditing ? (
                    <input name="allergies" value={formData.allergies} onChange={handleChange} />
                  ) : (
                    profile.allergies
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Ghi chú:</span>
                <span>
                  {isEditing ? (
                    <input name="generalNote" value={formData.generalNote} onChange={handleChange} />
                  ) : (
                    profile.generalNote
                  )}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span>Trạng thái:</span>
                <span>
                  {isEditing ? (
                    <select name="isActive" value={formData.isActive} onChange={handleChange}>
                      <option value={true}>Đang hoạt động</option>
                      <option value={false}>Ngừng hoạt động</option>
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
              <button className={styles.updateButton} onClick={() => setIsEditing(true)}>
                Cập nhật
              </button>
            ) : (
              <>
                <button className={styles.updateButton} onClick={handleSave}>Lưu</button>
                <button className={styles.updateButton} onClick={() => setIsEditing(false)}>Huỷ</button>
              </>
            )}
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.basicInfoRow}>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>👩‍⚕️</div>
                <div className={styles.basicLabel}>Giới tính</div>
                <div className={styles.basicValue}>Nữ</div>
              </div>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>🎂</div>
                <div className={styles.basicLabel}>Tuổi</div>
                <div className={styles.basicValue}>9</div>
              </div>
              <div className={styles.basicInfoBox}>
                <div className={styles.basicIcon}>🏫</div>
                <div className={styles.basicLabel}>Lớp</div>
                <div className={styles.basicValue}>Mẫu giáo</div>
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
                <li><b>Heart Diseases</b> – 25th Oct 2019 – 3 months</li>
                <li><b>Skin Care</b> – 8th Aug 2019 – 2 months</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
