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
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const VaccinCampaign = () => {
  // Bộ lọc thời gian và trạng thái
  // yearFilter: 0 = năm hiện tại, 1 = 1 năm gần nhất, 2 = 2 năm gần nhất, 3 = 3 năm gần nhất
  const [yearFilter, setYearFilter] = useState(1);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'latest', 'custom'
  const [campaigns, setCampaigns] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const itemsPerPage = 5;

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
    fromDate = new Date(now.getFullYear() - yearFilter, now.getMonth(), now.getDate());
    toDate = now;
  }
  let filteredCampaigns = [];
  if (quickFilter === 'all') {
    filteredCampaigns = campaigns.filter((c) => {
      const matchSearch = c.vaccineName.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchSearch && c.status !== "Đã huỷ";
    });
  } else if (quickFilter === 'latest') {
    const latest = campaigns.reduce((max, c) => new Date(c.date) > new Date(max.date) ? c : max, campaigns[0]);
    filteredCampaigns = latest ? [latest] : [];
  } else {
    filteredCampaigns = campaigns.filter((c) => {
      const matchSearch = c.vaccineName.toLowerCase().includes(searchKeyword.toLowerCase());
      const campaignDate = new Date(c.date);
      const matchDate = campaignDate >= fromDate && campaignDate <= toDate;
      const matchStatus = filterStatus === "Tất cả trạng thái" || c.status === filterStatus;
      return matchSearch && matchDate && matchStatus && c.status !== "Đã huỷ";
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
  const campaignStats = [
    {
      name: "Chưa bắt đầu",
      value: campaigns.filter((c) => c.status === "Chưa bắt đầu").length,
    },
    {
      name: "Đang diễn ra",
      value: campaigns.filter((c) => c.status === "Đang diễn ra").length,
    },
    {
      name: "Đã hoàn thành",
      value: campaigns.filter((c) => c.status === "Đã hoàn thành").length,
    },
  ];

  // Skeleton loading rows
  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <tr key={i} className={style.skeletonRow}>
      <td colSpan={5}>
        <div className={style.skeletonBox} style={{ height: 32, width: "100%" }} />
      </td>
    </tr>
  ));

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <div className={style.campaignPage}>
          {/* LOADING OVERLAY */}
          {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
          {/* HEADER */}
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
                placeholder="Tìm kiếm chiến dịch..."
                value={searchKeyword}
                onChange={e => { setSearchKeyword(e.target.value); setQuickFilter('custom'); setCurrentPage(1); }}
                className={style.inputSearch}
              />
            </div>
            <select
              className={style.filterDropdown}
              value={yearFilter}
              onChange={e => { setYearFilter(Number(e.target.value)); setQuickFilter('custom'); setCurrentPage(1); }}
              style={{ marginRight: 8 }}
            >
              <option value={0}>Năm hiện tại</option>
              <option value={1}>1 năm gần nhất</option>
              <option value={2}>2 năm gần nhất</option>
              <option value={3}>3 năm gần nhất</option>
            </select>
            <select
              className={style.filterDropdown}
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setQuickFilter('custom'); setCurrentPage(1); }}
              style={{ marginRight: 8 }}
            >
              <option>Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Đã hoàn thành</option>
              <option>Chưa bắt đầu</option>
            </select>
            <button style={{ background: quickFilter === 'all' ? '#23b7b7' : '#eee', color: quickFilter === 'all' ? '#fff' : '#333', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer', marginRight: 8 }} onClick={() => { setQuickFilter('all'); setCurrentPage(1); }}>Hiển thị tất cả</button>
            <button style={{ background: quickFilter === 'latest' ? '#23b7b7' : '#eee', color: quickFilter === 'latest' ? '#fff' : '#333', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setQuickFilter('latest'); setCurrentPage(1); }}>Chiến dịch vừa tạo</button>
          </div>

          {/* TABLE */}
          <div className={style.fadeInTable}>
            <table className={style.campaignTable}>
              <thead>
                <tr>
                  <th>Tên vaccine</th>
                  <th>Ngày tiêm</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? skeletonRows
                  : currentCampaigns.length === 0
                  ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                        Không có dữ liệu chiến dịch.
                      </td>
                    </tr>
                  )
                  : currentCampaigns.map((c) => (
                      <tr key={c.id} className={style.tableRow}>
                        <td>{c.vaccineName}</td>
                        <td>{c.date}</td>
                        <td>{c.description}</td>
                        <td>
                          <span
                            className={`${style.statusBadge} ${
                              style[`status-${c.status.replace(/\s/g, "-")}`]
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/vaccines/${c.id}`}>
                            <button className={style.btnDetail}>Xem chi tiết</button>
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
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
          <div
            style={{
              marginTop: "32px",
              padding: "1rem",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
            className={style.fadeInBox}
          >
            <h3 style={{ marginBottom: "16px", color: "#333" }}>
              Thống kê chiến dịch theo trạng thái
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campaignStats}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#facc15" />
                  <Cell fill="#38bdf8" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <Notification />
        </div>
      </main>
    </div>
  );
};

export default VaccinCampaign;
