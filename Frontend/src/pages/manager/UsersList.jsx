import React, { useEffect, useState } from "react";
import { Button, Input, Table, Tag, Avatar, message, Modal, Form, Select, Typography } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/UsersList.css";
import axios from "axios"; // Import axios for API requests

const { Option } = Select;
const { Title } = Typography;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại

  const [form] = Form.useForm();

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
      setUsers(response.data);  // Assuming API returns an array of users
      setLoading(false);
    } catch {
      message.error("Failed to fetch users");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  // Filter users by search text
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText)
  );

  // Pagination handler
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại khi chuyển trang
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar>{text.charAt(0)}</Avatar> {/* Show first letter as avatar */}
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
        if (role.roleName === "Nurse") color = "green";
        else if (role.roleName === "Manager") color = "purple";
        return <Tag color={color}>{role.roleName}</Tag>;
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address", // This will now display the address of the user
      key: "address",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal("edit", record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.userId)} />
        </>
      ),
    },
  ];

  const showModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    if (mode === "edit" && user) {
      form.setFieldsValue({
        ...user
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  // Xóa người dùng qua API
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: `Bạn có chắc muốn xóa người dùng này?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.delete(`${apiUrl}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.status === 200 || res.status === 204) {
            message.success("Xóa người dùng thành công");
            fetchUsers();
          } else {
            message.error("Xóa người dùng thất bại (status: " + res.status + ")");
          }
        } catch {
          message.error("Xóa người dùng thất bại");
        }
      },
    });
  };

  // Xử lý submit form chỉnh sửa/thêm
  const handleFormSubmit = async (values) => {
    if (modalMode === "add") {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post(apiUrl, {
          username: values.username,
          password: values.password,
          fullName: values.fullName,
          roleId: values.roleId,
          phone: values.phone,
          email: values.email,
          address: values.address,
          isFirstLogin: true,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          message.success("Thêm người dùng thành công");
          fetchUsers();
          setIsModalVisible(false);
        }
      } catch {
        message.error("Thêm người dùng thất bại");
      }
    } else if (modalMode === "edit" && currentUser) {
      try {
        const token = localStorage.getItem("token");
        const rest = { ...values };
        delete rest.role;
        const roleId = typeof rest.roleId === "string" ? parseInt(rest.roleId) : rest.roleId;
        const response = await axios.put(`${apiUrl}/${currentUser.userId}`, {
          ...rest,
          roleId,
          userId: currentUser.userId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          message.success("Cập nhật người dùng thành công");
          fetchUsers();
          setIsModalVisible(false);
        }
      } catch {
        message.error("Cập nhật người dùng thất bại");
      }
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="userslist-container">
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
          <Button type="primary" style={{ marginBottom: 16 }} onClick={() => showModal("add")}>Thêm người dùng</Button>
          <Table
            rowKey="userId"
            dataSource={filteredUsers}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 6,
              total: filteredUsers.length,
              showSizeChanger: false,
              current: currentPage,
              onChange: handlePageChange,
            }}
          />
        </div>
      </div>

      <Modal
        title={modalMode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        onOk={() => form.submit()}
        okText={modalMode === "add" ? "Thêm" : "Lưu"}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ status: "active", role: "Học sinh" }}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
          {modalMode === "add" && (
            <Form.Item name="roleId" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
              <Select>
                <Option value={1}>Manager</Option>
                <Option value={2}>Nurse</Option>
                <Option value={3}>Parent</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input />
          </Form.Item>
          {modalMode === "add" && (
            <>
              <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}>
                <Input />
              </Form.Item>
              <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UsersList;
