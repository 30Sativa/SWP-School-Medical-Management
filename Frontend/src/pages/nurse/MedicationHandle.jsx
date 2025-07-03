import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/MedicationHandle.module.css";
import { Paperclip } from "lucide-react";
import clsx from "clsx";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";

const MedicationHandle = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [givenRequests, setGivenRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedPage, setApprovedPage] = useState(1);
  const [rejectedPage, setRejectedPage] = useState(1);
  const [givenPage, setGivenPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
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
      setApprovedRequests(
        all.filter((item) => item.status === "Đã duyệt")
      );
      setGivenRequests(
        all.filter((item) => item.status === "Đã hoàn thành")
      );
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
    if (!requestID || !nurseID || isNaN(requestID) || nurseID.length < 10) {
      alert("Thiếu hoặc sai requestID/nurseID!");
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
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
      notifySuccess("Xử lý yêu cầu thành công!");
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
      notifyError("Xử lý yêu cầu thất bại. Vui lòng thử lại sau.");
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
      setSubmitting(false);
    }
  };

  const handleMarkAsGiven = async (requestID) => {
    const token = localStorage.getItem("token");
    setSubmitting(true);
    const payload = { statusId: 4 };
    try {
      await axios.put(
        `https://swp-school-medical-management.onrender.com/api/MedicationRequest/${requestID}/status`,
        payload,
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      notifySuccess("Đã cập nhật trạng thái 'Đã cho uống'!");
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data || error.message);
      notifyError("Cập nhật trạng thái thất bại. Vui lòng thử lại sau.");
    } finally {
      await fetchRequests();
      setGivenPage(1);
      setSubmitting(false);
    }
  };

  // Skeleton row for loading state
  const renderSkeletonRows = (rowCount = 3) => (
    <>
      {[...Array(rowCount)].map((_, idx) => (
        <tr key={idx} className={style.skeletonRow}>
          {Array.from({ length: 10 }).map((_, i) => (
            <td key={i}>
              <div className={style.skeletonBox} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  const renderTable = (data, tableType = "", isLoading = false) => (
    <table className={clsx(style.table, style.fadeIn)}>
      <thead>
        <tr>
          <th>Học sinh</th>
          <th>Phụ huynh</th>
          <th>Tên thuốc</th>
          <th>Liều dùng</th>
          <th>Hướng dẫn</th>
          <th>Ảnh thuốc</th>
          <th>Ngày yêu cầu</th>
          <th>Trạng thái</th>
          <th>Y tá xác nhận</th>
          {tableType === "pending" && <th>Hành động</th>}
          {tableType === "approved" && <th>Thao tác</th>}
        </tr>
      </thead>
      <tbody>
        {isLoading
          ? renderSkeletonRows()
          : data.map((req) => (
              <tr key={req.requestID} className={style.tableRow}>
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
                      req.status === "Đã hoàn thành"
                        ? style.given
                        : req.status === "Đã duyệt"
                        ? style.approved
                        : req.status === "Từ chối"
                        ? style.rejected
                        : ""
                    }`}
                  >
                    {req.status === "Đã hoàn thành" ? "Đã cho uống" : req.status}
                  </span>
                </td>
                <td>{req.receivedByName || "-"}</td>
                {tableType === "pending" && (
                  <td>
                    <div className={style.actionButtons}>
                      <button
                        className={clsx(style.confirmBtn, style.animatedBtn)}
                        onClick={() => handleConfirm(req.requestID, 2)}
                        disabled={submitting}
                      >
                        Xác nhận
                      </button>
                      <button
                        className={clsx(style.rejectBtn, style.animatedBtn)}
                        onClick={() => handleConfirm(req.requestID, 3)}
                        disabled={submitting}
                      >
                        Từ chối
                      </button>
                    </div>
                  </td>
                )}
                {tableType === "approved" && (
                  <td>
                    {req.status === "Đã duyệt" && (
                      <button
                        className={clsx(style.confirmBtn, style.animatedBtn)}
                        onClick={() => handleMarkAsGiven(req.requestID)}
                        disabled={submitting}
                      >
                        Xác nhận uống thuốc
                      </button>
                    )}
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
          className={clsx(style.pageButton, style.animatedBtn, {
            [style.active]: currentPage === i + 1,
          })}
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

  const paginatedGiven = givenRequests.slice(
    (givenPage - 1) * itemsPerPage,
    givenPage * itemsPerPage
  );
  const totalGivenPages = Math.ceil(givenRequests.length / itemsPerPage);

  return (
    <div className={style.container}>
      <Sidebar />
      <div className={style.content}>
        {(loading || submitting) && (
          <div className={style.loadingOverlay}>
            <div className={style.customSpinner}>
              <div className={style.spinnerIcon}></div>
              <div className={style.spinnerText}>
                {loading ? "Đang tải dữ liệu..." : "Đang xử lý..."}
              </div>
            </div>
          </div>
        )}
        <Notification />
        <h2 className={style.title}>Danh sách yêu cầu gửi thuốc (chờ xử lý)</h2>
        {renderTable(paginatedPending, "pending", loading)}
        {paginate(totalPendingPages, currentPage, setCurrentPage)}

        <h2 className={style.title}>Danh sách đã duyệt</h2>
        {renderTable(paginatedApproved, "approved", loading)}
        {paginate(totalApprovedPages, approvedPage, setApprovedPage)}

        <h2 className={style.title}>Danh sách bị từ chối</h2>
        {renderTable(paginatedRejected, "", loading)}
        {paginate(totalRejectedPages, rejectedPage, setRejectedPage)}

        <h2 className={style.title}>Danh sách đã cho uống</h2>
        {renderTable(paginatedGiven, "given", loading)}
        {paginate(totalGivenPages, givenPage, setGivenPage)}
      </div>
    </div>
  );
};

export default MedicationHandle;
