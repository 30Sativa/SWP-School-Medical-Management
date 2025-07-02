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
  const [loading, setLoading] = useState(true);
  const studentsPerPage = 10;
  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    navigate(`/students/${id}`);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://swp-school-medical-management.onrender.com/api/Student");
      let studentArray = response.data?.data || [];

      // Sắp xếp theo mã học sinh (studentId) tăng dần
      studentArray.sort((a, b) => {
        // Nếu mã là số, ép kiểu và so sánh số
        return Number(a.studentId) - Number(b.studentId);
      });

      setStudents(studentArray);
      setFilteredStudents(studentArray);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
        </div>

        <table className={style.studentTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã học sinh</th>
              <th>Họ và tên</th>
              <th>Lớp</th>
              <th>Phụ huynh</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className={style.skeletonRow}>
                  {Array.from({ length: 6 }).map((_, cidx) => (
                    <td key={cidx}><div className={style.skeletonCell}></div></td>
                  ))}
                </tr>
              ))
            ) : currentStudents.length > 0 ? (
              currentStudents.map((student, index) => (
                <tr key={student.id || index}>
                  <td>{indexOfFirstStudent + index + 1}</td>
                  <td> HS{student.studentId}</td>
                  <td>{student.fullName}</td>
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
      </main>
    </div>
  );
};

export default StudentList;
