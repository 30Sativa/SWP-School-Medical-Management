import "../../assets/CSS/Login.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    try {
      setLoading(true);
      console.log("🔁 Đang gửi request đăng nhập...");
      const response = await axios.post(
        "https://swp-school-medical-management.onrender.com/api/User/login",
        { username, password }
      );

      const resData = response.data?.data;
      const roleName = resData?.role?.roleName;

      console.log("📥 Phản hồi từ server:", response.data);

      if (response.data.message?.toLowerCase().includes("login successful")) {
        localStorage.setItem("token", resData.token);
        alert("✅ Đăng nhập thành công!");

        // ✅ Điều hướng theo vai trò
        if (roleName === "Manager") {
          navigate("/manager");
        } else if (roleName === "Nurse") {
          navigate("/nurse");
        } else if (roleName === "Parent") {
          navigate("/parent");
        } else {
          alert("❗ Vai trò không xác định!");
          navigate("/");
        }
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      alert("Lỗi kết nối đến server hoặc sai thông tin đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="left-section">
          <h1>Hệ thống quản lý sức khỏe học đường</h1>
          <p>
            Giải pháp toàn diện cho việc theo dõi và quản lý sức khỏe của bạn
          </p>
          <div className="illustration"></div>
        </div>
        <div className="right-section">
          <div className="right-content">
            <div className="form-header">
              <h2>Đăng nhập</h2>
              <p>Chào mừng bạn trở lại!</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Tài khoản</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Nhập tài khoản của bạn"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="forgot-password">
                <a href="#">Quên mật khẩu?</a>
              </div>
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
              <div className="register-link">
                <span>Chưa có tài khoản?</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
