import React, { useEffect, useState } from "react";
import { Button, Input, Table, message, Modal, Form, Select, Typography, Avatar, Tag } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Edit2, Trash2 } from "lucide-react";
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
      // Nếu API trả về { data: [...] } thì lấy response.data.data
      const userArr = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];
      // Lọc bỏ user đã bị soft delete (isActive === false)
      const activeUsers = userArr.filter((u) => u.isActive !== false);
      setUsers(activeUsers);
      setLoading(false);
    } catch (err) {
      message.error("Failed to fetch users");
      console.error("Fetch users error:", err, err?.response?.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when the component is mounted
  }, []);

  // Filter users by search text
  const filteredUsers = users.filter(
    (user) =>
      user.isActive !== false && // Ẩn user đã bị soft delete
      (user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.phone.includes(searchText))
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
        <div className={style.actionGroup}>
          <button className={style.editBtn} onClick={() => showModal("edit", record)}>
            <Edit2 size={16} /> Sửa
          </button>
          <button className={style.deleteBtn} onClick={() => handleDelete(record.userID)}>
            <Trash2 size={16} /> Xóa
          </button>
        </div>
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

  // Xóa người dùng qua API (soft delete)
  const handleDelete = async (userId) => {
    let id = userId;
    if (!id) {
      id = localStorage.getItem("userId");
    }
    if (!id) {
      message.error("Không tìm thấy userId để xóa!");
      return;
    }
    // Tìm user object từ danh sách users
    const userToDelete = users.find(u => u.userID === id || u.userId === id);
    if (!userToDelete) {
      message.error("Không tìm thấy thông tin người dùng để xóa!");
      return;
    }
    Modal.confirm({
      title: "Bạn có chắc muốn xóa người dùng này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        try {
          const token = localStorage.getItem("token");
          const realId = typeof id === "string" ? id.trim() : id;
          // Chuẩn bị payload đầy đủ cho API update
          const payload = {
            userID: userToDelete.userID || userToDelete.userId,
            fullName: userToDelete.fullName,
            roleID: userToDelete.role?.roleId || userToDelete.roleID || userToDelete.roleId,
            phone: userToDelete.phone,
            email: userToDelete.email,
            address: userToDelete.address,
            isActive: false,
          };
          await axios.put(`${apiUrl}/${realId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          message.success("Xóa người dùng thành công");
          fetchUsers(); // Cập nhật lại danh sách
        } catch (err) {
          if (err.response && err.response.data && err.response.data.message) {
            message.error("Xóa người dùng thất bại: " + err.response.data.message);
          } else {
            message.error("Xóa người dùng thất bại!");
          }
        }
      },
    });
  };

  // Xử lý submit form modal
const handleModalSubmit = async (values) => {
  try {
    const token = localStorage.getItem("token");
    // Lấy đúng userId từ editingUser (API trả về userId, không phải userID)
    let userID = editingUser?.userId || editingUser?.userID;
    if (modalMode === "add") {
      // Thêm người dùng mới
      const dataToSend = {
        username: values.username,
        password: values.password,
        fullName: values.fullName,
        roleID: Number(values.roleId), // Đổi tên trường cho đúng chuẩn API
        phone: values.phone,
        email: values.email,
        address: values.address,
        isActive: true,
        isFirstLogin: true,
      };
      await axios.post(apiUrl, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Thêm người dùng thành công");
    } else if (modalMode === "edit" && editingUser) {
      // Cập nhật người dùng
      const editData = {
        userID: userID, // Đúng tên trường
        fullName: values.fullName,
        roleID: Number(values.roleId),
        phone: values.phone,
        email: values.email,
        address: values.address,
        isActive: true,
      };
      if (!userID) {
        message.error("Không tìm thấy userID để cập nhật!");
        return;
      }
      await axios.put(`${apiUrl}/${userID}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Cập nhật người dùng thành công");
    }
    fetchUsers();
    setModalVisible(false);
  } catch {
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
            {loading ? (
              // Hiệu ứng skeleton loading khi đang tải dữ liệu
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className={style.skeletonRow}>
                  {Array.from({ length: 6 }).map((_, cidx) => (
                    <td key={cidx}><div className={style.skeletonCell}></div></td>
                  ))}
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage).map((user, index) => {
                const realUserId = user.userID;
                return (
                  <tr key={realUserId || index}>
                    <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>
                      <div className={style.actionGroup}>
                        <button className={style.editBtn} onClick={() => showModal("edit", user)}>
                          <Edit2 size={16} /> Sửa
                        </button>
                        <button className={style.deleteBtn} onClick={() => handleDelete(realUserId)}>
                          <Trash2 size={16} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]} 
        > 
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