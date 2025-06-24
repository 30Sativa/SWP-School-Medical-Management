import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/FirstLogin.module.css";

const FirstLogin = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Parent") {
      navigate("/login");
    }
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      console.log("userId:", userId, "newPassword:", newPassword);
      const response = await axios.post(
        `https://swp-school-medical-management.onrender.com/api/User/change-password-firstlogin/${userId}`,
        { newPassword },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );

      if (response.status === 200) {
        setMessage("Đổi mật khẩu thành công! Đang chuyển vào trang phụ huynh...");
        // Giữ lại token, userId, role để không bị mất session
        setTimeout(async () => {
          // Lấy lại userId từ localStorage hoặc truyền qua location.state
          let userId = localStorage.getItem("userId");
          if (!userId && window.history.state && window.history.state.usr && window.history.state.usr.userId) {
            userId = window.history.state.usr.userId;
            localStorage.setItem("userId", userId);
          }
          // Lưu parentId vào localStorage
          localStorage.setItem("parentId", userId);
          // Lấy danh sách học sinh của parent
          try {
            const studentRes = await axios.get(
              "https://swp-school-medical-management.onrender.com/api/Student"
            );
            const students = studentRes.data.filter(
              (s) => s.parentId === userId
            );
            if (students.length > 0) {
              localStorage.setItem("studentIds", JSON.stringify(students.map(s => s.studentId)));
              localStorage.setItem("studentId", students[0].studentId);
            }
          } catch (err) {
            // Không alert ở đây, chỉ log
            console.error("Lỗi khi lấy danh sách học sinh sau đổi mật khẩu:", err);
          }
          navigate("/parent");
        }, 1200);
      } else {
        setMessage("Đổi mật khẩu thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      setMessage(
        error.response?.data?.message ||
        error.response?.data ||
        "Đã có lỗi xảy ra khi đổi mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Đổi mật khẩu lần đầu</h2>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
          {message && <p className={styles.message}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default FirstLogin;
