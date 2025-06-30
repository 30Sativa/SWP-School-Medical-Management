import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/MedicationHandle.module.css";
import { Paperclip } from "lucide-react";

const MedicationHandle = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://swp-school-medical-management.onrender.com/api/MedicationRequest/all"
      );
      const all = res.data || [];
      setPendingRequests(all.filter((item) => item.status === "Chờ duyệt"));
      setApprovedRequests(all.filter((item) => item.status === "Đã duyệt"));
      setRejectedRequests(all.filter((item) => item.status === "Từ chối"));
      return all;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (requestID, statusId = 2) => {
    const nurseID = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!nurseID) {
      alert("Không tìm thấy thông tin y tá. Vui lòng đăng nhập lại.");
      return;
    }

    const payload = {
      requestId: requestID,
      statusId,
      nurseId: nurseID,
    };

    try {
      await axios.post(
        "https://swp-school-medical-management.onrender.com/api/MedicationRequest/handle",
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
    } finally {
      const all = await fetchRequests();
      if (all) {
        const stillPending = all
          .filter((item) => item.status === "Chờ duyệt")
          .some((item) => item.requestID === requestID);
        if (!stillPending) {
          alert(
            statusId === 2 ? " Đã xác nhận yêu cầu." : " Đã từ chối yêu cầu."
          );
        } else {
          alert(" Xác nhận thất bại.");
        }
      }
    }
  };

  const renderTable = (data, showActions = false) => (
    <table className={style.table}>
      <thead>
        <tr>
          <th>Học sinh</th>
          <th>Phụ huynh</th>
          <th>Tên thuốc</th>
          <th>Liều dùng</th>
          <th>Hướng dẫn</th>
          <th>Ảnh thuốc</th> {/* thêm cột mới */}
          <th>Ngày yêu cầu</th>
          <th>Trạng thái</th>
          <th>Y tá xác nhận</th>
          {showActions && <th>Hành động</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((req) => (
          <tr key={req.requestID}>
            <td>{req.studentName}</td>
            <td>{req.parentName}</td>
            <td>{req.medicationName}</td>
            <td>{req.dosage}</td>
            <td>{req.instructions}</td>
            <td>
              {req.imagePath ? (
                <a
                  href={`https://swp-school-medical-management.onrender.com${req.imagePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={style.attachmentLink}
                >
                  <Paperclip size={18} />
                </a>
              ) : (
                <span className={style.nullText}>-</span>
              )}
            </td>
            <td>{new Date(req.requestDate).toLocaleString()}</td>
            <td>
              <span
                className={`${style.statusBadge} ${
                  req.status === "Đã duyệt"
                    ? style.approved
                    : req.status === "Từ chối"
                    ? style.rejected
                    : ""
                }`}
              >
                {req.status}
              </span>
            </td>
            <td>{req.receivedByName || "-"}</td>
            {showActions && (
              <td>
                <div className={style.actionButtons}>
                  <button
                    className={style.confirmBtn}
                    onClick={() => handleConfirm(req.requestID, 2)}
                  >
                    Xác nhận
                  </button>
                  <button
                    className={style.rejectBtn}
                    onClick={() => handleConfirm(req.requestID, 3)}
                  >
                    Từ chối
                  </button>
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const paginate = (totalPages, currentPage, setPage) => (
    <div className={style.pagination}>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`${style.pageButton} ${
            currentPage === i + 1 ? style.active : ""
          }`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  const paginatedPending = pendingRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPendingPages = Math.ceil(pendingRequests.length / itemsPerPage);

  const paginatedApproved = approvedRequests.slice(
    (approvedPage - 1) * itemsPerPage,
    approvedPage * itemsPerPage
  );
  const totalApprovedPages = Math.ceil(approvedRequests.length / itemsPerPage);

  const paginatedRejected = rejectedRequests.slice(
    (rejectedPage - 1) * itemsPerPage,
    rejectedPage * itemsPerPage
  );
  const totalRejectedPages = Math.ceil(rejectedRequests.length / itemsPerPage);

  return (
    <div className={style.container}>
      <Sidebar />
      <div className={style.content}>
        <h2 className={style.title}>Danh sách yêu cầu gửi thuốc (chờ xử lý)</h2>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          renderTable(paginatedPending, true)
        )}
        {paginate(totalPendingPages, currentPage, setCurrentPage)}

        <h2 className={style.title}>Danh sách đã duyệt</h2>
        {renderTable(paginatedApproved)}
        {paginate(totalApprovedPages, approvedPage, setApprovedPage)}

        <h2 className={style.title}>Danh sách bị từ chối</h2>
        {renderTable(paginatedRejected)}
        {paginate(totalRejectedPages, rejectedPage, setRejectedPage)}
      </div>
    </div>
  );
};

export default MedicationHandle;
