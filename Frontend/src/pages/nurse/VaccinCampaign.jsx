import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Search } from "lucide-react";
import style from "../../assets/css/VaccinCampaign.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Notification from "../../components/Notification";
import LoadingOverlay from "../../components/LoadingOverlay";
import Guidline from "../../utils/VaccinCampaignTour";

const VaccinCampaign = () => {
  // Bộ lọc thời gian và trạng thái
  // yearFilter: 0 = năm hiện tại, 1 = 1 năm gần nhất, 2 = 2 năm gần nhất, 3 = 3 năm gần nhất
  const [yearFilter, setYearFilter] = useState(1);
  const [quickFilter, setQuickFilter] = useState("all"); // 'all', 'latest', 'custom'
  const [campaigns, setCampaigns] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns"
        );
        if (res.data.status === "200") {
          const transformed = res.data.data.map((item) => ({
            id: item.campaignId,
            vaccineName: item.vaccineName,
            date: item.date,
            description: item.description,
            confirmed: item.totalVaccinationRecords,
            total: item.totalConsentRequests,
            status: item.statusName,
            createdByName: item.createdByName, // Thêm dòng này để lấy tên người tạo
          }));
          // Sắp xếp theo ngày giảm dần (mới nhất lên đầu)
          transformed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setCampaigns(transformed);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu chiến dịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  // FILTER + PAGINATION
  const now = new Date();
  let fromDate, toDate;
  if (yearFilter === 0) {
    fromDate = new Date(now.getFullYear(), 0, 1);
    toDate = new Date(now.getFullYear(), 11, 31);
  } else {
    fromDate = new Date(
      now.getFullYear() - yearFilter,
      now.getMonth(),
      now.getDate()
    );
    toDate = now;
  }
  let filteredCampaigns = [];
  if (quickFilter === "all") {
    filteredCampaigns = campaigns.filter((c) => {
      const matchSearch = c.vaccineName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return matchSearch && c.status !== "Đã huỷ";
    });
  } else if (quickFilter === "latest") {
    // Find the campaign with the highest id (assume id is numeric)
    const latest = campaigns.reduce(
      (max, c) => (Number(c.id) > Number(max.id) ? c : max),
      campaigns[0]
    );
    filteredCampaigns = latest ? [latest] : [];
  } else {
    filteredCampaigns = campaigns.filter((c) => {
      const matchSearch = c.vaccineName
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      const campaignDate = new Date(c.date);
      const matchDate = campaignDate >= fromDate && campaignDate <= toDate;
      const matchStatus =
        filterStatus === "Tất cả trạng thái" || c.status === filterStatus;
      return matchSearch && matchDate && matchStatus;
    });
  }
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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Guidline />

      <main style={{ flex: 1 }}>
        <div className={style.campaignPage}>
          {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
          <div className={style.pageHeader}>
            <div>
              <h1>
                <span className={style.textBlack}>Quản lý</span>
                <span className={style.textAccent}> tiêm chủng</span>
              </h1>
            </div>
          </div>
          {/* FILTERS */}
          <div className={style.filterRow}>
            <div className={style.searchBox}>
              <Search size={16} />
              <input
                id="search-campaign"
                placeholder="Tìm kiếm chiến dịch..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setQuickFilter("custom");
                  setCurrentPage(1);
                }}
                className={style.inputSearch}
              />
            </div>
            <select
              id="filter-year"
              className={style.filterDropdown}
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(Number(e.target.value));
                setQuickFilter("custom");
                setCurrentPage(1);
              }}
              style={{ marginRight: 8 }}
            >
              <option value={0}>Năm hiện tại</option>
              <option value={1}>1 năm gần nhất</option>
              <option value={2}>2 năm gần nhất</option>
              <option value={3}>3 năm gần nhất</option>
            </select>
            <select
              id="filter-status"
              className={style.filterDropdown}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setQuickFilter("custom");
                setCurrentPage(1);
              }}
              style={{ marginRight: 8 }}
            >
              <option>Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Chưa bắt đầu</option>
              <option>Đã hoàn thành</option>
              <option>Đã huỷ</option>
            </select>
            <button
              id="show-all"
              style={{
                background: quickFilter === "all" ? "#23b7b7" : "#eee",
                color: quickFilter === "all" ? "#fff" : "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
                marginRight: 8,
              }}
              onClick={() => {
                setQuickFilter("all");
                setCurrentPage(1);
              }}
            >
              Hiển thị tất cả
            </button>
            <button
              id="latest-campaign"
              style={{
                background: quickFilter === "latest" ? "#23b7b7" : "#eee",
                color: quickFilter === "latest" ? "#fff" : "#333",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                cursor: "pointer",
              }}
              onClick={() => {
                setQuickFilter("latest");
                setCurrentPage(1);
              }}
            >
              Chiến dịch vừa tạo
            </button>
          </div>
          {/* CARD GRID */}
          <div className={style.campaignCardList}>
            {loading ? (
              <div style={{ padding: 32, textAlign: "center", width: "100%" }}>
                Đang tải dữ liệu...
              </div>
            ) : currentCampaigns.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", width: "100%" }}>
                Không có dữ liệu chiến dịch.
              </div>
            ) : (
              currentCampaigns.map((c) => (
                <div
                  key={c.id}
                  className={`${style.campaignCard} campaignCard`}
                >
                  <div className={style.cardHeader}>
                    <div className={style.cardTitle}>{c.vaccineName}</div>
                  </div>
                  <div className={style.cardBody}>
                    <div>
                      <b>Ngày tiêm:</b> {c.date}
                    </div>
                    <div>
                      <b>Mô tả:</b> {c.description}
                    </div>
                    <div>
                      <b>Người tạo:</b> {c.createdByName}
                    </div>
                  </div>
                  <div className={style.cardFooter}>
                    {c.status === "Chưa bắt đầu" ? (
                      <span className={style.statusBadgeWaiting}>
                        Chưa bắt đầu
                      </span>
                    ) : c.status === "Đang diễn ra" ? (
                      <span className={style.statusBadgeActive}>
                        Đang diễn ra
                      </span>
                    ) : c.status === "Đã hoàn thành" ? (
                      <span className={style.statusBadgeDone}>
                        Đã hoàn thành
                      </span>
                    ) : (
                      <span className={style.statusBadgeCancel}>Đã huỷ</span>
                    )}

                    {(c.status === "Đang diễn ra" ||
                      c.status === "Đã hoàn thành" ||
                      c.status === "Chưa bắt đầu") && (
                      <Link to={`/vaccines/${c.id}`}>
                        <button
                          className={`${style.btnDetail} btn-detail-tour`}
                        >
                          Xem chi tiết
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {/* PAGINATION */}
          <div className={style.pagination}>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={style.pageBtn}
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={
                  currentPage === i + 1
                    ? `${style.activePage} ${style.pageBtn}`
                    : style.pageBtn
                }
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={style.pageBtn}
            >
              »
            </button>
          </div>
          <Notification />
        </div>
      </main>
    </div>
  );
};

export default VaccinCampaign;
