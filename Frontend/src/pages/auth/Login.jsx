import "../../assets/css/Login.css";
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
      const token = resData?.token;

      console.log("📥 Phản hồi từ server:", response.data);

      if (
        response.data.message?.toLowerCase().includes("login successful") &&
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
          alert("Không xác định được vai trò người dùng.");
          return;
        }

        localStorage.setItem("role", roleName);

        toast.success("Đăng nhập thành công!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });

        setTimeout(() => {
          console.log(
            "Role for redirect:",
            roleName,
            "isFirstLogin:",
            resData.isFirstLogin,
            "resData:",
            resData
          );

          if (roleName === "Manager") {
            navigate("/manager");
          } else if (roleName === "Nurse") {
            navigate("/nurse");
          } else if (roleName === "Parent") {
            if (resData.isFirstLogin) {
              navigate("/firstlogin", { state: { userId: resData.userId } });
              return;
            }

            localStorage.setItem("parentId", resData.userId);

            (async () => {
              try {
                const studentRes = await axios.get(
                  "https://swp-school-medical-management.onrender.com/api/Student"
                );

                const studentList = studentRes.data?.data;

                if (!Array.isArray(studentList)) {
                  throw new Error("Dữ liệu học sinh không hợp lệ.");
                }

                const students = studentList.filter(
                  (s) => s.parentId === resData.userId
                );


                if (students.length > 0) {
                  localStorage.setItem(
                    "studentIds",
                    JSON.stringify(students.map((s) => s.studentId))
                  );
                  localStorage.setItem("studentId", students[0].studentId);
                } else {
                  toast.warn("Không tìm thấy học sinh thuộc tài khoản này.", {
                    position: "top-center",
                    autoClose: 3000,
                  });
                }

                navigate("/parent");
              } catch (studentError) {
                console.error("❌ Lỗi khi lấy học sinh:", studentError);
                toast.error("Lỗi khi tải danh sách học sinh.", {
                  position: "top-center",
                  autoClose: 3000,
                });
              }
            })();
          } else {
            alert("❗ Vai trò không xác định!");
            navigate("/");
          }
        }, 2000);
      } else {
        alert("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
      toast.error("Lỗi kết nối đến server hoặc sai thông tin đăng nhập!", {
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <ToastContainer />
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

