// src/components/sidebar/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Syringe,
  Bell,
  LogOut,
  Menu,
  AlertTriangle,
  Package,
  HeartPulse,
  BarChart2,
  User, // ✅ Thêm icon

  

} from "lucide-react";
import style from "./Sidebar.module.css";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name =
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUsername(name);
      } catch (error) {
        console.error("❌ Lỗi giải mã token:", error);
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${style.sbSidebar} ${
        isOpen ? style.expanded : style.collapsed
      }`}
    >
      {isOpen && (
        <div className={style.profileBox}>
          <div className={style.avatar}>
            <User size={18} stroke="#20b2aa" />
          </div>
          <div className={style.profileName}>{username || "Người dùng"}</div>
        </div>
      )}

      <div className={style.navItem} onClick={toggleSidebar}>
        <Menu size={20} />
        {isOpen && <span className={style.systemName}>EduHealth</span>}
      </div>

      <nav>
        <NavLink
          to="/nurse"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Users size={20} />
          <span>Danh sách học sinh</span>
        </NavLink>
        <NavLink
          to="/medicine"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <ClipboardList size={20} />
          <span>Quản lý thuốc</span>
        </NavLink>
        <NavLink
          to="/vaccines"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Syringe size={20} />
          <span>Tiêm chủng</span>
        </NavLink>
        <NavLink
          to="/health-check"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <HeartPulse size={20} />
          <span>Sức khỏe định kỳ</span>
        </NavLink>
        <NavLink
          to="/vaccination-campaigns"
          className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}
        >
          <Syringe size={20} />
          <span>Chiến dịch tiêm chủng</span>
        </NavLink>
        <NavLink
          to="/health-check-campaign"
          className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}
        >
          <HeartPulse size={20} />
          <span>Chiến dịch kiểm tra sức khỏe</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Bell size={20} />
          <span>Thông báo</span>
        </NavLink>
        <NavLink
          to="/supplies"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Package size={20} />
          <span>Vật tư y tế</span>
        </NavLink>
        {/* ✅ Mục Sự cố y tế */}
        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <AlertTriangle size={20} />
          <span>Sự cố y tế</span>
        </NavLink>
        <NavLink
          to="/report"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <BarChart2 size={20} />
          <span>Báo cáo thống kê</span>
        </NavLink>
        <button
          className={`${style.navItem} ${style.logoutButton}`}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          <LogOut size={20} stroke="#fff" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
