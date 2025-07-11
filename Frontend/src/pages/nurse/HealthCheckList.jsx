import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { Search } from "lucide-react";
import style from "../../assets/css/HealthCheckList.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"; // Import PieChart components
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

// API URL constants
const HEALTH_CHECK_CAMPAIGN_API = "https://swp-school-medical-management.onrender.com/api/HealthCheckCampaign";

const HealthCheckList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Tìm kiếm theo tiêu đề
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái"); // Tìm kiếm theo trạng thái
  const [currentPage, setCurrentPage] = useState(1);
  const [statusCount, setStatusCount] = useState({
    "Tất cả trạng thái": 0,
    "Đang diễn ra": 0,
    "Chưa bắt đầu": 0,
    "Đã hoàn thành": 0,
    "Đã huỷ": 0,
  });
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          HEALTH_CHECK_CAMPAIGN_API
        );
        console.log("API Response from HealthCheckList:", res.data); // Log the response
        const campaignsData = Array.isArray(res.data) ? res.data : res.data.data;
        if (Array.isArray(campaignsData)) {
          const transformed = campaignsData.map((item) => ({
            id: item.campaignId,
            title: item.title,
            date: item.date,
            description: item.description,
            createdByName: item.createdByName,
            statusName: item.statusName,
          }));
          // Sắp xếp theo ngày tạo giảm dần (mới nhất lên đầu)
          transformed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setCampaigns(transformed);
          calculateStatusCount(transformed);
        } else {
          setCampaigns([]);
          calculateStatusCount([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu chiến dịch:", error);
        setCampaigns([]); // Ensure campaigns is an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const calculateStatusCount = (campaigns) => {
    const count = {
      "Tất cả trạng thái": 0,
      "Đang diễn ra": 0,
      "Chưa bắt đầu": 0,
      "Đã hoàn thành": 0,
      "Đã huỷ": 0,
    };
    campaigns.forEach((campaign) => {
      if (count[campaign.statusName] !== undefined) {
        count[campaign.statusName] += 1;
      }
    });
    setStatusCount(count);
  };

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      (filterStatus === "Tất cả trạng thái" || c.statusName === filterStatus) // Lọc theo trạng thái
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

  // Dữ liệu cho biểu đồ tròn (PieChart)
  const chartData = [
    { name: "Đang diễn ra", value: statusCount["Đang diễn ra"] },
    { name: "Chưa bắt đầu", value: statusCount["Chưa bắt đầu"] },
    { name: "Đã hoàn thành", value: statusCount["Đã hoàn thành"] },
    { name: "Đã huỷ", value: statusCount["Đã huỷ"] },
  ];

  // Màu sắc cho từng phần trong biểu đồ tròn
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#FF6347"];

  const statusMap = {
    "Chưa bắt đầu": 1,
    "Đang diễn ra": 2,
    "Đã hoàn thành": 3,
    "Đã huỷ": 4
  };

  const handleStatusChange = async (campaignId, newStatus) => {
    try {
      const apiStatus = statusMap[newStatus] || newStatus;
      const res = await axios.put(
        `${HEALTH_CHECK_CAMPAIGN_API}/${campaignId}`,
        { statusId: apiStatus }
      );
      console.log("PUT response:", res.data);

      if (res.status === 200) {
        notifySuccess("Cập nhật trạng thái thành công!");
        const updatedCampaigns = campaigns.map((campaign) =>
          campaign.id === campaignId
            ? { ...campaign, statusName: newStatus }
            : campaign
        );
        setCampaigns(updatedCampaigns);
        calculateStatusCount(updatedCampaigns);
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response.data);
        notifyError("Lỗi cập nhật trạng thái: " + (error.response.data.message || ""));
      } else {
        console.error("Lỗi khi cập nhật trạng thái chiến dịch:", error);
        notifyError("Lỗi cập nhật trạng thái.");
      }
    }
  };

  // Skeleton loading rows
  const skeletonRows = Array.from({ length: itemsPerPage }, (_, i) => (
    <tr key={i} className={style.skeletonRow}>
      <td colSpan={6}>
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
                <span className={style.textAccent}> khám sức khỏe</span>
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
                className={style.inputSearch}
              />
            </div>

            {/* Dropdown for filtering by status */}
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
              <option>Chưa bắt đầu</option>
              <option>Đã hoàn thành</option>
              <option>Đã huỷ</option>
            </select>
          </div>

          {/* TABLE */}
          <div className={style.fadeInTable}>
            <table className={style.campaignTable}>
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Mô tả</th>
                  <th>Ngày</th>
                  <th>Người tạo</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? skeletonRows
                  : currentCampaigns.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                        Không có dữ liệu chiến dịch.
                      </td>
                    </tr>
                  )
                  : currentCampaigns.map((c) => (
                      <tr key={c.id} className={style.tableRow}>
                        <td>{c.title}</td>
                        <td>{c.description}</td>
                        <td>{new Date(c.date).toLocaleDateString()}</td>
                        <td>{c.createdByName}</td>
                        <td>
                          <select
                            value={c.statusName}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={style.statusDropdown}
                          >
                            <option>Đang diễn ra</option>
                            <option>Chưa bắt đầu</option>
                            <option>Đã hoàn thành</option>
                            <option>Đã huỷ</option>
                          </select>
                        </td>
                        <td>
                          <Link to={`/healthcheck/${c.id}`}>
                            <button className={style.btnDetail}>Chi tiết</button>
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

          {/* PIE CHART */}
          <div style={{ marginTop: "30px" }} className={style.fadeInBox}>
            <h3>Biểu đồ tròn thống kê theo trạng thái chiến dịch</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
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

export default HealthCheckList;
