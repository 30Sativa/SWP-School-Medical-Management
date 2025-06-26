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

const VaccinCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCampaigns = async () => {
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
      }
    };

    fetchCampaigns();
  }, []);

  // FILTER + PAGINATION
  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.vaccineName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (filterStatus === "Tất cả trạng thái" || c.status === filterStatus) &&
      c.status !== "Đã huỷ"
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
              <option>Tất cả</option>
              <option>Đang diễn ra</option>
              <option>Đã hoàn thành</option>
              <option>Chưa bắt đầu</option>
            </select>
          </div>

          {/* TABLE */}
          {campaigns.length === 0 ? (
            <p style={{ padding: "1rem" }}>Không có dữ liệu chiến dịch.</p>
          ) : (
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
                {currentCampaigns.map((c) => (
                  <tr key={c.id}>
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
                        <button className={style.btnDetail}>
                          Xem chi tiết
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

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
          <div
            style={{
              marginTop: "32px",
              padding: "1rem",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
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
        </div>
      </main>
    </div>
  );
};

export default VaccinCampaign;
