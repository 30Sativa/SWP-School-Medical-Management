import "../../assets/css/login.css";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const trimmedUsername = form.username.trim();
    const trimmedPassword = form.password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_@-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      toast.error("Tài khoản chỉ được chứa chữ, số, dấu _ , - và @!", {
      position: "top-center",
      autoClose: 2500,
      theme: "colored",
  });
  return;
}

    if (trimmedPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
      return;
    }

    try {
      setLoading(true);
      console.log("🔁 Đang gửi request đăng nhập...");
      const response = await axios.post(
        "https://swp-school-medical-management.onrender.com/api/User/login",
        { username: trimmedUsername, password: trimmedPassword }
      );

      const resData = response.data?.data;
      const token = resData?.token;

      console.log("📥 Phản hồi từ server:", response.data);

      if (
        ((response.data.message?.toLowerCase().includes("login successful") ||
          response.data.message?.toLowerCase().includes("đăng nhập thành công")) ||
          response.data.status === 200) &&
        token
      ) {
        localStorage.setItem("token", token);
        localStorage.setItem("userId", resData.userId);

        let roleName = "";

        try {
          const decoded = jwtDecode(token);
          roleName =
            decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];
          console.log("Role:", roleName);
        } catch (decodeError) {
          console.error("❌ Lỗi giải mã token:", decodeError);
          toast.error("Không xác định được vai trò người dùng.", {
            position: "top-center",
            autoClose: 2500,
            theme: "colored",
          });
          return;
        }

        localStorage.setItem("role", roleName);

        if (roleName === "Parent") {
          localStorage.setItem("fullname", resData.fullName || "Phụ huynh");
        }

        toast.success("Đăng nhập thành công!", {
          position: "top-center",
          autoClose: 2000,
          theme: "colored",
        });

        setTimeout(() => {
          if (roleName === "Parent" && resData.isFirstLogin) {
            navigate("/firstlogin", { state: { userId: resData.userId } });
            return;
          }
          navigate("/");
        }, 2000);
      } else {
        toast.error("Đăng nhập thất bại!", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      toast.error("Lỗi kết nối đến server hoặc sai thông tin đăng nhập!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <ToastContainer
      position="top-center"
      autoClose={2500}
      theme="colored"
    />
    <div className="login-page-wrapper"></div>
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
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/forgot-password");
                  }}
                >
                  Quên mật khẩu?
                </a>
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


