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
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // New state for send consent options modal (move here to fix hook order)
  const [showSendOptions, setShowSendOptions] = useState(false);

  const [campaign, setCampaign] = useState(null);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // loading khi gửi phiếu xác nhận
  const [sendResult, setSendResult] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const isChuaBatDau = (status) => status === "Chưa bắt đầu";
  const isDangDienRa = (status) => status === "Đang diễn ra";
  const isDaHoanThanh = (status) => status === "Đã hoàn thành";
  const isDaHuy = (status) => status === "Đã huỷ";

  // State cho phạm vi gửi và dữ liệu học sinh/lớp
  const [sendScope, setSendScope] = useState("all"); // "all" hoặc "class"
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [classList, setClassList] = useState([]); // Danh sách lớp
  const [studentList, setStudentList] = useState([]); // Danh sách học sinh hiển thị
  const [allStudents, setAllStudents] = useState([]); // Toàn bộ học sinh
  const [autoDeclineAfterDays, setAutoDeclineAfterDays] = useState(1); // Số ngày tự động từ chối

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

    const fetchStudents = async () => {
      try {
        const res = await axios.get("/api/Student");
        const students = Array.isArray(res.data.data) ? res.data.data : [];
        setAllStudents(students);
        // Lấy danh sách lớp duy nhất
        const uniqueClasses = Array.from(new Set(students.map(s => s.className).filter(Boolean)));
        setClassList(uniqueClasses);
        // Nếu mặc định là toàn trường thì hiển thị toàn bộ học sinh
        setStudentList(students);
      } catch {
        setAllStudents([]);
        setClassList([]);
        setStudentList([]);
      }
    };

    Promise.all([fetchCampaignDetail(), fetchConsents(), fetchStudents()]).finally(() =>
      setLoading(false)
    );
  }, [id]);

  // Khi chọn phạm vi gửi hoặc lớp thì cập nhật danh sách học sinh hiển thị
  useEffect(() => {
    if (sendScope === "all") {
      setStudentList(allStudents);
    } else if (sendScope === "class" && selectedClasses.length > 0) {
      setStudentList(allStudents.filter(s => selectedClasses.includes(s.className)));
    } else {
      setStudentList([]);
    }
  }, [sendScope, selectedClasses, allStudents]);

  // Thêm hàm gửi email qua userId
  const sendEmailToParent = async (userId, subject, body) => {
    try {
      await axios.post("/api/Email/send-by-userid", {
        userId,
        subject,
        body,
      });
    } catch (err) {
      console.error("Gửi email thất bại cho userId:", userId, err);
    }
  };

  const handleSendConsentToAll = async () => {
    try {
      setModalLoading(true);
      if (!campaign || !campaign.campaignId) {
        alert("Không tìm thấy thông tin chiến dịch.");
        return;
      }
      const res = await axios.post(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaign.campaignId}/send-consent-to-all-parents`,
        null,
        { params: { autoDeclineAfterDays } }
      );
      setSendResult(res.data.data);
      notifySuccess("Đã gửi thông báo đến cho phụ huynh.");
      setShowModal(true);
      const consentsRes = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaign.campaignId}/consent-requests`
      );
      setConsents(consentsRes.data.data);
      // Gửi email cho từng phụ huynh
      const subject = "Xác nhận tiêm chủng cho con em quý phụ huynh";
      const body = "Kính gửi quý phụ huynh, vui lòng xác nhận phiếu tiêm chủng cho con em mình trên hệ thống.";
      const parentIds = [...new Set(allStudents.map(stu => stu.parentId).filter(Boolean))];
      for (const parentId of parentIds) {
        await sendEmailToParent(parentId, subject, body);
      }
    } catch (err) {
      console.error("Gửi phiếu xác nhận thất bại:", err, err.response?.data);
      notifyError(
        "Không thể gửi phiếu xác nhận: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleStartCampaign = async () => {
    try {
      if (!isChuaBatDau(campaign.statusName)) {
        notifyError("Chỉ chiến dịch ở trạng thái 'Chưa bắt đầu' mới có thể khởi động.");
        return;
      }
      const agreedStudents = consents
        .filter((c) => c.consentStatusName === "Đồng ý")
        .map((c) => parseInt(c.studentId));

      if (agreedStudents.length === 0) {
        notifyError("Không có học sinh nào đồng ý để khởi động.");
        return;
      }

      await axios.put(
        "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns",
        {
          vaccineName: campaign.vaccineName,
          date: campaign.date,
          description: campaign.description,
          createdBy: campaign.createdBy,
          statusId: 2,
          campaignId: campaign.campaignId,
        }
      );

      notifySuccess("Chiến dịch đã được khởi động!");
      setCampaign((prev) => ({
        ...prev,
        statusName: "Đang diễn ra",
        statusId: 2,
        totalVaccinationRecords: agreedStudents.length,
      }));
    } catch (err) {
      console.error("Lỗi khi khởi động chiến dịch:", err, err.response?.data);
      notifyError(
        "Không thể khởi động chiến dịch: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/deactivate`
      );
      notifySuccess("Chiến dịch đã được đánh dấu hoàn thành.");
      setCampaign((prev) => ({
        ...prev,
        statusName: "Đã hoàn thành",
      }));
    } catch (err) {
      console.error("Lỗi khi đánh dấu hoàn thành:", err);
      notifyError("Không thể cập nhật trạng thái chiến dịch.");
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

  if (loading || !campaign || modalLoading)
    return (
      <div className={style.loadingOverlay}>
        <div className={style.spinner}></div>
      </div>
    );

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
      {/* Info cards section */}
      <div className={style.infoRow}>
        <div className={style.infoCard}>
          <div className={style.infoTitle}>Tên</div>
          <div className={style.infoValue}>{campaign.vaccineName}</div>
        </div>
        <div className={style.infoCard}>
          <div className={style.infoTitle}>Mô tả</div>
          <div className={style.infoValue}>{campaign.description}</div>
        </div>
        <div className={style.infoCard}>
          <div className={style.infoTitle}>Thời gian</div>
          <div className={style.infoValue}>{campaign.date}</div>
        </div>
        <div className={style.infoCard}>
          <div className={style.infoTitle}>Trạng thái</div>
          <div className={style.infoValue}>{campaign.statusName}</div>
        </div>
        {/* Thống kê card */}
        <div className={style.statsCard}>
          <div className={style.infoTitle}>Thống kê</div>
          <div className={style.statsRow}>
            <div className={style.statBox}>
              <span className={`${style.statNum} ${style.agree}`}>{totalAgreed}</span>
              <span className={style.statLabel}>đồng ý</span>
            </div>
            <div className={style.statBox}>
              <span className={`${style.statNum} ${style.reject}`}>{totalRejected}</span>
              <span className={style.statLabel}>từ chối</span>
            </div>
          </div>
        </div>
      </div>

      {/* Send consent options modal */}
      {showSendOptions && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0002', textAlign: 'center' }}>
            <h3>Chọn phạm vi gửi phiếu xác nhận</h3>
            <button
              style={{ margin: '16px 0', padding: '10px 24px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              onClick={async () => {
                setShowSendOptions(false);
                await handleSendConsentToAll();
              }}
            >
              Gửi cho toàn trường
            </button>
            <br />
            <button
              style={{ margin: '8px 0', padding: '10px 24px', borderRadius: 6, background: '#10b981', color: '#fff', border: 'none', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
              onClick={() => {
                setShowSendOptions(false);
                setSendScope('class');
              }}
            >
              Gửi theo lớp
            </button>
            <br />
            <button
              style={{ marginTop: 16, background: 'none', color: '#ef4444', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setShowSendOptions(false)}
            >
              Huỷ
            </button>
          </div>
        </div>
      )}

      {/* Class selection and student list only if sendScope is 'class' and campaign chưa bắt đầu */}
      {sendScope === 'class' && isChuaBatDau(campaign.statusName) && (
        <div className={style.sendClassCard}>
          <div className={style.sendClassTitle}>Gửi phiếu xác nhận theo lớp</div>
          <div className={style.sendClassRow} style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Danh sách checkbox lớp dạng lưới 4 cột */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 0', width: '100%' }}>
              {classList.map(cls => (
                <label
                  key={cls}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 500,
                    width: '24%',
                    minWidth: 120,
                    marginBottom: 8,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(cls)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedClasses(prev => [...prev, cls]);
                      } else {
                        setSelectedClasses(prev => prev.filter(c => c !== cls));
                      }
                    }}
                  />
                  {cls}
                </label>
              ))}
            </div>
          </div>
          {/* Input số ngày quy định nằm dưới, căn giữa */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px 0 0 0' }}>
            <span className={style.sendClassInputLabel}>
              Số ngày cho phép:
            </span>
            <input
              type="number"
              min={1}
              value={autoDeclineAfterDays}
              onChange={e => setAutoDeclineAfterDays(Number(e.target.value))}
              className={style.sendClassInput}
            />
            <span>ngày</span>
          </div>
          <div className={style.sendClassList}>
            <div className={style.sendClassListTitle}>
              Danh sách học sinh ({studentList.length}):
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {studentList.map(stu => (
                <li key={stu.studentId}>{stu.fullName} ({stu.className})</li>
              ))}
            </ul>
          </div>
          <button
            className={style.sendClassBtn}
            disabled={selectedClasses.length === 0}
            onClick={async () => {
              if (selectedClasses.length > 0) {
                try {
                  for (const cls of selectedClasses) {
                    await axios.post(
                      `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaign.campaignId}/send-consent-by-class`,
                      { className: cls, autoDeclineAfterDays }
                    );
                  }
                  notifySuccess("Đã gửi phiếu xác nhận cho các lớp đã chọn.");
                  // Load lại consents nếu cần
                  const consentsRes = await axios.get(
                    `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${campaign.campaignId}/consent-requests`
                  );
                  setConsents(consentsRes.data.data);
                  // Gửi email cho từng phụ huynh trong các lớp đã chọn
                  const subject = "Xác nhận tiêm chủng cho con em quý phụ huynh";
                  const body = "Kính gửi quý phụ huynh, vui lòng xác nhận phiếu tiêm chủng cho con em mình trên hệ thống.";
                  const parentIds = [...new Set(studentList.map(stu => stu.parentId).filter(Boolean))];
                  for (const parentId of parentIds) {
                    await sendEmailToParent(parentId, subject, body);
                  }
                  setSendScope('all'); // Ẩn form sau khi gửi thành công
                } catch {
                  notifyError("Gửi phiếu xác nhận thất bại!");
                }
              }
            }}
          >
            Xác nhận gửi cho lớp này
          </button>
          <button
            style={{
              background: '#f3f4f6', color: '#ef4444', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: '1.05rem', fontWeight: 600, marginTop: 8, cursor: 'pointer', transition: 'background 0.2s',
            }}
            onClick={() => setSendScope('all')}
          >
            Huỷ
          </button>
        </div>
      )}

      <div className={style.actions}>
        {isChuaBatDau(campaign.statusName) && (
          <button
            className={style.btnNotify}
            onClick={() => setShowSendOptions(true)}
          >
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

      {/* Removed chart and calendar section as requested */}

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

      <Notification />
    </div>
  );
};

export default CampaignDetail;
