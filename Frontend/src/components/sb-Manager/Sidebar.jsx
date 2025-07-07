import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
import { Home, Users, ClipboardList, Rss, Flag, LogOut, Menu, Bell, ClipboardPlus, User } from "lucide-react";
=======
import { Home, Home as Home2, Users, Rss, Bell, LogOut, Menu, User, Globe } from "lucide-react";
>>>>>>> Stashed changes
import style from "./Sidebar.module.css";
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
        const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
        setUsername(name);
      } catch {
        setUsername("");
      }
    }
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside className={`${style.sbSidebar} ${isOpen ? style.expanded : style.collapsed}`}>
      {isOpen && (
        <div className={style.profileBox}>
          <div className={style.avatar}>
            <User size={18} stroke="#20b2aa" />
          </div>
          <div className={style.profileName}>{username || "Người dùng"}</div>
        </div>
      )}
      <div className={style.sidebarHeader}>
        <button className={style.toggleBtn} onClick={toggleSidebar}>
          <Menu size={22} />
          {isOpen && <span className={style.systemName}>EduHealth</span>}
        </button>
      </div>
      <nav>
        <NavLink to="/" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Globe size={20} stroke="#fff" />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink to="/manager" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Home size={20} />
          <span>Bảng điều khiển</span>
        </NavLink>
        <NavLink to="/logs" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <ClipboardList size={20} />
          <span>Nhật ký hoạt động</span>
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Users size={20} />
          <span>Danh sách người dùng</span>
        </NavLink>
        <NavLink to="/manager/blog" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Rss size={20} />
          <span>Blog</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Flag size={20} />
          <span>Báo cáo thống kê</span>
        </NavLink>
        <NavLink to="/sendnotifications" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Bell size={20} />
          <span>Gửi thông báo</span>
        </NavLink>
        {/* <NavLink
          to="/vaccination-campaigns"
          className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}
        >
          <ClipboardPlus size={20} />
          <span>Chiến dịch tiêm chủng</span>
        </NavLink>
        <NavLink
          to="/health-check-campaign"
          className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}
        >
          <ClipboardPlus size={25} />
          <span>Chiến dịch kiểm tra sức khỏe</span>
        </NavLink> */}
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