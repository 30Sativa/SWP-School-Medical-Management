import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, Rss, Flag, LogOut, Menu } from "lucide-react";
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
        <NavLink to="/manager" className="nav-item">
          <Home size={20} />
          <span>Bảng điều khiển</span>
        </NavLink>
        <NavLink to="/logs" className="nav-item">
          <ClipboardList size={20} />
          <span>Nhật ký hoạt động</span>
        </NavLink>
        <NavLink to="/users" className="nav-item">
          <Users size={20} />
          <span>Danh sách người dùng</span>
        </NavLink>
        <NavLink to="/blog" className="nav-item">
          <Rss size={20} />
          <span>Blog</span>
        </NavLink>
        <NavLink to="/reports" className="nav-item">
          <Flag size={20} />
          <span>Báo cáo thống kê</span>
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
