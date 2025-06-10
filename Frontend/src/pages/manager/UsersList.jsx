import React, { useEffect, useState } from "react";
import { Button, Input, Table, message, Modal, Form, Select, Typography } from "antd";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [form] = Form.useForm();
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
      } catch (error) {
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
      } catch (error) {
        message.error("Cập nhật người dùng thất bại");
      }
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
          <button className={style.addBtn}>Thêm người dùng</button>
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
                    <button className={style.btn}>Sửa</button>
                    <button className={style.btn}>Xóa</button>
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
      </main>
    </div>
  );
};

export default UsersList;
