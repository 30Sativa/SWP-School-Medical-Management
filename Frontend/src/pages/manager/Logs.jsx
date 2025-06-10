import React, { useEffect, useState } from "react";
import { Table, Typography, Button } from "antd";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/ManagerDashboard.css";

const { Title } = Typography;

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dummy data, replace with API call if available
  useEffect(() => {
    // TODO: Replace with real API call
    setLogs([
      {
        key: 1,
        user: "Nguyễn Văn A",
        action: "Đăng nhập hệ thống",
        time: "2025-06-10 08:30:00",
      },
      {
        key: 2,
        user: "Trần Thị B",
        action: "Thêm học sinh mới",
        time: "2025-06-10 09:00:00",
      },
      {
        key: 3,
        user: "Nguyễn Văn A",
        action: "Chỉnh sửa thông tin học sinh",
        time: "2025-06-10 09:15:00",
      },
    ]);
    setLoading(false);
  }, []);

  const columns = [
    {
      title: "Người thực hiện",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Hoạt động",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="userslist-container">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <Title level={3}>Nhật ký hoạt động gần đây</Title>
          <Table
            rowKey="key"
            dataSource={logs}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Logs;
