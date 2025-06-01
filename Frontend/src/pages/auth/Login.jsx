import '../../assets/CSS/Login.css'; // Import your CSS styles
import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "parent" });
  const [loading, setLoading] = useState(false);
  const [focusIndex, setFocusIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, role } = form;
    if (!username || !password || !role) {
      alert("Vui lòng nhập đầy đủ thông tin và chọn quyền đăng nhập!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/User/login", {
        username,
        password
      });
      // Xử lý kết quả trả về ở đây (ví dụ: lưu token, chuyển trang, ...)
      alert("Đăng nhập thành công!");
      // Ví dụ: lưu token vào localStorage
      // localStorage.setItem('token', response.data.token);
    } catch (error) {
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (idx) => setFocusIndex(idx);
  const handleBlur = () => setFocusIndex(null);

  // Example: fetchProduct function (not used in UI)
  const fetchProduct = async () => {
    const response = await axios.get("http://14.225.210.212:8080/api/products");
    console.log(response);
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <h1>Hệ thống quản lý sức khỏe học đường</h1>
        <p>Giải pháp toàn diện cho việc theo dõi và quản lý sức khỏe của bạn</p>
        <div className="illustration"></div>
      </div>
      <div className="right-section">
        <div className="form-header">
          <h2>Đăng nhập</h2>
          <p>Chào mừng bạn trở lại!</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ transform: focusIndex === 0 ? "scale(1.02)" : "scale(1)" }}>
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tài khoản của bạn"
              value={form.username}
              onChange={handleChange}
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
            />
          </div>
          <div className="form-group" style={{ transform: focusIndex === 1 ? "scale(1.02)" : "scale(1)" }}>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={handleChange}
              onFocus={() => handleFocus(1)}
              onBlur={handleBlur}
            />
          </div>
          <div className="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <div className="register-link">
            <span>Chưa có tài khoản? </span>
            {/* <a href="#">Đăng ký ngay</a> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;