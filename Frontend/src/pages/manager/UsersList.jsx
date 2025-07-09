import React, { useEffect, useState } from "react";
import { Button, Input, Table, message, Modal, Form, Select, Typography, Avatar, Tag, DatePicker } from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Edit2, Trash2 } from "lucide-react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../assets/css/userList.module.css";  // Import CSS riêng cho UserList
import axios from "axios";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const { Option } = Select;
const { Title } = Typography;

const apiUrl = "https://swp-school-medical-management.onrender.com/api/User";

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
  const [studentModalVisible, setStudentModalVisible] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [studentForm] = Form.useForm();

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
      notifyError("Không tìm thấy userId để xóa!");
      return;
    }
    // Tìm user object từ danh sách users
    const userToDelete = users.find(u => u.userID === id || u.userId === id);
    if (!userToDelete) {
      notifyError("Không tìm thấy thông tin người dùng để xóa!");
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
          notifySuccess("Xóa người dùng thành công");
          fetchUsers(); // Cập nhật lại danh sách
        } catch (err) {
          if (err.response && err.response.data && err.response.data.message) {
            notifyError("Xóa người dùng thất bại: " + err.response.data.message);
          } else {
            notifyError("Xóa người dùng thất bại!");
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
        roleID: Number(values.roleId), 
        phone: values.phone,
        email: values.email,
        address: values.address,
        isActive: true,
        isFirstLogin: true,
      };
      await axios.post(apiUrl, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notifySuccess("Thêm người dùng thành công");
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
        notifyError("Không tìm thấy userID để cập nhật!");
        return;
      }
      await axios.put(`${apiUrl}/${userID}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notifySuccess("Cập nhật người dùng thành công");
    }
    fetchUsers();
    setModalVisible(false);
  } catch (error) {
  console.error("Lỗi khi lưu người dùng:", error);
  const errorMessage = error?.response?.data?.message || "Có lỗi khi lưu người dùng!";
  
  // Kiểm tra thông điệp từ backend
  if (errorMessage.includes("Username already exists")) {
    notifyError("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác!");
  } else {
    notifyError(errorMessage);
  }
}
};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Thêm hàm handleAddStudent
  const handleAddStudent = (parent) => {
    setSelectedParent(parent);
    studentForm.resetFields(); // Reset form khi mở modal
    setStudentModalVisible(true);
  };

  const handleStudentSubmit = async (values) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...values,
        class: values.className,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        parentId: selectedParent.userID,
      };
      delete payload.className;
      await axios.post(
        "https://swp-school-medical-management.onrender.com/api/Student",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Thêm học sinh thành công!");
      setStudentModalVisible(false);
    } catch {
      message.error("Thêm học sinh thất bại!");
    }
  };

  return (
    <div className={style.layoutContainer}>
      <Notification />
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
                        {user.roleName === "Parent" ? (
                          <button className={style.addStudentBtn} onClick={() => handleAddStudent(user)}>
                            + Thêm học sinh
                          </button>
                        ) : (
                          <span className={style.addStudentBtn} style={{ visibility: "hidden" }}>+ Thêm học sinh</span>
                        )}
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
      {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
      {/* Modal thêm học sinh đặt ngoài cùng */}
      <Modal
        open={studentModalVisible}
        title="Thêm học sinh cho phụ huynh"
        onCancel={() => setStudentModalVisible(false)}
        onOk={() => studentForm.submit()}
        okText="Thêm"
      >
        <Form
          form={studentForm}
          layout="vertical"
          onFinish={handleStudentSubmit}
          validateTrigger="onChange"
        >
          <Form.Item
            name="fullName"
            label="Họ tên học sinh"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="genderId"
            label="Giới tính"
            rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
          >
            <Select>
              <Option value={0}>Nam</Option>
              <Option value={1}>Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="className"
            label="Lớp"
            rules={[{ required: true, message: "Vui lòng nhập lớp" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersList;