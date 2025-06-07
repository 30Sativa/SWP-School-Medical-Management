import "../../assets/CSS/Login.css"; // Import your CSS styles
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "parent",
  });
  const [loading, setLoading] = useState(false);
  const [focusIndex, setFocusIndex] = useState(null);
  const navigate = useNavigate();
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


      // 🌟 Chuyển trang theo role
      if (role === "admin") {
        navigate("/manager");
      } else if (role === "nurse") {
        navigate("/nurse");
      } else if (role === "parent") {
        navigate("/parent");
      } else {
        alert("Vai trò không xác định");
      }
    }, 2000);

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
     <div className="login-page-wrapper">
    <div className="login-container">
      <div className="left-section">
        <h1>Hệ thống quản lý sức khỏe học đường</h1>
        <p>Giải pháp toàn diện cho việc theo dõi và quản lý sức khỏe của bạn</p>
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
            <div className="form-group">
              <label htmlFor="role">Vai trò</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="parent">Phụ huynh</option>
                <option value="admin">Quản trị viên</option>
                <option value="nurse">Y tá</option>
              </select>
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
  </div>
  );
};

export default Login;
