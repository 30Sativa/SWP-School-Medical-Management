import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/studentList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortClassAsc, setSortClassAsc] = useState(true); // trạng thái sort lớp
  const [sortNameAsc, setSortNameAsc] = useState(true); // trạng thái sort tên
  const [sortIdAsc, setSortIdAsc] = useState(true); // trạng thái sort mã hs
  const [sortType, setSortType] = useState("class"); // loại sort: class, name, id
  const [classFilter, setClassFilter] = useState(""); // lọc theo lớp
  const studentsPerPage = 13;
  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    navigate(`/students/${id}`);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://swp-school-medical-management.onrender.com/api/Student"
      );
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
    let filtered = students.filter((student) =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Nếu chọn lớp, chỉ lấy học sinh thuộc lớp đó
    if (classFilter) {
      filtered = filtered.filter(
        (student) => student.className === classFilter
      );
    }
    // Sort theo loại sort
    filtered = [...filtered].sort((a, b) => {
      if (sortType === "class") {
        return sortClassAsc
          ? a.className.localeCompare(b.className)
          : b.className.localeCompare(a.className);
      } else if (sortType === "name") {
        return sortNameAsc
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      } else if (sortType === "id") {
        return sortIdAsc
          ? Number(a.studentId) - Number(b.studentId)
          : Number(b.studentId) - Number(a.studentId);
      }
      return 0;
    });
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, students, sortClassAsc, classFilter, sortType, sortNameAsc, sortIdAsc]);

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

        <div
          className={style.header}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className={style.searchBar}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 220, maxWidth: 300 }}
          />
          <select
            className={style.classFilter}
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #bdbdbd", fontSize: 15, color: "#333" }}
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <option value="">Tất cả lớp</option>
            {[...new Set(students.map(s => s.className))].sort().map((className) => (
              <option key={className} value={className}>{className}</option>
            ))}
          </select>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className={style.sortLabel}
              style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: "bold", border: "none", background: "none", color: sortType === "class" ? "#1e88e5" : "#333", fontSize: 16 }}
              onClick={() => { setSortType("class"); setSortClassAsc((prev) => !prev); }}
              title="Sắp xếp theo lớp"
            >
              <span style={{ fontSize: 18 }}>{sortClassAsc ? "▲" : "▼"}</span>
              <span>Lớp</span>
            </button>
            <button
              className={style.sortLabel}
              style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: "bold", border: "none", background: "none", color: sortType === "name" ? "#1e88e5" : "#333", fontSize: 16 }}
              onClick={() => { setSortType("name"); setSortNameAsc((prev) => !prev); }}
              title="Sắp xếp theo tên"
            >
              <span style={{ fontSize: 18 }}>{sortNameAsc ? "▲" : "▼"}</span>
              <span>Tên</span>
            </button>
            <button
              className={style.sortLabel}
              style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: "bold", border: "none", background: "none", color: sortType === "id" ? "#1e88e5" : "#333", fontSize: 16 }}
              onClick={() => { setSortType("id"); setSortIdAsc((prev) => !prev); }}
              title="Sắp xếp theo mã học sinh"
            >
              <span style={{ fontSize: 18 }}>{sortIdAsc ? "▲" : "▼"}</span>
              <span>Mã HS</span>
            </button>
          </div>
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
                    <td key={cidx}>
                      <div className={style.skeletonCell}></div>
                    </td>
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

        {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}

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
      <Notification />
    </div>
  );
};

export default StudentList;
