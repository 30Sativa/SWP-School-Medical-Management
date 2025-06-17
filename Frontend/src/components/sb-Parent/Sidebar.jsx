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
import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <aside
      className={`${styles.sbSidebar} ${
        isOpen ? styles.expanded : styles.collapsed
      }`}
    >
      {/* DÙNG navItem để đảm bảo icon và chữ thẳng hàng tuyệt đối */}
      <div className={styles.navItem} onClick={toggleSidebar}>
        <Menu size={20} />
        {isOpen && <span className={styles.systemName}>EduHealth</span>}
      </div>

      <nav>
        <NavLink
          to="/parent"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Home size={20} />
          <span>Trang chủ</span>
        </NavLink>

        <NavLink
          to="/healthprofile"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Users size={20} />
          <span>Hồ sơ sức khỏe</span>
        </NavLink>

        <NavLink
          to="/sendmedicine"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <ClipboardList size={20} />
          <span>Gửi thuốc cho y tế</span>
        </NavLink>

        <NavLink
          to="/hisofcare"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Syringe size={20} />
          <span>Lịch sử chăm sóc</span>
        </NavLink>

        <NavLink
          to="/notiAndRep"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <Bell size={20} />
          <span>Thông báo và phản hồi</span>
        </NavLink>

        <button
          className={styles.navItem}
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
