import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, Rss, Bell, LogOut, Menu, User, LayoutDashboard } from "lucide-react";
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
      <div className={style.navItem} onClick={toggleSidebar}>
        <Menu size={20} />
        {isOpen && <span className={style.systemName}>EduHealth</span>}
      </div>
      <nav>
        <div
          className={style.navItem}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </div>
        <NavLink to="/manager" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <LayoutDashboard size={20} />
          <span>Bảng điều khiển</span>
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Users size={20} />
          <span>Quản lý người dùng</span>
        </NavLink>
        <NavLink to="/manager/blog" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Rss size={20} />
          <span>Quản lý Blog</span>
        </NavLink>
        <NavLink to="/sendnotifications" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Bell size={20} />
          <span>Gửi thông báo</span>
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