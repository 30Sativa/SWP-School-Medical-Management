import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import campaignStyle from "../../assets/css/VaccinationCampaign.module.css";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Spin,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import { Edit2, Trash2, Plus } from "lucide-react";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const VACCINATION_CAMPAIGN_API =
  "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns";

// Cập nhật lại các trạng thái phù hợp với backend
const statusOptions = [
  { value: 1, label: "Chưa bắt đầu" },
  { value: 2, label: "Đang diễn ra" },
  { value: 3, label: "Đã hoàn thành" },
  { value: 4, label: "Đã huỷ" },
];

const getCurrentUserId = () => localStorage.getItem("userId") || "";

const VaccinationCampaign = () => {
  const [quickFilter, setQuickFilter] = useState("all"); // 'all', 'latest', 'custom'
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 8;
  // Bộ lọc thời gian và trạng thái
  // yearFilter: 0 = năm hiện tại, 1 = 1 năm gần nhất, 2 = 2 năm gần nhất, 3 = 3 năm gần nhất
  const [yearFilter, setYearFilter] = useState(1);
  const [statusFilter, setStatusFilter] = useState(0); // 0: tất cả

  // Fetch campaigns
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(VACCINATION_CAMPAIGN_API);
      // API trả về { status, message, data: [...] }
      setCampaigns(res.data.data || []);
    } catch {
      notifyError("Không thể tải danh sách chiến dịch!");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Chỉ hiển thị các chiến dịch chưa bị huỷ (statusId !== 4)
  const activeCampaigns = campaigns.filter((c) => c.statusId !== 4);

  // Lọc và phân trang
  // Tính mốc thời gian
  const now = dayjs();
  let fromDate, toDate;
  if (yearFilter === 0) {
    // Năm hiện tại
    fromDate = now.startOf("year");
    toDate = now.endOf("year");
  } else {
    fromDate = now.subtract(yearFilter, "year").startOf("day");
    toDate = now;
  }
  // Lọc theo search, thời gian, trạng thái
  let filteredCampaigns = [];
  if (quickFilter === "all") {
    filteredCampaigns = activeCampaigns.filter((c) => {
      const matchSearch =
        c.vaccineName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchText.toLowerCase());
      return matchSearch;
    });
  } else if (quickFilter === "latest") {
    // Chiến dịch vừa tạo: lấy campaign có id lớn nhất
    const latest = activeCampaigns.reduce(
      (max, c) => (Number(c.campaignId) > Number(max.campaignId) ? c : max),
      activeCampaigns[0]
    );
    filteredCampaigns = latest ? [latest] : [];
  } else {
    filteredCampaigns = activeCampaigns.filter((c) => {
      const matchSearch =
        c.vaccineName.toLowerCase().includes(searchText.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchText.toLowerCase());
      const campaignDate = dayjs(c.date);
      const matchDate =
        campaignDate.isAfter(fromDate) && campaignDate.isBefore(toDate);
      const matchStatus = statusFilter === 0 || c.statusId === statusFilter;
      return matchSearch && matchDate && matchStatus;
    });
  }
  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * campaignsPerPage,
    currentPage * campaignsPerPage
  );

  // CRUD Handlers
  const handleCreate = () => {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ createdBy: getCurrentUserId() });
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date) : null,
      statusId: record.statusId,
      createdBy: record.createdBy,
    });
    setModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      if (editing) {
        const putData = {
          vaccineName: values.vaccineName,
          date: values.date
            ? dayjs(values.date).format("YYYY-MM-DD")
            : undefined,
          description: values.description,
          createdBy: getCurrentUserId(),
          statusId: Number(values.statusId),
          campaignId: editing.campaignId,
        };
        await axios.put(VACCINATION_CAMPAIGN_API, putData);
        notifySuccess("Đã cập nhật chiến dịch!");
      } else {
        const postData = {
          vaccineName: values.vaccineName,
          date: values.date
            ? dayjs(values.date).format("YYYY-MM-DD")
            : undefined,
          description: values.description,
          createdBy: getCurrentUserId(),
          statusId: 1, // Luôn là "Chưa bắt đầu"
        };
        await axios.post(VACCINATION_CAMPAIGN_API, postData);
        notifySuccess("Đã tạo chiến dịch mới!");
      }
      setModalOpen(false);
      fetchCampaigns();
    } catch {
      // Validation error
    } finally {
      setLoading(false);
    }
  };

  // Hàm deactivate (chuyển statusId thành 4 - Đã huỷ)
  const handleDeactivate = async (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn huỷ chiến dịch này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          await axios.put(`${VACCINATION_CAMPAIGN_API}/${id}/deactivate`, {}); // backend sẽ chuyển statusId thành 4
          notifySuccess("Đã huỷ chiến dịch!");
          fetchCampaigns();
        } catch {
          notifyError("Huỷ thất bại!");
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
          await axios.put(`${VACCINATION_CAMPAIGN_API}/${id}/activate`, {}); // backend sẽ chuyển statusId thành 2
          notifySuccess("Đã kích hoạt lại chiến dịch!");
          fetchCampaigns();
        } catch {
          notifyError("Kích hoạt lại thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent}>
        <header className={campaignStyle.dashboardHeaderBar}>
          <div className={campaignStyle.titleGroup}>
            <h1>
              <span className={campaignStyle.textBlack}>Danh sách</span>
              <span className={campaignStyle.textAccent}>
                {" "}
                chiến dịch tiêm chủng
              </span>
            </h1>
          </div>
        </header>
        <div className={campaignStyle.header}>
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm chiến dịch..."
              className={campaignStyle.searchBar}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setQuickFilter("custom");
              }}
              onFocus={(e) => (e.target.style.borderColor = "#1890ff")}
              onBlur={(e) => (e.target.style.borderColor = "#23b7b7")}
            />
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(Number(e.target.value));
                setQuickFilter("custom");
              }}
              style={{
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 16,
                background: "#f9fefe",
                marginRight: 8,
              }}
            >
              <option value={0}>Năm hiện tại</option>
              <option value={1}>1 năm gần nhất</option>
              <option value={2}>2 năm gần nhất</option>
              <option value={3}>3 năm gần nhất</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(Number(e.target.value));
                setQuickFilter("custom");
              }}
              style={{
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 16,
                background: "#f9fefe",
                marginRight: 8,
              }}
            >
              <option value={0}>Tất cả trạng thái</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button className={campaignStyle.addBtn} onClick={handleCreate}>
              <Plus size={16} style={{ marginRight: 6, marginBottom: -2 }} />{" "}
              Thêm chiến dịch
            </button>
            <button
              className={campaignStyle.addBtn}
              style={{
                background: quickFilter === "all" ? "#23b7b7" : "#eee",
                color: quickFilter === "all" ? "#fff" : "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => setQuickFilter("all")}
            >
              Hiển thị tất cả
            </button>
            <button
              className={campaignStyle.addBtn}
              style={{
                background: quickFilter === "latest" ? "#23b7b7" : "#eee",
                color: quickFilter === "latest" ? "#fff" : "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => setQuickFilter("latest")}
            >
              Chiến dịch vừa tạo
            </button>
          </div>
        </div>
        <table className={campaignStyle.studentTable}>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên vắc xin</th>
              <th>Ngày tổ chức</th>
              <th>Mô tả</th>
              <th>Người tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <tr key={idx} className={campaignStyle.skeletonRow}>
                  {Array.from({ length: 7 }).map((_, cidx) => (
                    <td key={cidx}>
                      <div className={campaignStyle.skeletonCell}></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedCampaigns.length > 0 ? (
              paginatedCampaigns.map((c, idx) => (
                <tr key={c.campaignId}>
                  <td>{(currentPage - 1) * campaignsPerPage + idx + 1}</td>
                  <td>{c.vaccineName}</td>
                  <td>{c.date}</td>
                  <td>{c.description}</td>
                  <td>{c.createdByName}</td>
                  <td>{c.statusName}</td>
                  <td>
                    <div className={campaignStyle.actionGroup}>
                      <button
                        className={campaignStyle.editBtn}
                        onClick={() => handleEdit(c)}
                      >
                        <Edit2 size={16} /> Sửa
                      </button>
                      {c.statusId === 2 && (
                        <button
                          className={campaignStyle.deleteBtn}
                          onClick={() => handleDeactivate(c.campaignId)}
                        >
                          <Trash2 size={16} /> Ẩn
                        </button>
                      )}
                      {c.statusId === 3 && (
                        <button
                          className={campaignStyle.editBtn}
                          onClick={() => handleActivate(c.campaignId)}
                        >
                          <Plus size={16} /> Kích hoạt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Không có dữ liệu chiến dịch
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={campaignStyle.pagination}>
          {[
            ...Array(Math.ceil(filteredCampaigns.length / campaignsPerPage)),
          ].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={
                currentPage === index + 1 ? campaignStyle.activePage : ""
              }
            >
              {index + 1}
            </button>
          ))}
        </div>
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
            <Form.Item
              name="vaccineName"
              label="Tên vắc xin"
              rules={[
                { required: true, message: "Nhập tên vắc xin" },
                {
                  whitespace: true,
                  message: "Tên vắc xin không được để trống!",
                },
              ]}
            >
              <Input autoComplete="off" className={campaignStyle.input} />
            </Form.Item>
            <Form.Item
              name="date"
              label="Ngày tổ chức"
              rules={[{ required: true, message: "Chọn ngày" }]}
            >
            <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                className={campaignStyle.input}
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Nhập mô tả chiến dịch" }]}
            >
              <Input.TextArea rows={3} className={campaignStyle.input} />
            </Form.Item>
            <Form.Item name="createdBy" style={{ display: "none" }}>
              <Input />
            </Form.Item>
            {editing && (
              <Form.Item
                name="statusId"
                label="Trạng thái"
                rules={[{ required: true, message: "Chọn trạng thái" }]}
              >
                <Select
                  value={form.getFieldValue("statusId")}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  disabled={editing && editing.statusId === 4}
                  className={
                    campaignStyle.input + " " + campaignStyle.selectCustom
                  }
                  dropdownStyle={{
                    borderRadius: 12,
                    boxShadow: "0 4px 24px #23b7b71a",
                    padding: 0,
                  }}
                  size="large"
                  placeholder="Chọn trạng thái chiến dịch"
                  style={{
                    borderRadius: 12,
                    fontSize: 16,
                    background: "#f9fefe",
                    minHeight: 44,
                    boxShadow: "0 2px 12px #23b7b71a",
                    transition: "border-color 0.2s",
                  }}
                  notFoundContent={
                    <span style={{ color: "#888" }}>Không có trạng thái</span>
                  }
                >
                  {statusOptions
                    .filter((opt) => opt.value !== 1 || editing.statusId === 1)
                    .map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
        {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
        <Notification />
      </main>
    </div>
  );
};

export default VaccinationCampaign;
