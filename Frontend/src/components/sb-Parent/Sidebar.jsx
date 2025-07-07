import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  ClipboardList,
  Syringe,
  Bell,
  LogOut,
  Menu,
  User,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("fullname") || "Tên phụ huynh";
    setUsername(name);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${styles.sbSidebar} ${
        isOpen ? styles.expanded : styles.collapsed
      }`}
    >
      {/* Logo và tên người dùng */}
      {isOpen && (
        <div className={styles.profileBox}>
          <div className={styles.avatar}>
            <User size={18} stroke="#20b2aa" />
          </div>
          <div className={styles.profileName}>{username}</div>
        </div>
      )}

      {/* Nút menu thu gọn/mở rộng */}
      <div className={styles.navItem} onClick={toggleSidebar}>
        <Menu size={20} />
        {isOpen && <span className={styles.systemName}>EduHealth</span>}
      </div>

      <nav>
        <div
          className={styles.navItem}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </div>
        <NavLink to="/healthprofile" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}> 
          <Users size={20} />
          <span>Hồ sơ sức khỏe</span>
        </NavLink>
        <NavLink to="/sendmedicine" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}> 
          <ClipboardList size={20} />
          <span>Gửi thuốc cho y tế</span>
        </NavLink>
        <NavLink to="/hisofcare" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}> 
          <Syringe size={20} />
          <span>Lịch sử chăm sóc</span>
        </NavLink>
        <NavLink to="/notification" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}> 
          <Bell size={20} />
          <span>Thông báo & phản hồi</span>
        </NavLink>
        <button
          className={`${styles.navItem} ${styles.logoutButton}`}
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
