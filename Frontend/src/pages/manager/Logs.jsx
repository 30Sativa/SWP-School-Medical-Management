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
        {/* Header */}
        <header>
          <div className={styles.dashboardHeaderBar}>
            <div className={styles.titleGroup}>
              <h1>
                <span className={styles.textAccent}>|</span>
                <span className={styles.textBlack}>Logs</span>
              </h1>
              <h5 className={styles.textWelcome}>Nhật Ký hoạt động</h5>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <section className={styles.searchBar}>
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
        </section>

        {/* Logs List */}
        <section className={styles.logsList}>
          <ul>
            {filteredLogs.map((log, idx) => (
              <li key={idx} className={`${styles.logItem} ${styles[log.type] || ""}`}>
                <div className={styles.logTime}>{log.time}</div>
                <div className={styles.logDetails}>
                  <div className={styles.logAction}>
                    <strong>{log.action}</strong>
                    <span className={styles.logUser}> - {log.user}</span>
                  </div>
                  <p>{log.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default LogsPage;
