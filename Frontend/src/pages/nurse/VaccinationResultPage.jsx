// VaccineResult.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import style from "../../assets/css/ResultPage.module.css";
import Notification from "../../components/Notification";
import LoadingOverlay from "../../components/LoadingOverlay";
import { notifySuccess, notifyError } from "../../utils/notification";

const VaccineResult = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [campaignStatus, setCampaignStatus] = useState("");
  const [loading, setLoading] = useState(true);
  // Removed unused modalLoading state
  const [editingIndex, setEditingIndex] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}`
        );
        const statusName =
          res.data.data.statusName || res.data.data.status?.name;
        setCampaignStatus(statusName);
      } catch (error) {
        console.error("Lỗi lấy trạng thái chiến dịch:", error);
      }
    };
    fetchStatus();
  }, [id]);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/approved-consents`
        );
        const students = res.data.data || [];

        const allRecords = await Promise.all(
          students.map(async (student) => {
            try {
              const recordRes = await axios.get(
                `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/records/student/${student.studentId}`
              );
              let record = recordRes.data.data;
              if (Array.isArray(record)) {
                record = record.find(
                  (r) => String(r.campaignId) === String(id)
                );
              }
              return { ...student, ...record };
            } catch {
              return { ...student };
            }
          })
        );
        setRecords(allRecords);
      } catch (error) {
        console.error("Lỗi lấy kết quả tiêm chủng:", error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    if (campaignStatus) fetchRecords();
  }, [id, campaignStatus]);

  const handleInputChange = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
  };

  const handleSave = async (index) => {
    const r = records[index];
    try {
      await axios.post(
        "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/records",
        {
          studentId: r.studentId,
          campaignId: id,
          consentStatusId: r.consentStatusId || 2,
          vaccinationDate: r.vaccinationDate || new Date().toISOString(),
          result: r.result,
          followUpNote: r.followUpNote || "",
          isActive: true,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      notifySuccess("Lưu thành công!");
      setEditingIndex(null);
    } catch (error) {
      notifyError(
        "Lỗi khi lưu dữ liệu: " + JSON.stringify(error.response?.data)
      );
    }
  };

  const handleSendNotificationAndEmail = async (student) => {
    try {
      // Gửi notification
      const note = student.followUpNote
        ? `Ghi chú: ${student.followUpNote}`
        : "Không có ghi chú.";
      await axios.post(
        "https://swp-school-medical-management.onrender.com/api/Notification/send",
        {
          receiverId: student.parentId,
          title: "Kết quả tiêm chủng",
          message: `Học sinh ${
            student.studentName
          } đã ${student.result.toLowerCase()} trong đợt tiêm chủng.\n${note}`,
          typeId: 2,
          isRead: false,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      // Gửi email
      await axios.post(
        "https://swp-school-medical-management.onrender.com/api/Email/send-by-userid",
        {
          userId: student.parentId,
          subject: `Kết quả tiêm chủng cho học sinh ${student.studentName}`,
          body: `Học sinh ${
            student.studentName
          } đã ${student.result?.toLowerCase()} trong đợt tiêm chủng.\n${note}`,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      notifySuccess("Đã gửi thông báo và email đến phụ huynh!");
    } catch (error) {
      console.error("Lỗi khi gửi thông báo/email:", error);
      notifyError(
        "Không thể gửi thông báo/email: " + error.response?.data?.message
      );
    }
  };

  // Gửi thông báo & email hàng loạt
  const handleSendAllNotifications = async () => {
    const studentsToSend = records.filter(
      (r) =>
        r.result &&
        r.parentId !== null &&
        r.parentId !== undefined &&
        r.parentId !== "" &&
        (typeof r.parentId === "number" || typeof r.parentId === "string")
    );
    // Log các trường hợp không hợp lệ
    records.forEach((r) => {
      if (
        r.result &&
        (!r.parentId ||
          r.parentId === "" ||
          r.parentId === null ||
          r.parentId === undefined)
      ) {
        console.warn(
          "Không có parentId hợp lệ cho học sinh:",
          r.studentName,
          r
        );
      }
    });
    if (studentsToSend.length === 0) return;
    let successCount = 0;
    let failCount = 0;
    for (const student of studentsToSend) {
      if (
        !student.parentId ||
        student.parentId === "" ||
        student.parentId === null ||
        student.parentId === undefined
      ) {
        // Bỏ qua nếu không hợp lệ
        continue;
      }
      try {
        const note = student.followUpNote
          ? `Ghi chú: ${student.followUpNote}`
          : "Không có ghi chú.";
        const notificationPayload = {
          receiverId: student.parentId,
          title: "Kết quả tiêm chủng",
          message: `Học sinh ${
            student.studentName
          } đã ${student.result.toLowerCase()} trong đợt tiêm chủng.\n${note}`,
          typeId: 8,
          isRead: false,
        };
        const emailPayload = {
          userId: student.parentId,
          subject: `Kết quả tiêm chủng cho học sinh ${student.studentName}`,
          body: `Học sinh ${
            student.studentName
          } đã ${student.result?.toLowerCase()} trong đợt tiêm chủng.\n${note}`,
        };
        console.log(
          "Gửi notification cho:",
          student.studentName,
          "parentId:",
          student.parentId,
          "typeof:",
          typeof student.parentId
        );
        console.log("Notification payload:", notificationPayload);
        console.log("Email payload:", emailPayload);
        await axios.post(
          "https://swp-school-medical-management.onrender.com/api/Notification/send",
          notificationPayload,
          { headers: { "Content-Type": "application/json" } }
        );
        await axios.post(
          "https://swp-school-medical-management.onrender.com/api/Email/send-by-userid",
          emailPayload,
          { headers: { "Content-Type": "application/json" } }
        );
        successCount++;
      } catch (err) {
        failCount++;
        console.error(
          "Lỗi gửi cho:",
          student.studentName,
          "parentId:",
          student.parentId,
          err.response?.data || err.message
        );
      }
    }
    if (successCount > 0)
      notifySuccess(
        `Đã gửi thông báo & email cho ${successCount} phụ huynh thành công!`
      );
    if (failCount > 0)
      notifyError(`Không gửi được cho ${failCount} phụ huynh.`);
  };

  return (
    <div className={style.container}>
      {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
      <h2 className={style.title}>Kết quả tiêm chủng</h2>
      <button className={style.btnBack} onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      <button
        className={style.btnBack}
        style={{ marginBottom: 16, marginRight: 12 }}
        onClick={handleSendAllNotifications}
        disabled={records.filter((r) => r.result && r.parentId).length === 0}
      >
        Gửi thông báo & email hàng loạt
      </button>

      <table className={style.resultTable}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Học sinh</th>
            <th>Phụ huynh</th>
            <th>Ngày phản hồi</th>
            <th>Kết quả</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && !loading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            records.map((r, index) => (
              <tr key={r.studentId}>
                <td>{index + 1}</td>
                <td>{r.studentName}</td>
                <td>{r.parentName}</td>
                <td>
                  {r.consentDate
                    ? new Date(r.consentDate).toLocaleDateString()
                    : ""}
                </td>
                {editingIndex === index ? (
                  <>
                    <td>
                      <select
                        value={r.result || ""}
                        onChange={(e) =>
                          handleInputChange(index, "result", e.target.value)
                        }
                      >
                        <option value="">--Chọn--</option>
                        <option value="Thành công">Thành công</option>
                        <option value="Thất bại">Thất bại</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        value={r.followUpNote || ""}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "followUpNote",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSave(index)}>Lưu</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{r.result || "Chưa ghi nhận"}</td>
                    <td>{r.followUpNote || ""}</td>
                    <td>
                      {r.result && (
                        <button
                          onClick={() => setViewingIndex(index)}
                          className={style.detailBtn}
                        >
                          Xem chi tiết
                        </button>
                      )}
                      {campaignStatus === "Đang diễn ra" &&
                        (r.result ? (
                          <button onClick={() => setEditingIndex(index)}>
                            Chỉnh sửa
                          </button>
                        ) : (
                          <button onClick={() => setEditingIndex(index)}>
                            Ghi nhận
                          </button>
                        ))}
                      {campaignStatus === "Đã hoàn thành" && r.result && (
                        <button
                          onClick={() => handleSendNotificationAndEmail(r)}
                        >
                          Gửi thông báo & email
                        </button>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {viewingIndex !== null && (
        <div className={style.detailModal}>
          <div className={style.modalContent}>
            <h3>Chi tiết kết quả tiêm</h3>
            <p>
              <strong>Học sinh:</strong> {records[viewingIndex].studentName}
            </p>
            <p>
              <strong>Phụ huynh:</strong> {records[viewingIndex].parentName}
            </p>
            <p>
              <strong>Kết quả:</strong> {records[viewingIndex].result}
            </p>
            <p>
              <strong>Ghi chú:</strong>{" "}
              {records[viewingIndex].followUpNote || "Không có"}
            </p>
            <button
              onClick={() => setViewingIndex(null)}
              className={style.closeBtn}
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

export default VaccineResult;
