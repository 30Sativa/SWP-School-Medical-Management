import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/studentList.module.css";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  // Call API để lấy danh sách học sinh
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/Student");
      setStudents(response.data);
    } catch (error) {
      console.error("Có lỗi khi gọi API:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const totalPages = 5;

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
          />
          <button className={style.addBtn}>Thêm học sinh</button>
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
            {students && students.length > 0 ? (
              students.map((student, index) => (
                <tr key={student.id || index}>
                  <td>{index + 1}</td>
                  <td>{student.fullName}</td>
                  <td>{student.studentId}</td>
                  <td>{student.class}</td>
                  <td>{student.parent}</td>
                  <td>
                    <button className={style.btn}>Xem chi tiết</button>
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
            <button key={index}>{index + 1}</button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StudentList;
