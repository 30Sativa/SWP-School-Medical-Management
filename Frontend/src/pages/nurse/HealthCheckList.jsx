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
import HealthCheckTour from "../../utils/HealthCheckTour";
// API URL constants
const HEALTH_CHECK_CAMPAIGN_API = "https://swp-school-medical-management.onrender.com/api/HealthCheckCampaign";

// Hàm gửi email cho phụ huynh
const sendEmailToParent = async (userId, subject, body) => {
  try {
    await axios.post(
      "https://swp-school-medical-management.onrender.com/api/Email/send-by-userid",
      {
        userId,
        subject,
        body,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    throw new Error("Gửi email thất bại");
  }
};

// Hàm gửi thông báo và email cho tất cả phụ huynh của chiến dịch
const sendNotificationToAll = async (campaign) => {
  if (!campaign) return;
  let hasError = false;
  try {
    // Lấy danh sách học sinh tham gia chiến dịch
    const studentsRes = await axios.get(
      `https://swp-school-medical-management.onrender.com/api/student/`
    );
    const students = studentsRes.data.data || [];
    await Promise.all(
      students.map(async (student) => {
        if (!student.parentId) return;
        // Gửi notification
        await axios.post(
          "https://swp-school-medical-management.onrender.com/api/Notification/send",
          {
            receiverId: student.parentId,
            title: "Thông báo kiểm tra sức khỏe",
            message: `Học sinh ${student.fullName} sẽ tham gia chiến dịch kiểm tra sức khỏe: ${campaign.title}.\nMô tả: ${campaign.description}.\nNgày kiểm tra: ${campaign.date}`,
            typeId: 2,
            isRead: false,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        // Gửi email
        try {
          await sendEmailToParent(
            student.parentId,
            "Thông báo kiểm tra sức khỏe học sinh",
            `Học sinh ${student.fullName} sẽ tham gia chiến dịch kiểm tra sức khỏe: ${campaign.title}.\nMô tả: ${campaign.description}.\nNgày kiểm tra: ${campaign.date}`
          );
        } catch {
          hasError = true;
        }
      })
    );
    if (hasError) {
      notifyError("Một số email gửi thất bại. Vui lòng kiểm tra lại!");
    } else {
      notifySuccess("Đã gửi thông báo và email cho tất cả phụ huynh!");
    }
  } catch (error) {
    console.error("Lỗi khi gửi thông báo/email hàng loạt:", error);
    notifyError("Gửi thông báo/email thất bại. Vui lòng thử lại!");
  }
};

const HealthCheckList = () => {
  // Bộ lọc thời gian và trạng thái
  // yearFilter: 0 = năm hiện tại, 1 = 1 năm gần nhất, 2 = 2 năm gần nhất, 3 = 3 năm gần nhất
  const [yearFilter, setYearFilter] = useState(1);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all', 'latest', 'custom'
  const [campaigns, setCampaigns] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState(""); // Tìm kiếm theo tiêu đề
  const [filterStatus, setFilterStatus] = useState("Tất cả trạng thái"); // Tìm kiếm theo trạng thái
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const itemsPerPage = 9;

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
        } else {
          setCampaigns([]);
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
      const matchSearch = c.title.toLowerCase().includes(searchKeyword.toLowerCase());
      return matchSearch;
    });
  } else if (quickFilter === 'latest') {
    const latest = campaigns.reduce((max, c) => new Date(c.date) > new Date(max.date) ? c : max, campaigns[0]);
    filteredCampaigns = latest ? [latest] : [];
  } else {
    filteredCampaigns = campaigns.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(searchKeyword.toLowerCase());
      const campaignDate = new Date(c.date);
      const matchDate = campaignDate >= fromDate && campaignDate <= toDate;
      const matchStatus = filterStatus === "Tất cả trạng thái" || c.statusName === filterStatus;
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

        // Nếu chuyển từ 'Chưa bắt đầu' sang 'Đang diễn ra', gửi thông báo cho phụ huynh
        if (newStatus === "Đang diễn ra") {
          // Lấy thông tin campaign vừa cập nhật
          const campaign = updatedCampaigns.find(c => c.id === campaignId);
          if (campaign) {
            await sendNotificationToAll(campaign);
          }
        }
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

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <HealthCheckTour/>
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
                id="search-campaign"

                placeholder="Tìm kiếm chiến dịch..."
                value={searchKeyword}
                onChange={e => { setSearchKeyword(e.target.value); setQuickFilter('custom'); setCurrentPage(1); }}
                className={style.inputSearch}
              />
            </div>
            <select
            id="filter-year"
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
            id="filter-status"
              className={style.filterDropdown}
              value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setQuickFilter('custom'); setCurrentPage(1); }}
              style={{ marginRight: 8 }}
            >
              <option>Tất cả trạng thái</option>
              <option>Đang diễn ra</option>
              <option>Chưa bắt đầu</option>
              <option>Đã hoàn thành</option>
              <option>Đã huỷ</option>
            </select>
            <button id="btn-show-all" style={{ background: quickFilter === 'all' ? '#23b7b7' : '#eee', color: quickFilter === 'all' ? '#fff' : '#333', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer', marginRight: 8 }} onClick={() => { setQuickFilter('all'); setCurrentPage(1); }}>Hiển thị tất cả</button>
            <button id="btn-latest" style={{ background: quickFilter === 'latest' ? '#23b7b7' : '#eee', color: quickFilter === 'latest' ? '#fff' : '#333', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={() => { setQuickFilter('latest'); setCurrentPage(1); }}>Chiến dịch vừa tạo</button>
          </div>

          {/* TABLE */}
          <div className={style.cardGrid}>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', width: '100%' }}>Đang tải dữ liệu...</div>
            ) : currentCampaigns.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', width: '100%' }}>Không có dữ liệu chiến dịch.</div>
            ) : (
              currentCampaigns.map((c) => (
                <div key={c.id} id="card-0" className={style.campaignCard}>
                  <div className={style.cardHeader}>
                    <div className={style.cardTitle}>{c.title}</div>
                  </div>
                  <div className={style.cardBody}>
                    <div><b>Ngày:</b> {new Date(c.date).toLocaleDateString()}</div>
                    <div><b>Mô tả:</b> {c.description}</div>
                    <div><b>Người tạo:</b> {c.createdByName}</div>
                  </div>
                  <div className={style.cardFooter}>
                    {c.statusName === "Chưa bắt đầu" ? (
                      <span className={style.statusBadgeWaiting}>Chưa bắt đầu</span>
                    ) : c.statusName === "Đang diễn ra" ? (
                      <span className={style.statusBadgeActive}>Đang diễn ra</span>
                    ) : c.statusName === "Đã hoàn thành" ? (
                      <span className={style.statusBadgeDone}>Đã hoàn thành</span>
                    ) : (
                      <span className={style.statusBadgeCancel}>Đã huỷ</span>
                    )}
                    {c.statusName === "Chưa bắt đầu" && (
                      <button id="btn-starts" className={style.btnDetail} onClick={() => handleStatusChange(c.id, "Đang diễn ra")}>Kích hoạt</button>
                    )}
                    {(c.statusName === "Đang diễn ra" || c.statusName === "Đã hoàn thành") && (
                      <Link to={`/healthcheck/${c.id}`}>
                        <button id="btn-detail-0" className={style.btnDetail}>Xem chi tiết</button>
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

export default HealthCheckList;
