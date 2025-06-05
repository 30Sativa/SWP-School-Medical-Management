import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const StudentDetail = () => {
  const { id } = useParams(); // Lấy id học sinh từ URL
  const [student, setStudent] = useState(null);

  // Giả lập lấy dữ liệu học sinh từ API hoặc dữ liệu tĩnh
  useEffect(() => {
    // Ví dụ dữ liệu học sinh tĩnh, bạn có thể thay thế bằng API fetch
    const studentData = {
      HS2015001: {
        name: "Trần Minh Anh",
        id: "HS2015001",
        class: "Lớp 2A",
        status: "Đang học",
        email: "minhanh@eduhealth.com",
        phone: "0123456789",
        address: "Hà Nội",
      },
      HS2015002: {
        name: "Nguyễn Thị Hồng Hương",
        id: "HS2015002",
        class: "Lớp 1B",
        status: "Đang học",
        email: "honghuong@eduhealth.com",
        phone: "0987654321",
        address: "Hà Nội",
      },
      // Thêm các học sinh khác ở đây
    };

    // Lấy dữ liệu học sinh theo ID từ URL
    setStudent(studentData[id]);
  }, [id]);

  if (!student) {
    return <div>Loading...</div>; // Nếu chưa có dữ liệu, hiển thị Loading
  }

  return (
    <div className="student-detail">
      <h2>Thông tin chi tiết học sinh</h2>
      <p><strong>Họ và tên:</strong> {student.name}</p>
      <p><strong>Mã số:</strong> {student.id}</p>
      <p><strong>Lớp:</strong> {student.class}</p>
      <p><strong>Trạng thái:</strong> {student.status}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Số điện thoại:</strong> {student.phone}</p>
      <p><strong>Địa chỉ:</strong> {student.address}</p>
    </div>
  );
};

export default StudentDetail;
