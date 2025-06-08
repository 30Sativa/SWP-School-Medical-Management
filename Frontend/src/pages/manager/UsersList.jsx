import React, { useEffect, useState } from "react";
import {
    Layout,
    Menu,
    Table,
    Avatar,
    Tag,
    Button,
    Input,
    Typography,
    message,
    Modal,
    Form,
    Select,
} from "antd";
import {
    DashboardOutlined,
    FileTextOutlined,
    TeamOutlined,
    ReadOutlined,
    BarChartOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    BellOutlined,
    QuestionCircleOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const sidebarItems = [
    { key: "dashboard", icon: <DashboardOutlined />, label: "Bảng điều khiển", route: "/manager" },
    { key: "logs", icon: <FileTextOutlined />, label: "Nhật ký hoạt động", route: "/logs" },
    { key: "users", icon: <TeamOutlined />, label: "Danh sách người dùng", route: "/users" },
    { key: "blog", icon: <ReadOutlined />, label: "Blog", route: "/blog" },
    { key: "reports", icon: <BarChartOutlined />, label: "Báo cáo thống kê", route: "/reports" },
];

const UsersList = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

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

// const fetchUsers = async () => {                                        //Hàm lấy danh sách người dùng
//   try {
//     setLoading(true);
//     const res = await fetch('/api/users'); // gọi API thật
//     if (!res.ok) throw new Error('Lỗi tải danh sách người dùng');
//     const data = await res.json();
//     setUsers(data);
//   } catch (err) {
//     message.error(err.message || 'Lỗi không xác định');
//   } finally {
//     setLoading(false);
//   }
// };


    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            user.email.toLowerCase().includes(searchText.toLowerCase()) ||
            user.phone.includes(searchText)
    );

//     const updateUser = async (id, updatedData) => {                  //Hàm cập nhật người dùng
//   try {
//     setLoading(true);
//     const res = await fetch(`/api/users/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(updatedData),
//     });
//     if (!res.ok) throw new Error('Cập nhật người dùng thất bại');
//     message.success('Cập nhật người dùng thành công');
//     await fetchUsers(); // cập nhật danh sách sau khi sửa
//   } catch (err) {
//     message.error(err.message || 'Lỗi không xác định');
//   } finally {
//     setLoading(false);
//   }
// };

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

//     const deleteUser = async (id) => {                            //Hàm xóa người dùng
//   try {
//     setLoading(true);
//     const res = await fetch(`/api/users/${id}`, {
//       method: 'DELETE',
//     });
//     if (!res.ok) throw new Error('Xóa người dùng thất bại');
//     message.success('Xóa người dùng thành công');
//     await fetchUsers(); // cập nhật danh sách sau khi xóa
//   } catch (err) {
//     message.error(err.message || 'Lỗi không xác định');
//   } finally {
//     setLoading(false);
//   }
// };


    const handleDelete = (user) => {
  confirm({
    title: `Bạn có chắc muốn xóa người dùng "${user.name}"?`,
    icon: <ExclamationCircleOutlined />,
    onOk() {
      // Giả lập xóa
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      message.success("Xóa người dùng thành công");
    },
    onCancel() {
      // không làm gì
    },
  });
};

//     const addUser = async (userData) => {                      // Hàm thêm người dùng          
//   try {
//     setLoading(true);
//     const res = await fetch('/api/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });
//     if (!res.ok) throw new Error('Thêm người dùng thất bại');
//     message.success('Thêm người dùng thành công');
//     await fetchUsers(); // cập nhật danh sách sau khi thêm
//   } catch (err) {
//     message.error(err.message || 'Lỗi không xác định');
//   } finally {
//     setLoading(false);
//   }
// };


    const handleFormSubmit = (values) => {
        if (modalMode === "add") {
            // Thêm mới (giả lập ID tự tăng)
            const newUser = {
                ...values,
                id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
                lastActive: "Mới cập nhật",
                avatar: "", // hoặc có thể thêm avatar mặc định
            };
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
                    <Avatar src={record.avatar} alt={text}>
                        {!record.avatar && text.charAt(0)}
                    </Avatar>
                    <span>{text}</span>
                </div>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
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
            filters: [
                { text: "Học sinh", value: "Học sinh" },
                { text: "Giáo viên", value: "Giáo viên" },
                { text: "Quản trị viên", value: "Quản trị viên" },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) =>
                status === "active" ? (
                    <Tag color="green">Đang hoạt động</Tag>
                ) : (
                    <Tag color="red">Không hoạt động</Tag>
                ),
            filters: [
                { text: "Đang hoạt động", value: "active" },
                { text: "Không hoạt động", value: "inactive" },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Hoạt động gần đây",
            dataIndex: "lastActive",
            key: "lastActive",
            sorter: (a, b) => new Date(a.lastActive) - new Date(b.lastActive),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => showModal("edit", record)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    />
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={240}
                style={{ background: "#1ab3b3" }}
            >
                <div
                    className="sidebar-logo"
                    style={{ color: "white", padding: 20, fontWeight: "bold", fontSize: 20 }}
                >
                    <img
                        src="/eduhealthlogo.jpg"
                        alt="EduHealth Logo"
                        style={{ width: 37, height: 41, marginRight: 10 }}
                    />
                    {!collapsed && "EduHealth"}
                </div>
                <div
                    className="sidebar-profile"
                    style={{ padding: "0 20px 20px", color: "white" }}
                >
                    <div className="profile-info">
                        <p style={{ margin: 0, fontWeight: "600", fontSize: 16 }}>
                            Nguyễn Ngọc Viên Ka
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "#c0e6e6" }}>Quản lý</p>
                    </div>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={["users"]}
                    onClick={({ key }) => {
                        const item = sidebarItems.find((i) => i.key === key);
                        if (item) navigate(item.route);
                    }}
                    items={sidebarItems.map(({ key, icon, label }) => ({
                        key,
                        icon,
                        label,
                    }))}
                    style={{ background: "transparent" }}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: "0 20px",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Input
                        placeholder="Tìm kiếm người dùng..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                        <Button type="text" icon={<QuestionCircleOutlined />} />
                        <Button type="text" icon={<BellOutlined />} />
                        <div style={{ fontWeight: "600" }}>Nguyễn Ngọc Viên Ka</div>
                    </div>
                </Header>
                <Content
                    style={{ margin: 20, background: "#fff", padding: 20, borderRadius: 8 }}
                >
                    <Title level={3}>Danh sách người dùng</Title>
                    <Button
                        type="primary"
                        style={{ marginBottom: 16 }}
                        onClick={() => showModal("add")}
                    >
                        Thêm người dùng
                    </Button>
                    <Table
                        rowKey="id"
                        dataSource={filteredUsers}
                        columns={columns}
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                    />
                </Content>

                {/* Modal thêm/sửa */}
                <Modal
                    title={modalMode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
                    visible={isModalVisible}
                    onCancel={handleModalCancel}
                    onOk={() => form.submit()}
                    okText={modalMode === "add" ? "Thêm" : "Lưu"}
                    destroyOnClose
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        initialValues={{ status: "active", role: "Học sinh" }}
                    >
                        <Form.Item
                            name="name"
                            label="Họ và tên"
                            rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Vui lòng nhập email" },
                                { type: "email", message: "Email không hợp lệ" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="phone" label="Số điện thoại">
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
                        >
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
            </Layout>
        </Layout>
    );
};

export default UsersList;
