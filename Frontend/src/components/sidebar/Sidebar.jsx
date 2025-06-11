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
} from "lucide-react";
import style from "./Sidebar.module.css"; // ✅ Import module

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${style.sbSidebar} ${
        isOpen ? style.expanded : style.collapsed
      }`}
    >
      <button className={style.toggleBtn} onClick={toggleSidebar}>
        <Menu size={22} />
        {isOpen && <span className={style.systemName}>EduHealth</span>}
      </button>

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
          to="/notifications"
          className={({ isActive }) =>
            `${style.navItem} ${isActive ? style.active : ""}`
          }
        >
          <Bell size={20} />
          <span>Thông báo</span>
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
