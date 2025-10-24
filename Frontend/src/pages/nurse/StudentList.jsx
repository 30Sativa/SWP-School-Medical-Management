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
  const [sortConfig, setSortConfig] = useState({ key: 'studentId', direction: 'ascending' });
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
      setStudents(studentArray);
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
    let sortableItems = [...students];

    // Filter first
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter((student) => {
        const nameMatch = student.fullName.toLowerCase().includes(lowercasedFilter);
        const idMatch = student.studentId.toString().includes(lowercasedFilter);
        const classMatch = student.className.toLowerCase().includes(lowercasedFilter);
        const parentMatch = student.parentName ? student.parentName.toLowerCase().includes(lowercasedFilter) : false;
        return nameMatch || idMatch || classMatch || parentMatch;
      });
    }
    if (classFilter) {
      sortableItems = sortableItems.filter(
        (student) => student.className === classFilter
      );
    }

    // Then sort
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle numeric sorting for studentId
        if (sortConfig.key === 'studentId') {
          aValue = Number(aValue);
          bValue = Number(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredStudents(sortableItems);
    setCurrentPage(1);
  }, [students, searchTerm, classFilter, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    }
    return null;
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
        </div>

        <table className={style.studentTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th onClick={() => requestSort('studentId')} className={style.sortableHeader}>
                Mã học sinh{getSortIndicator('studentId')}
              </th>
              <th onClick={() => requestSort('fullName')} className={style.sortableHeader}>
                Họ và tên{getSortIndicator('fullName')}
              </th>
              <th onClick={() => requestSort('className')} className={style.sortableHeader}>
                Lớp{getSortIndicator('className')}
              </th>
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
                <tr key={student.studentId || index} className={style.studentRow}>
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
