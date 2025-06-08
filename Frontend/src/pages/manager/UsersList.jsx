import React, { useEffect, useState } from "react";
import { Button, Input, Table, Tag, Avatar, message, Modal, Form, Select, Typography } from "antd"; // Ensure Typography is imported
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sb-Manager/Sidebar";
import "../../assets/css/UsersList.css";

const { Option } = Select;
const { confirm } = Modal;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "Nguyễn Văn An",
          avatar: "/search-image-2.png",
          email: "nguyenvanan@gmail.com",
          phone: "0912345678",
          role: "Học sinh",
          status: "active",
          lastActive: "25/05/2025",
        },
        {
          id: 2,
          name: "Trần Thị Bình",
          avatar: "/search-image-3.png",
          email: "tranthib@gmail.com",
          phone: "0923456789",
          role: "Giáo viên",
          status: "active",
          lastActive: "24/05/2025",
        },
        {
          id: 3,
          name: "Lê Văn Cường",
          avatar: "/search-image-4.png",
          email: "levanc@gmail.com",
          phone: "0934567890",
          role: "Quản trị viên",
          status: "active",
          lastActive: "25/05/2025",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.phone.includes(searchText)
  );

  const showModal = (mode, user = null) => {
    setModalMode(mode);
    setCurrentUser(user);
    if (mode === "edit" && user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setCurrentUser(null);
  };

  const handleDelete = (id) => {
    confirm({
      title: `Bạn có chắc muốn xóa người dùng này?`,
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setUsers((prev) => prev.filter((user) => user.id !== id));
        message.success("Xóa người dùng thành công");
      },
    });
  };

  const handleFormSubmit = (values) => {
    if (modalMode === "add") {
      const newUser = { ...values, id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1, lastActive: "Mới cập nhật", avatar: "" };
      setUsers((prev) => [newUser, ...prev]);
      message.success("Thêm người dùng thành công");
    } else if (modalMode === "edit" && currentUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, ...values } : u))
      );
      message.success("Cập nhật người dùng thành công");
    }
    setIsModalVisible(false);
    setCurrentUser(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
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
        if (role === "Giáo viên") color = "green";
        else if (role === "Quản trị viên") color = "purple";
        return <Tag color={color}>{role}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === "active" ? <Tag color="green">Đang hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal("edit", record)} />
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
        </>
      ),
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="userslist-container">
      {/* Sidebar giống ManagerDashboard */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="main-content">
        <header className="userslist-header">
          <Input placeholder="Tìm kiếm người dùng..." prefix={<SearchOutlined />} style={{ width: 300 }} onChange={(e) => setSearchText(e.target.value)} allowClear />
        </header>
        <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <Typography.Title level={3}>Danh sách người dùng</Typography.Title>
          <Button type="primary" style={{ marginBottom: 16 }} onClick={() => showModal("add")}>Thêm người dùng</Button>
          <Table rowKey="id" dataSource={filteredUsers} columns={columns} loading={loading} pagination={{ pageSize: 5 }} />
        </div>
        {/* Modal thêm/sửa */}
        <Modal title={modalMode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"} visible={isModalVisible} onCancel={handleModalCancel} onOk={() => form.submit()} okText={modalMode === "add" ? "Thêm" : "Lưu"} destroyOnClose>
          <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={{ status: "active", role: "Học sinh" }}>
            <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
              <Input />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại"><Input /></Form.Item>
            <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}>
              <Select>
                <Option value="Học sinh">Học sinh</Option>
                <Option value="Giáo viên">Giáo viên</Option>
                <Option value="Quản trị viên">Quản trị viên</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
              <Select>
                <Option value="active">Đang hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UsersList;
