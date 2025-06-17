import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Search, MoreVertical } from "lucide-react";
import style from "../../assets/css/VaccinCampaign.module.css";

const VaccinCampaign = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: "",
    date: "",
    description: "",
  });

  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      vaccineName: "Tiêm vaccine Sởi-Rubella",
      date: "28/05/2025 - 30/05/2025",
      description: "Vaccine MR - Phòng bệnh Sởi và Rubella",
      confirmed: 398,
      total: 410,
      status: "Đang diễn ra",
    },
    {
      id: 2,
      vaccineName: "Tiêm vaccine Cúm mùa",
      date: "25/05/2025 - 27/05/2025",
      description: "Vaccine Influenza - Phòng bệnh Cúm mùa",
      confirmed: 289,
      total: 350,
      status: "Đang diễn ra",
    },
    {
      id: 3,
      vaccineName: "Tiêm vaccine Viêm gan B",
      date: "10/03/2025 - 12/03/2025",
      description: "Vaccine HepB - Phòng bệnh Viêm gan B",
      confirmed: 398,
      total: 410,
      status: "Đã hoàn thành",
    },
    {
      id: 4,
      vaccineName: "Tiêm vaccine Bạch hầu-Ho gà-Uốn ván",
      date: "15/04/2025 - 18/04/2025",
      description: "Vaccine DPT - Phòng bệnh Bạch hầu, Ho gà, Uốn ván",
      confirmed: 412,
      total: 420,
      status: "Đã hoàn thành",
    },
    {
      id: 5,
      vaccineName: "Tiêm vaccine Viêm não Nhật Bản",
      date: "20/06/2025 - 22/06/2025",
      description: "Vaccine JE - Phòng bệnh Viêm não Nhật Bản",
      confirmed: 215,
      total: 280,
      status: "Sắp diễn ra",
    },
    {
      id: 6,
      vaccineName: "Tiêm vaccine HPV",
      date: "20/06/2025 - 22/06/2025",
      description: "Vaccine HPV - Phòng bệnh ung thư cổ tử cung",
      confirmed: 156,
      total: 200,
      status: "Sắp diễn ra",
    },
  ]);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // FILTER + PAGINATION
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.vaccineName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (filterStatus === "Tất cả trạng thái" || c.status === filterStatus)
  );
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateOrUpdate = () => {
    if (!formData.vaccineName || !formData.date)
      return alert("Vui lòng nhập đầy đủ thông tin");

    if (editingId) {
      // update
      setCampaigns((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...formData } : c))
      );
    } else {
      // create
      const newCampaign = {
        id: campaigns.length + 1,
        ...formData,
        confirmed: 0,
        total: 0,
        status: "Sắp diễn ra",
      };
      setCampaigns([newCampaign, ...campaigns]);
    }

    setShowModal(false);
    setFormData({ vaccineName: "", date: "", description: "" });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm("Bạn có chắc chắn muốn xoá chiến dịch này không?")) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      vaccineName: campaign.vaccineName,
      date: campaign.date,
      description: campaign.description,
    });
    setEditingId(campaign.id);
    setShowModal(true);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <div className={style.campaignPage}>
          {/* HEADER */}
          <div className={style.pageHeader}>
            <div>
              <h1>
                <span className={style.textBlack}>Quản lý</span>
                <span className={style.textAccent}> tiêm chủng</span>
              </h1>
            </div>
            <button
              className={style.btnCreate}
              onClick={() => {
                setFormData({ vaccineName: "", date: "", description: "" });
                setEditingId(null);
                setShowModal(true);
              }}
            >
              + Tạo chiến dịch mới
            </button>
          </div>

          {/* FILTERS */}
          <div className={style.filterRow}>
            <div className={style.searchBox}>
              <Search size={16} />
              <input
                placeholder="Tìm kiếm chiến dịch..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className={style.filterDropdown}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option>Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Đã hoàn thành</option>
              <option>Sắp diễn ra</option>
            </select>
          </div>

          {/* LIST */}
          <div className={style.campaignGrid}>
            {currentCampaigns.map((c) => (
              <div className={style.campaignCard} key={c.id}>
                <div className={style.cardHeader}>
                  <h3>{c.vaccineName}</h3>
                  <span
                    className={`${style.statusBadge} ${
                      style[`status-${c.status.replace(/\s/g, "-")}`]
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className={style.vaccineType}>{c.description}</p>
                <p className={style.date}>Ngày tiêm: {c.date}</p>
                <p className={style.confirmed}>
                  Đã xác nhận: {c.confirmed}/{c.total} học sinh
                </p>
                <div className={style.cardFooter}>
                  <button className={style.btnDetail}>Xem chi tiết</button>
                  <div className={style.iconActions}>
                    <button onClick={() => handleEdit(c)}>Chỉnh sửa</button>
                    <button onClick={() => handleDelete(c.id)}>Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className={style.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? style.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>

          {/* MODAL */}
          {showModal && (
            <div className={style.modalOverlay}>
              <div className={style.modalContent}>
                <h3>
                  {editingId ? "Cập nhật chiến dịch" : "Tạo chiến dịch mới"}
                </h3>
                <input
                  type="text"
                  placeholder="Tên vắc xin"
                  value={formData.vaccineName}
                  onChange={(e) =>
                    setFormData({ ...formData, vaccineName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Ngày tiêm (VD: 01/07/2025 - 03/07/2025)"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                />
                <textarea
                  placeholder="Mô tả"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
                <div className={style.modalActions}>
                  <button onClick={handleCreateOrUpdate}>
                    {editingId ? "Cập nhật" : "Tạo"}
                  </button>
                  <button onClick={() => setShowModal(false)}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VaccinCampaign;
