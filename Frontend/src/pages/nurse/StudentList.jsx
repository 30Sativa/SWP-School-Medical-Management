import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/studentList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    navigate(`/students/${id}`);
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/Student");
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Có lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students]);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newStudent = {
      fullName: form.fullName.value,
      studentId: form.studentId.value,
      class: form.class.value,
      parent: form.parent.value,
    };

    try {
      await axios.post("/api/Student", newStudent);
      alert("✅ Thêm học sinh thành công!");
      setShowAddModal(false);
      fetchStudents(); // Reload lại danh sách
    } catch (error) {
      alert("❌ Thêm học sinh thất bại!");
      console.error(error);
    }
  };

  return (
    <div className={style.layoutContainer}>
      <Sidebar />

      <main className={style.layoutContent}>
        <header className={style.dashboardHeaderBar}>
          <div className={style.titleGroup}>
            <h1>
              <span className={style.textBlack}>Danh sách</span>
              <span className={style.textAccent}> học sinh</span>
            </h1>
          </div>
        </header>

        <div className={style.header}>
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className={style.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className={style.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            Thêm học sinh
          </button>
        </div>

        <table className={style.studentTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Mã số</th>
              <th>Lớp</th>
              <th>Phụ huynh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student.id || index}>
                  <td>{indexOfFirstStudent + index + 1}</td>
                  <td>{student.fullName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.className}</td>
                  <td>{student.parentName}</td>
                  <td>
                    <button
                      className={style.btn}
                      onClick={() => handleViewDetail(student.studentId)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có dữ liệu học sinh
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={style.pagination}>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? style.activePage : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* MODAL ADD STUDENT */}
        {showAddModal && (
          <div className={style.modalOverlay}>
            <div className={style.modalContent}>
              <h2>Thêm học sinh mới</h2>
              <form onSubmit={handleAddStudent}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Họ và tên"
                  required
                />
                <input
                  type="text"
                  name="studentId"
                  placeholder="Mã học sinh"
                  required
                />
                <input type="text" name="class" placeholder="Lớp" required />
                <input
                  type="text"
                  name="parent"
                  placeholder="Tên phụ huynh"
                  required
                />
                <div className={style.modalActions}>
                  <button type="submit" className={style.submitBtn}>
                    Lưu
                  </button>
                  <button
                    type="button"
                    className={style.cancelBtn}
                    onClick={() => setShowAddModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentList;
