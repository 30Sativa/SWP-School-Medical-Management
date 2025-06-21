import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../../assets/css/AuthForm.module.css";

const ResetPassword = () => {
  const email = localStorage.getItem("resetEmail") || "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/User/verify-otp-reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => {
        localStorage.removeItem("resetEmail");
        navigate("/login");
      }, 1500);
    } catch {
      toast.error("OTP hoặc thông tin không hợp lệ!");
    }
    setLoading(false);
  };

  return (
    <div className={styles["auth-form-wrapper"]}>
      <div className={styles["auth-form-box"]}>
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} disabled />
          <label>Mã OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Nhập mã OTP"
          />
          <label>Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang xác nhận..." : "Đổi mật khẩu"}
          </button>
        </form>
        <div className={styles["back-link"]}>
          <a href="/login">Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
