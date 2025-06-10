import React, { useEffect, useState } from "react";
import { Button, Input, Table, message, Modal, Form, Select, Typography, Avatar, Tag } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../assets/css/userList.module.css";  // Import CSS riêng cho UserList
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [modalForm] = Form.useForm();
  const usersPerPage = 10; // Số người dùng mỗi trang

  const apiUrl = "https://swp-school-medical-management.onrender.com/api/User"; 

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);  // Assuming API returns an array of users
      setLoading(false);
    } catch (error) {
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

  // Hiển thị modal thêm/sửa người dùng
const showModal = (mode, user = null) => {
  setModalMode(mode);
  setEditingUser(user);
  if (mode === "edit" && user) {
    modalForm.setFieldsValue({
      ...user,
      roleId: user.role?.roleId || user.roleId, // Set đúng roleId nếu có
    });
  } else {
    modalForm.resetFields(); // Reset form khi mở modal thêm mới
  }
  setModalVisible(true); // Mở modal
};

  // Đóng modal
  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
    modalForm.resetFields();
  };

  // Xóa người dùng qua API
  const handleDelete = async (userId) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa người dùng này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.delete(`${apiUrl}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200 || res.status === 204) {
            message.success("Xóa người dùng thành công");
            fetchUsers();
          } else {
            message.error("Xóa người dùng thất bại (status: " + res.status + ")");
          }
        } catch (error) {
          message.error("Xóa người dùng thất bại");
        }
      },
    });
  };

  // Xử lý submit form modal
const handleModalSubmit = async (values) => {
  try {
    const token = localStorage.getItem("token");
    
    // Đảm bảo roleId được gửi đúng khi thêm hoặc chỉnh sửa
    const dataToSend = {
      username: values.username,
      password: values.password,
      fullName: values.fullName,
      roleId: Number(values.roleId), // Chuyển roleId thành số
      phone: values.phone,
      email: values.email,
      address: values.address,
      isFirstLogin: true, // Cài đặt giá trị true cho lần đăng nhập đầu tiên
    };

    if (modalMode === "add") {
      // Thêm người dùng mới
      await axios.post(apiUrl, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Thêm người dùng thành công");
    } else if (modalMode === "edit" && editingUser) {
      // Cập nhật người dùng
      await axios.put(`${apiUrl}/${editingUser.userId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Cập nhật người dùng thành công");
    }

    // Sau khi thêm hoặc chỉnh sửa, gọi lại API để lấy dữ liệu mới
    fetchUsers();
    setModalVisible(false);  // Đóng modal sau khi thành công
  } catch (error) {
    message.error("Có lỗi khi lưu người dùng!");
  }
};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={style.layoutContainer}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={style.layoutContent}>
        <header className={style.dashboardHeaderBar}>
          <div className={style.titleGroup}>
            <h1>
              <span className={style.textBlack}>Danh sách</span>
              <span className={style.textAccent}> người dùng</span>
            </h1>
          </div>
        </header>

        <div className={style.header}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            className={style.searchBar}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className={style.addBtn} onClick={() => showModal("add")}>Thêm người dùng</button>
        </div>

        <table className={style.studentTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user, index) => (
                <tr key={user.userId || index}>
                  <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address}</td>
                  <td>
                    <button className={style.btn} onClick={() => showModal("edit", user)}>Sửa</button>
                    <button className={style.btn} onClick={() => handleDelete(user.userId)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Không có dữ liệu người dùng
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={style.pagination}>
          {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? style.activePage : ""}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Modal thêm/sửa người dùng */}
        <Modal
  open={modalVisible}
  title={modalMode === "add" ? "Thêm người dùng" : "Chỉnh sửa người dùng"}
  onCancel={handleModalCancel}
  onOk={() => modalForm.submit()}  // Khi nhấn Lưu hoặc Thêm sẽ gọi submit form
  okText={modalMode === "add" ? "Thêm" : "Lưu"}
>
  <Form form={modalForm} layout="vertical" onFinish={handleModalSubmit}>
    <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: "email", message: "Email không hợp lệ" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="phone" label="Số điện thoại">
      <Input />
    </Form.Item>
    <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
      <Input />
    </Form.Item>
    <Form.Item name="roleId" label="Vai trò" rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}> 
      <Select> 
        <Option value={1}>Manager</Option> 
        <Option value={2}>Nurse</Option> 
        <Option value={3}>Parent</Option> 
      </Select> 
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
      </main>
    </div>
  );
};

export default UsersList;
