import React, { useEffect, useState } from "react";
import axios from "axios";
// import styles from "../../assets/css/HealthCheckCampaign.module.css";
import campaignStyle from "../../assets/css/VaccinationCampaign.module.css";
import Sidebar from "../../components/sb-Manager/Sidebar";
import { Modal, Form as AntForm, Input, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { Plus, Edit2, Trash2 } from "lucide-react";

const API_BASE = "/api";
const PAGE_SIZE = 8;

const HealthCheckCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pendingCampaign, setPendingCampaign] = useState(null);
  const [formAntd] = AntForm.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/HealthCheckCampaign`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCampaigns(res.data);
    } catch {
      setCampaigns([]);
    }
    setLoading(false);
  };

  const openModal = (campaign = null) => {
    setPendingCampaign(campaign);
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      if (pendingCampaign) {
        formAntd.setFieldsValue({
          title: pendingCampaign.title,
          description: pendingCampaign.description,
          date: pendingCampaign.date ? dayjs(pendingCampaign.date) : null,
        });
      } else {
        formAntd.resetFields();
      }
    }
    // eslint-disable-next-line
  }, [showModal]);

  const getCurrentUserId = () => localStorage.getItem("userId") || "";

  const handleSubmit = async () => {
    try {
      const values = await formAntd.validateFields();
      let dateValue = values.date;
      if (!dateValue) {
        formAntd.setFields([{ name: 'date', errors: ['Vui lòng chọn ngày!'] }]);
        return;
      }
      if (typeof dateValue === 'string') {
        dateValue = dayjs(dateValue);
      }
      if (!dayjs(dateValue).isValid()) {
        formAntd.setFields([{ name: 'date', errors: ['Ngày không hợp lệ!'] }]);
        return;
      }
      let payload = {
        title: values.title,
        description: values.description,
        date: dayjs(dateValue).format("YYYY-MM-DD"),
        createdBy: getCurrentUserId(),
      };
      if (pendingCampaign) {
        await axios.put(
          `${API_BASE}/HealthCheckCampaign/${pendingCampaign.campaignId}`,
          payload,
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        message.success("Cập nhật thành công!");
      } else {
        await axios.post(`${API_BASE}/HealthCheckCampaign`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        message.success("Tạo mới thành công!");
      }
      setShowModal(false);
      fetchCampaigns();
    } catch {
      // Không cần message.error ở đây vì AntD Form đã hiển thị lỗi
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa?")) return;
    try {
      await axios.delete(`${API_BASE}/HealthCheckCampaign/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCampaigns();
      message.success("Xóa thành công!");
    } catch {
      message.error("Xóa thất bại!");
    }
  };

  // Search + Pagination logic
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchText.toLowerCase())
  );
  const totalPage = Math.ceil(filteredCampaigns.length / PAGE_SIZE);
  const pagedCampaigns = filteredCampaigns.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className={campaignStyle.layoutContainer}>
      <Sidebar />
      <main className={campaignStyle.layoutContent}>
        <header className={campaignStyle.dashboardHeaderBar}>
          <div className={campaignStyle.titleGroup}>
            <h1>
              <span className={campaignStyle.textBlack}>Danh sách</span>
              <span className={campaignStyle.textAccent}> chiến dịch kiểm tra sức khỏe</span>
            </h1>
          </div>
        </header>
        <div className={campaignStyle.header}>
          <input
            type="text"
            placeholder="Tìm kiếm chiến dịch..."
            className={campaignStyle.searchBar}
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1); }}
            style={{
              border: '2px solid #23b7b7',
              borderRadius: 12,
              padding: '10px 16px',
              fontSize: 16,
              outline: 'none',
              boxShadow: '0 2px 12px #23b7b71a',
              background: '#f9fefe',
              transition: 'border-color 0.2s',
              marginRight: 16,
              width: 320,
              maxWidth: '100%',
            }}
            onFocus={e => e.target.style.borderColor = '#1890ff'}
            onBlur={e => e.target.style.borderColor = '#23b7b7'}
          />
          <button className={campaignStyle.addBtn} onClick={() => openModal()}>
            <Plus size={16} style={{ marginRight: 6, marginBottom: -2 }} /> Thêm chiến dịch
          </button>
        </div>
        <div className={campaignStyle.table}>
          <table className={campaignStyle.studentTable}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Mô tả</th>
                <th>Ngày tạo</th>
                <th>Người tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>Đang tải...</td></tr>
              ) : pagedCampaigns.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center' }}>Không có dữ liệu</td></tr>
              ) : (
                pagedCampaigns.map((c, idx) => (
                  <tr key={c.campaignId}>
                    <td>{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>{c.title}</td>
                    <td>{c.description}</td>
                    <td>{c.date ? dayjs(c.date).format("YYYY-MM-DD") : ""}</td>
                    <td>{c.createdByName}</td>
                    <td>
                      <div className={campaignStyle.actionGroup}>
                        <button className={campaignStyle.editBtn} onClick={() => openModal(c)}>
                          <Edit2 size={16} style={{ marginRight: 4 }} /> Sửa
                        </button>
                        <button className={campaignStyle.deleteBtn} onClick={() => handleDelete(c.campaignId)}>
                          <Trash2 size={16} style={{ marginRight: 4 }} /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination ngoài table */}
        <div className={campaignStyle.pagination}>
          {totalPage > 1 ? (
            Array.from({ length: totalPage }, (_, i) => (
              <button
                key={i}
                className={i + 1 === currentPage ? campaignStyle.activePage : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))
          ) : (
            <button className={campaignStyle.activePage}>1</button>
          )}
        </div>
        <Modal
          open={showModal}
          title={pendingCampaign ? "Chỉnh sửa chiến dịch" : "Thêm chiến dịch"}
          onCancel={() => { setShowModal(false); setPendingCampaign(null); }}
          onOk={handleSubmit}
          okText={pendingCampaign ? "Lưu" : "Tạo mới"}
          cancelText="Hủy"
          destroyOnHidden
          className={campaignStyle.modalForm}
        >
          <AntForm form={formAntd} layout="vertical" preserve={false} initialValues={{}}>
            <AntForm.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}> 
              <Input className={campaignStyle.input} />
            </AntForm.Item>
            <AntForm.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}> 
              <Input.TextArea rows={3} className={campaignStyle.input} />
            </AntForm.Item>
            <AntForm.Item name="date" label="Ngày tạo" rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}> 
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD" 
                disabledDate={current => current && current < dayjs().startOf('day')} 
                className={campaignStyle.input}
              />
            </AntForm.Item>
          </AntForm>
        </Modal>
      </main>
    </div>
  );
};

export default HealthCheckCampaign;
