import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../assets/css/AuthForm.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email!");
      setStatus("");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/User/forgot-password", { email });
      toast.success("Đã gửi mã OTP về email nếu hợp lệ!");
      setStatus("Gửi OTP thành công!");
      setTimeout(() => navigate("/reset-password"), 1500);
      localStorage.setItem("resetEmail", email);
    } catch  {
      toast.error("Không thể gửi OTP. Vui lòng kiểm tra lại email!");
      setStatus("Gửi OTP thất bại. Vui lòng kiểm tra lại email!");
    }
    setLoading(false);
  };

  return (
    <div className={styles["auth-form-wrapper"]}>
      <div className={styles["auth-form-box"]}>
        <h2>Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
          {status && (
            <div style={{ color: status.includes('thành công') ? '#059669' : '#ef4444', marginTop: 8, textAlign: 'center', fontWeight: 500 }}>
              {status}
            </div>
          )}
        </form>
        <div className={styles["back-link"]}>
          <a href="/login">Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
