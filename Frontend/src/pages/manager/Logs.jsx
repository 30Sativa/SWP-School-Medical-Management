import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import styles from "../../assets/css/Logs.module.css";
import { ClockCircleOutlined, SearchOutlined } from "@ant-design/icons";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLogs([
        { time: "2025-06-01 08:30", action: "Đăng nhập", user: "Nguyễn Thị Lan", description: "Đăng nhập hệ thống thành công", type: "info" },
        { time: "2025-06-01 09:00", action: "Xem hồ sơ", user: "Lê Minh Sơn", description: "Xem hồ sơ sức khỏe của Nguyễn Minh An", type: "view" },
        { time: "2025-06-01 10:30", action: "Tạo yêu cầu thuốc", user: "Trần Thị Mai", description: "Tạo yêu cầu thuốc cho học sinh lớp 10A1", type: "create" },
        { time: "2025-06-01 11:00", action: "Xem lịch tiêm chủng", user: "Nguyễn Thị Lan", description: "Xem lịch tiêm chủng cho học sinh", type: "view" },
        { time: "2025-06-01 14:00", action: "Cảnh báo dịch bệnh", user: "Trần Minh Tuấn", description: "Phát hiện dịch bệnh cúm A/H1N1", type: "warning" },
      ]);
    }, 1000);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.logsPage}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className={styles.mainContent}>
        <div className={styles.logsMain}>
          {/* Header */}
          <header className={styles.headerLeft}>
            <div className={styles.dashboardHeaderBar}>
              <div className={styles.titleGroup}>
                <h1>
                  
                  <span className={styles.textBlack}>Nhật ký hoạt động</span>
                </h1>
              </div>
            </div>
          </header>

          {/* Card Logs */}
          <section className={styles.logsList}>
            <h2 className={styles.logsTitle}>Thông tin hoạt động gần đây</h2>
            <div className={styles.searchBar}>
              <div className={styles.searchContainer}>
                <SearchOutlined style={{ fontSize: 18, marginRight: 10 }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={styles.searchInput}
                />
              </div>
            </div>
            <ul className={styles.logsUl}>
              {filteredLogs.map((log, idx) => (
                <li key={idx} className={`${styles.logItem} ${styles[log.type] || ""}`}
                  onMouseEnter={e => e.currentTarget.classList.add(styles.logItemHover)}
                  onMouseLeave={e => e.currentTarget.classList.remove(styles.logItemHover)}
                >
                  <div className={styles.logIcon}>
                    {log.type === "info" && <ClockCircleOutlined style={{ color: '#06b6d4', fontSize: 22 }} />}
                    {log.type === "view" && <SearchOutlined style={{ color: '#6366f1', fontSize: 22 }} />}
                    {log.type === "create" && <ClockCircleOutlined style={{ color: '#059669', fontSize: 22 }} />}
                    {log.type === "warning" && <ClockCircleOutlined style={{ color: '#ef4444', fontSize: 22 }} />}
                  </div>
                  <div className={styles.logDetails}>
                    <div className={styles.logAction}>
                      <strong>{log.action}</strong>
                      <span className={styles.logUser}> - {log.user}</span>
                    </div>
                    <p>{log.description}</p>
                  </div>
                  <div className={styles.logTime}>{log.time}</div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
