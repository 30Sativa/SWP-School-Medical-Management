import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import campaignStyle from "../../assets/css/VaccinationCampaign.module.css";
import { Table, Button, Modal, Form, Input, DatePicker, Select, message, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const apiUrl = "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns";

// Cập nhật lại các trạng thái phù hợp với backend
const statusOptions = [
  { value: 1, label: "Chưa bắt đầu" },
  { value: 2, label: "Đang diễn ra" },
  { value: 3, label: "Đã hoàn thành" },
  { value: 4, label: "Đã huỷ" },
];

const getCurrentUserId = () => localStorage.getItem("userId") || "";

const VaccinationCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      // API trả về { status, message, data: [...] }
      setCampaigns(res.data.data || []);
    } catch {
      message.error("Không thể tải danh sách chiến dịch!");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Chỉ hiển thị các chiến dịch chưa bị huỷ (statusId !== 4)
  const activeCampaigns = campaigns.filter(c => c.statusId !== 4);

  // CRUD Handlers
  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ createdBy: getCurrentUserId() });
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ ...record, date: record.date ? dayjs(record.date) : null, statusId: record.statusId, createdBy: record.createdBy });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xoá chiến dịch này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          await axios.delete(`${apiUrl}/${id}`);
          message.success("Đã xoá chiến dịch!");
          fetchCampaigns();
        } catch {
          message.error("Xoá thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editing) {
        const putData = {
          vaccineName: values.vaccineName,
          date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : undefined,
          description: values.description, // luôn lấy đúng giá trị nhập
          createdBy: getCurrentUserId(),
          statusId: Number(values.statusId),
          campaignId: editing.campaignId, // thêm campaignId đúng theo API
        };
        console.log("PUT data:", putData); // debug
        await axios.put(apiUrl, putData);
        message.success("Đã cập nhật chiến dịch!");
      } else {
        const postData = {
          vaccineName: values.vaccineName,
          date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : undefined,
          description: values.description, // luôn lấy đúng giá trị nhập
          createdBy: getCurrentUserId(),
          statusId: Number(values.statusId),
        };
        console.log("POST data:", postData); // debug
        await axios.post(apiUrl, postData);
        message.success("Đã tạo chiến dịch mới!");
      }
      setModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      // Validation error
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Tên vắc xin", dataIndex: "vaccineName", key: "vaccineName" },
    { title: "Ngày tổ chức", dataIndex: "date", key: "date" },
    { title: "Mô tả", dataIndex: "description", key: "description", render: (text) => text || "" },
    { title: "Người tạo", dataIndex: "createdByName", key: "createdByName" },
    { title: "Trạng thái", dataIndex: "statusName", key: "statusName" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 12 }}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} shape="circle" />
          {record.statusId === 2 && (
            <Button icon={<DeleteOutlined />} onClick={() => handleDeactivate(record.campaignId)} shape="circle" danger title="Ẩn chiến dịch (Huỷ)" />
          )}
          {record.statusId === 3 && (
            <Button icon={<PlusOutlined />} onClick={() => handleActivate(record.campaignId)} shape="circle" title="Kích hoạt lại chiến dịch" />
          )}
        </div>
      ),
    },
  ];

  // Hàm deactivate (chuyển statusId thành 4 - Đã huỷ)
  const handleDeactivate = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn huỷ chiến dịch này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          await axios.put(`${apiUrl}/${id}/deactivate`, {}); // backend sẽ chuyển statusId thành 4
          message.success("Đã huỷ chiến dịch!");
          fetchCampaigns();
        } catch {
          message.error("Huỷ thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Hàm activate (chuyển statusId thành 2 - Đang diễn ra)
  const handleActivate = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn kích hoạt lại chiến dịch này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          await axios.put(`${apiUrl}/${id}/activate`, {}); // backend sẽ chuyển statusId thành 2
          message.success("Đã kích hoạt lại chiến dịch!");
          fetchCampaigns();
        } catch {
          message.error("Kích hoạt lại thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent + ' ' + campaignStyle.vaccinationMain}>
        <header className={campaignStyle.headerBar}>
          <h1 className={campaignStyle.headerTitle}>Quản lý Chiến dịch Tiêm chủng</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className={campaignStyle.createBtn}>
            Thêm chiến dịch
          </Button>
        </header>
        <section className={campaignStyle.statsRow}>
          {/* Có thể thêm các stat-card như dashboard nếu muốn */}
        </section>
        <Spin spinning={loading} tip="Đang tải...">
          <Table
            columns={columns}
            dataSource={activeCampaigns}
            rowKey="campaignId"
            pagination={{ pageSize: 6 }}
            className={campaignStyle.table}
          />
        </Spin>
        <Modal
          title={editing ? "Cập nhật chiến dịch" : "Thêm chiến dịch mới"}
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={() => setModalOpen(false)}
          okText={editing ? "Cập nhật" : "Tạo mới"}
          cancelText="Huỷ"
          className={campaignStyle.modalForm}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="vaccineName" label="Tên vắc xin" rules={[{ required: true, message: "Nhập tên vắc xin" }, { whitespace: true, message: "Tên vắc xin không được để trống!" }]}> 
              <Input autoComplete="off" className={campaignStyle.input} /> 
            </Form.Item>
            <Form.Item name="date" label="Ngày tổ chức" rules={[{ required: true, message: "Chọn ngày" }]}> 
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD" 
                disabledDate={current => current && current < dayjs().startOf('day')} 
                className={campaignStyle.input}
              />
            </Form.Item>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Nhập mô tả chiến dịch" }]}> 
              <Input.TextArea rows={3} className={campaignStyle.input} /> 
            </Form.Item>
            <Form.Item name="createdBy" style={{ display: 'none' }}><Input /></Form.Item>
            <Form.Item name="statusId" label="Trạng thái" rules={[{ required: true, message: "Chọn trạng thái" }]}> 
              <Select 
                options={statusOptions}
                getPopupContainer={trigger => trigger.parentNode}
                disabled={editing && (editing.statusId === 4)}
                className={campaignStyle.input + ' ' + campaignStyle.selectCustom}
                dropdownStyle={{ borderRadius: 10, boxShadow: '0 2px 12px rgba(22,119,255,0.10)' }}
              /> 
            </Form.Item>
          </Form>
        </Modal>
      </main>
    </div>
  );
};

export default VaccinationCampaign;
