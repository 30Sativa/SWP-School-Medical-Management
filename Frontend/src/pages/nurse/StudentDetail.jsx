import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/studentDetail.module.css";
import axios from "axios";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    parent: "",
    class: "",
  });
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // loading khi submit modal

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://swp-school-medical-management.onrender.com/api/Student/${id}`
      )
      .then((res) => setStudent(res.data.data))
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBack = () => {
    navigate("/students");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xoá học sinh này?");
    if (!confirmDelete) return;

    axios
      .delete(
        `https://swp-school-medical-management.onrender.com/api/Student/${student.studentId}`
      )
      .then(() => {
        notifySuccess("Đã xoá học sinh.");
        navigate("/students");
      })
      .catch((err) => {
        console.error("Lỗi xoá học sinh:", err);
        notifyError("Xoá thất bại!");
      });
  };

  const handleEdit = () => {
    setFormData({
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      gender: student.genderName, // genderName for consistency
      parent: student.parentName, // parentName for consistency
      class: student.class,
    });
    setShowForm(true);
  };

  const handleUpdate = () => {
    setModalLoading(true);
    const updatedData = {
      studentId: student.studentId,
      fullName: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      genderName: formData.gender, // genderName instead of gender
      parentName: formData.parent, // parentName instead of parent
      class: formData.class,
    };

    axios
      .put(
        "https://swp-school-medical-management.onrender.com/api/Student",
        updatedData
      )
      .then(() => {
        notifySuccess("Cập nhật thành công!");
        setStudent({ ...student, ...formData });
        setShowForm(false);
      })
      .catch((err) => {
        console.error("Lỗi cập nhật:", err);
        const errorMessage =
          err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại!";
        notifyError(errorMessage); // Show detailed error message
      })
      .finally(() => setModalLoading(false));
  };

  if (loading || modalLoading)
    return (
      <div className={style.loadingOverlay}>
        <div className={style.spinner}></div>
      </div>
    );

  return (
    <div className={style.layoutContainer}>
      <Sidebar />

      <main className={style.mainContent}>
        <div className={style.titleGroup}>
          <h1>
            <span className={style.textBlack}>Thông tin</span>
            <span className={style.textAccent}> học sinh</span>
          </h1>
        </div>

        <div className={style.contentWrapper}>
          <div className={style.leftPanel}>
            <img
              src="https://i.pravatar.cc/150?img=15"
              alt="avatar"
              className={style.avatar}
            />
            <h2>{student.fullName}</h2>
            <p className={style.label}>Mã học sinh: {student.studentId}</p>
          </div>

          <div className={style.rightPanel}>
            <div className={style.notebookBox}>
              <div className={style.line}>
                <span>Phụ huynh:</span> {student.parentName}
              </div>
              <div className={style.line}>
                <span>Giới tính:</span> {student.genderName}
              </div>
              <div className={style.line}>
                <span>Ngày sinh:</span> {student.dateOfBirth}
              </div>
              <div className={style.line}>
                <span>Lớp:</span> {student.class}
              </div>

              <div className={style.actionRow}>
                <button className={style.editBtn} onClick={handleEdit}>
                  Chỉnh sửa
                </button>
                <button className={style.deleteBtn} onClick={handleDelete}>
                  Xoá
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className={style.backContainer}>
          <button className={style.backBtn} onClick={handleBack}>
            ← Quay lại danh sách
          </button>
        </div>

        {/* Modal form cập nhật */}
        {showForm && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <h3>Cập nhật học sinh</h3>
              <input
                type="text"
                placeholder="Họ tên"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Giới tính"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Lớp"
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phụ huynh"
                value={formData.parent}
                onChange={(e) =>
                  setFormData({ ...formData, parent: e.target.value })
                }
              />

              <div className={style.modalActions}>
                <button onClick={() => setShowForm(false)}>Huỷ</button>
                <button onClick={handleUpdate}>Lưu</button>
              </div>
            </div>
          </div>
        )}
        <Notification />
        {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
      </main>
    </div>
  );
};

export default StudentDetail;
