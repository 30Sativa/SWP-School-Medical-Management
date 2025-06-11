import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Rss, Flag, LogOut, Menu } from "lucide-react";
import style from "./Sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside className={`${style.sbSidebar} ${isOpen ? style.expanded : style.collapsed}`}>
      <button className={style.toggleBtn} onClick={toggleSidebar}>
        <Menu size={22} />
        {isOpen && <span className={style.systemName}>EduHealth</span>}
      </button>
      <nav>
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
        <NavLink to="/blog" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Rss size={20} />
          <span>Blog</span>
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => `${style.navItem} ${isActive ? style.active : ""}`}>
          <Flag size={20} />
          <span>Báo cáo thống kê</span>
        </NavLink>
        <button
          className={style.navItem}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
