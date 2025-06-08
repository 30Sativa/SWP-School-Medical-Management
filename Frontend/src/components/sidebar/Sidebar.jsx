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
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside className={`sb-sidebar ${isOpen ? "expanded" : "collapsed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <Menu size={22} />
      </button>

      <nav>
        <NavLink to="/nurse" className="nav-item">
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>
        <NavLink to="/students" className="nav-item">
          <Users size={20} />
          <span>Danh sách học sinh</span>
        </NavLink>
        <NavLink to="/medicine" className="nav-item">
          <ClipboardList size={20} />
          <span>Quản lý thuốc</span>
        </NavLink>
        <NavLink to="/vaccines" className="nav-item">
          <Syringe size={20} />
          <span>Tiêm chủng</span>
        </NavLink>
        <NavLink to="/notifications" className="nav-item">
          <Bell size={20} />
          <span>Thông báo</span>
        </NavLink>
        <button
          className="nav-item"
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
