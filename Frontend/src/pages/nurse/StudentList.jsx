import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/studentList.css";
import axios from "axios";

const StudentList = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [students, setStudents] = useState([]); // Đặt đúng vị trí
  const [currentPage, setCurrentPage] = useState(1); // Sửa lại đúng cú pháp
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Call API để lấy danh sách học sinh
  const fetchStudents = async () => {
    try {
      // Gọi API qua proxy Vite (nên dùng /api thay vì domain đầy đủ)
      const response = await axios.get("/api/Student");
      setStudents(response.data);
    } catch (error) {
      console.error("Có lỗi khi gọi API:", error);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const totalPages = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className={`container ${
        isSidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      {/* Toggle button */}
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></svg>
          <a>EduHealth</a>
        </div>
        <nav>
          <a
            href="#"
            onClick={() => navigate("/nurse")} // Chuyển về Dashboard
          >
            Dashboard
          </a>
          <a href="#" className="active">
            Danh sách học sinh
          </a>
          <a href="#">Quản lý thuốc</a>
          <a href="#">Chiến dịch tiêm chủng</a>
          <a href="#">Kiểm tra sức khỏe</a>
          <a href="#">Sự cố y tế</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        <header>
          <div className="dashboard-header-bar">
            <div className="title-group">
              <h1>
                <span className="text-black">Danh sách</span>
                <span className="text-accent"> học sinh</span>
              </h1>
            </div>
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.clear(); // nếu có token cần xóa
                window.location.href = "/"; // chuyển về trang chủ
              }}
            >
              Đăng xuất
            </button>
          </div>
        </header>

        <div className="header">
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            className="search-bar"
          />
          <button className="add-btn">Thêm học sinh</button>
        </div>

        {/* Student Table */}
        <table className="student-table">
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
            {students && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id || index}>
                  <td>{index + 1}</td>
                  <td>{student.fullName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.class}</td>
                  <td>{student.parent}</td>
                  <td>
                    <button className="btn">Xem chi tiết</button>
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

        <div className="pagination">
          {[...Array(totalPages)].map((_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentList;
