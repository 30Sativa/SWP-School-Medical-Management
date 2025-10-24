import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const getUserInfo = () => {
  let fullname = localStorage.getItem("fullname") || localStorage.getItem("fullName") || "";
  const role = localStorage.getItem("role") || "";
  const avatar = localStorage.getItem("avatar") || "";
  const token = localStorage.getItem("token") || "";
  if (!fullname) fullname = "Người dùng";
  return { fullname, role, avatar, token };
};

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();
  const { fullname, role, avatar, token } = getUserInfo();

  // Chỉ logout nếu thiếu token hoặc role
  useEffect(() => {
    if (!token || !role) {
      localStorage.clear();
      navigate("/login");
    }
  }, [token, role, navigate]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Tự động logout sau 30 phút kể từ khi đăng nhập
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime && Date.now() - Number(loginTime) > 30 * 60 * 1000) {
        localStorage.clear();
        navigate("/login");
      }
    }, 60 * 1000); // Kiểm tra mỗi phút
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDashboard = () => {
    if (role === "Manager") navigate("/manager");
    else if (role === "Nurse") navigate("/nurse");
    else if (role === "Parent") navigate("/parent");
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "#fff",
          color: "#222",
          border: "1px solid #20b2aa",
          borderRadius: 24,
          padding: "4px 14px 4px 6px",
          fontWeight: 600,
          cursor: "pointer",
          minWidth: 120,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: open ? "0 2px 8px rgba(32,178,170,0.10)" : "none",
        }}
      >
        {/* Avatar */}
        {avatar ? (
          <img src={avatar} alt="avatar" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", marginRight: 8 }} />
        ) : (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#20b2aa",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
            marginRight: 8,
          }}>{getInitials(fullname)}</div>
        )}
        <span>{fullname}</span>
        <svg style={{ marginLeft: 8 }} width="18" height="18" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="#20b2aa" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 44,
            background: "#fff",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
            borderRadius: 8,
            minWidth: 180,
            zIndex: 1000,
            padding: "8px 0",
          }}
        >
          <div
            onClick={() => {
              setOpen(false);
              handleDashboard();
            }}
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              fontWeight: 500,
              color: "#222",
              borderBottom: "1px solid #eee",
            }}
          >
            My Dashboard
          </div>
          <div
            onClick={handleLogout}
            style={{
              padding: "12px 24px",
              cursor: "pointer",
              fontWeight: 500,
              color: "#e11d48",
            }}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 