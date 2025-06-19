import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../assets/css/CampaignDetail.module.css";
import * as XLSX from "xlsx";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendResult, setSendResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isChuaBatDau = (status) => status === "Chưa bắt đầu";
  const isDangDienRa = (status) => status === "Đang diễn ra";
  const isDaHoanThanh = (status) => status === "Đã hoàn thành";
  const isDaHuy = (status) => status === "Đã huỷ";
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns`
      );
      const campaignData = res.data.data.find(
        (item) => item.campaignId.toString() === id
      );
      setCampaign(campaignData);
    };

    const fetchConsents = async () => {
      const res = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/consent-requests`
      );
      setConsents(res.data.data);
    };

    Promise.all([fetchCampaignDetail(), fetchConsents()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

  const handleSendConsentToAll = async () => {
    try {
      const pendingStudents = consents
        .filter((c) => c.consentStatusName === "Chờ xác nhận")
        .map((c) => c.studentId);

      if (pendingStudents.length === 0) {
        alert("Tất cả phụ huynh đã được gửi phiếu xác nhận.");
        return;
      }

      const res = await axios.post(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaign.campaignId}/send-consent-bulk`,
        {
          studentIds: pendingStudents,
        }
      );

      setSendResult(res.data.data);
      setShowModal(true);
    } catch (err) {
      console.error("Gửi phiếu xác nhận thất bại:", err);
      alert("Không thể gửi phiếu xác nhận.");
    }
  };

  const handleStartCampaign = async () => {
    try {
      const agreedStudents = consents
        .filter((c) => c.consentStatusName === "Đồng ý")
        .map((c) => parseInt(c.studentId));

      if (agreedStudents.length === 0) {
        alert("Không có học sinh nào đồng ý để khởi động.");
        return;
      }

      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/activate`
      );

      alert("Chiến dịch đã được khởi động!");
      setCampaign((prev) => ({
        ...prev,
        statusName: "Đang diễn ra",
        totalVaccinationRecords: agreedStudents.length,
      }));
    } catch (err) {
      console.error("Lỗi khi khởi động chiến dịch:", err);
      alert("Không thể khởi động chiến dịch.");
    }
  };

  const handleActivateAgain = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/activate`
      );
      alert("Chiến dịch đã được kích hoạt lại.");
      setCampaign((prev) => ({
        ...prev,
        statusName: "Đang diễn ra",
      }));
    } catch (err) {
      console.error("Lỗi khi kích hoạt lại:", err);
      alert("Không thể kích hoạt lại chiến dịch.");
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/deactivate`
      );
      alert("Chiến dịch đã được đánh dấu hoàn thành.");
      setCampaign((prev) => ({
        ...prev,
        statusName: "Đã hoàn thành",
      }));
    } catch (err) {
      console.error("Lỗi khi đánh dấu hoàn thành:", err);
      alert("Không thể cập nhật trạng thái chiến dịch.");
    }
  };

  const exportToExcel = () => {
    const agreed = consents.filter((c) => c.consentStatusName === "Đồng ý");
    const rejected = consents.filter((c) => c.consentStatusName === "Từ chối");
    const pending = consents.filter(
      (c) => c.consentStatusName === "Chờ xác nhận"
    );

    // Sheet 1: Tổng quan
    const summarySheet = [
      ["Tên chiến dịch", campaign.vaccineName],
      ["Ngày tiêm", campaign.date],
      ["Tổng số phản hồi", consents.length],
      ["Số học sinh đồng ý", agreed.length],
      ["Số học sinh từ chối", rejected.length],
      ["Chưa phản hồi", pending.length],
    ];

    // Sheet 2: Chi tiết
    const detailHeader = [
      "STT",
      "Học sinh",
      "Phụ huynh",
      "Trạng thái",
      "Ngày phản hồi",
    ];
    const detailRows = consents.map((c, idx) => [
      idx + 1,
      c.studentName,
      c.parentName,
      c.consentStatusName,
      c.consentDate ? new Date(c.consentDate).toLocaleDateString() : "",
    ]);

    const wb = XLSX.utils.book_new();
    const summaryWs = XLSX.utils.aoa_to_sheet(summarySheet);
    const detailWs = XLSX.utils.aoa_to_sheet([detailHeader, ...detailRows]);

    XLSX.utils.book_append_sheet(wb, summaryWs, "Tổng quan");
    XLSX.utils.book_append_sheet(wb, detailWs, "Chi tiết phản hồi");

    XLSX.writeFile(
      wb,
      `BaoCao_TiemChung_${campaign.vaccineName.replace(/\s/g, "_")}.xlsx`
    );
  };

  if (loading || !campaign) return <p>Đang tải dữ liệu...</p>;

  const totalAgreed = consents.filter(
    (c) => c.consentStatusName === "Đồng ý"
  ).length;
  const totalRejected = consents.filter(
    (c) => c.consentStatusName === "Từ chối"
  ).length;

  const filteredConsents = consents.filter((c) => {
    if (activeTab === "approved") return c.consentStatusName === "Đồng ý";
    if (activeTab === "rejected") return c.consentStatusName === "Từ chối";
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsents = filteredConsents.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredConsents.length / itemsPerPage);
  const consentByDate = {};
  consents.forEach((c) => {
    if (c.consentDate) {
      const dateStr = new Date(c.consentDate).toDateString();
      consentByDate[dateStr] = (consentByDate[dateStr] || 0) + 1;
    }
  });

  return (
    <div className={style.container}>
      <h2>Chi tiết chiến dịch tiêm chủng</h2>
      <p>
        <strong>Tên:</strong> {campaign.vaccineName}
      </p>
      <p>
        <strong>Thời gian:</strong> {campaign.date}
      </p>
      <p>
        <strong>Mô tả:</strong> {campaign.description}
      </p>
      <p>
        <strong>Trạng thái:</strong> {campaign.statusName}
      </p>
      <p>
        <strong>Thống kê:</strong> {totalAgreed} đồng ý / {totalRejected} từ
        chối
      </p>

      <div className={style.actions}>
        {isChuaBatDau(campaign.statusName) && (
          <button className={style.btnNotify} onClick={handleSendConsentToAll}>
            Gửi phiếu xác nhận
          </button>
        )}
        {isChuaBatDau(campaign.statusName) && totalAgreed > 0 && (
          <button className={style.btnStart} onClick={handleStartCampaign}>
            Khởi động chiến dịch
          </button>
        )}
        {isDaHoanThanh(campaign.statusName) && (
          <>
            {" "}
            <button className={style.btnRestore} onClick={handleActivateAgain}>
              Kích hoạt lại
            </button>
            <button className={style.btnExport} onClick={exportToExcel}>
              Xuất Excel
            </button>
          </>
        )}
        {isDangDienRa(campaign.statusName) && (
          <button className={style.btnComplete} onClick={handleMarkAsCompleted}>
            Đánh dấu hoàn thành
          </button>
        )}
        {isDaHuy(campaign.statusName) && (
          <span className={style.cancelledTag}> Đã huỷ</span>
        )}
        <button onClick={() => navigate(`/vaccines/${id}/result`)}>
          Xem kết quả tiêm chủng
        </button>
      </div>

      <div className={style.tabRow}>
        <button
          className={activeTab === "all" ? style.activeTab : ""}
          onClick={() => {
            setActiveTab("all");
            setCurrentPage(1);
          }}
        >
          Tất cả ({consents.length})
        </button>
        <button
          className={activeTab === "approved" ? style.activeTab : ""}
          onClick={() => {
            setActiveTab("approved");
            setCurrentPage(1);
          }}
        >
          Đồng ý ({totalAgreed})
        </button>
        <button
          className={activeTab === "rejected" ? style.activeTab : ""}
          onClick={() => {
            setActiveTab("rejected");
            setCurrentPage(1);
          }}
        >
          Từ chối ({totalRejected})
        </button>
      </div>

      <table className={style.table}>
        <thead>
          <tr>
            <th>Học sinh</th>
            <th>Phụ huynh</th>
            <th>Trạng thái</th>
            <th>Ngày phản hồi</th>
          </tr>
        </thead>
        <tbody>
          {currentConsents.map((c) => (
            <tr key={c.requestId}>
              <td>{c.studentName}</td>
              <td>{c.parentName}</td>
              <td>
                <span
                  className={
                    style[`status-${c.consentStatusName.replace(/\s/g, "-")}`]
                  }
                >
                  {c.consentStatusName}
                </span>
              </td>
              <td>
                {c.consentDate
                  ? new Date(c.consentDate).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? style.activePage : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className={style.chartAndCalendar}>
        {/* Biểu đồ tỉ lệ phản hồi */}
        <div className={style.chartBox}>
          <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
            Tỉ lệ phản hồi
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Đồng ý", value: totalAgreed },
                  { name: "Từ chối", value: totalRejected },
                  {
                    name: "Chờ xác nhận",
                    value: consents.length - totalAgreed - totalRejected,
                  },
                ]}
                cx="50%"
                cy="50%"
                label
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
                <Cell fill="#facc15" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lịch phản hồi */}
        <div className={style.calendarBox}>
          <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
            Lịch phản hồi theo ngày
          </h3>
          <Calendar
            onChange={(date) => setSelectedDate(date)}
            tileContent={({ date }) => {
              const count = consentByDate[date.toDateString()];
              return count ? (
                <div
                  style={{
                    fontSize: "10px",
                    marginTop: "2px",
                    background: "#bae6fd",
                    borderRadius: "4px",
                    textAlign: "center",
                  }}
                >
                  {count} phản hồi
                </div>
              ) : null;
            }}
          />
          {selectedDate && (
            <p
              style={{
                textAlign: "center",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              Ngày được chọn: {selectedDate.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <button onClick={() => navigate(-1)} className={style.btnBack}>
        ← Quay lại
      </button>

      {showModal && sendResult && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Kết quả gửi phiếu xác nhận</h3>
            <p>
              🟢 Gửi thành công: <strong>{sendResult.successCount}</strong> /{" "}
              {sendResult.totalStudents}
            </p>
            <p>
              🔴 Thất bại: <strong>{sendResult.failedCount}</strong>
            </p>
            {sendResult.failedReasons.length > 0 && (
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "10px",
                }}
              >
                <ul>
                  {sendResult.failedReasons.map((reason, idx) => (
                    <li
                      key={idx}
                      style={{ fontSize: "14px", marginBottom: "4px" }}
                    >
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              onClick={() => setShowModal(false)}
              className={style.btnBack}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignDetail;
