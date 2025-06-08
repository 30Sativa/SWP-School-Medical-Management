import React, { useEffect, useState } from "react";
import { Button, Input, Table, Tag, Avatar, message, Modal, Form, Select, Typography } from "antd"; // Ensure Typography is imported
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/UsersList.css";
import axios from "axios"; // Import axios for API requests

const { Option } = Select;
const { confirm } = Modal;
const { Title } = Typography;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const apiUrl = "https://swp-school-medical-management.onrender.com/api/User"; // Replace with your actual API URL

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API response:", response.data); // Thêm log để kiểm tra dữ liệu thực tế
      setUsers(response.data);  // Nếu API trả về mảng trực tiếp thì giữ nguyên, nếu trả về object thì cần sửa lại
      setLoading(false);
    } catch {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText)
  );

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar src={record.avatar} alt={text}>{!record.avatar && text.charAt(0)}</Avatar>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        let color = "blue";
        if (role.roleName === "Giáo viên") color = "green";
        else if (role.roleName === "Quản trị viên") color = "purple";
        return <Tag color={color}>{role.roleName}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "active" ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>),
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="userslist-container">
      {/* Sidebar giống ManagerDashboard */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <header className="userslist-header">
          <Input
            placeholder="Tìm kiếm người dùng..."
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </header>
        <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <Title level={3}>Danh sách người dùng</Title>
          <Table
            rowKey="userId"
            dataSource={filteredUsers}
            columns={columns}
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersList;
