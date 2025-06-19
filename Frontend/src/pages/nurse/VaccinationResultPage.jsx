import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import style from "../../assets/css/ResultPage.module.css";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const VaccineResult = () => {
  const { id } = useParams();
  const [records, setRecords] = useState([]);
  const [campaignStatus, setCampaignStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Lấy trạng thái chiến dịch
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}`
        );
        // Ưu tiên lấy statusName nếu có, fallback sang status nếu không có
        const statusName =
          res.data.data.statusName ||
          (typeof res.data.data.status === "string"
            ? res.data.data.status
            : res.data.data.status?.name);
        setCampaignStatus(statusName);
      } catch (error) {
        console.error("Lỗi lấy trạng thái chiến dịch:", error);
      }
    };
    fetchStatus();
  }, [id]);

  // Lấy danh sách học sinh đã đồng ý
  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        if (campaignStatus === "Đang diễn ra") {
          const res = await axios.get(
            `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/approved-consents`
          );
          setRecords(res.data.data || []);
        } else {
          // Lấy danh sách học sinh đã đồng ý tiêm
          const res = await axios.get(
            `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/campaigns/${id}/approved-consents`
          );
          const students = res.data.data || [];
          // Gọi API lấy kết quả tiêm cho từng học sinh
          const allRecords = await Promise.all(
            students.map(async (student) => {
              try {
                const recordRes = await axios.get(
                  `https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/records/student/${student.studentId}`
                );
                let record = null;
                if (Array.isArray(recordRes.data.data)) {
                  // Lọc đúng campaignId hiện tại
                  const recordsForCampaign = recordRes.data.data.filter(
                    (rec) => String(rec.campaignId) === String(id)
                  );
                  if (recordsForCampaign.length > 0) {
                    // Sắp xếp giảm dần theo vaccinationDate
                    recordsForCampaign.sort((a, b) =>
                      new Date(b.vaccinationDate || 0) - new Date(a.vaccinationDate || 0)
                    );
                    record = recordsForCampaign[0]; // lấy bản ghi mới nhất
                  }
                } else {
                  record = recordRes.data.data;
                }
                return { ...student, ...record };
              } catch {
                return { ...student, result: "Không có dữ liệu" };
              }
            })
          );
          setRecords(allRecords);
        }
      } catch (error) {
        setRecords([]);
        console.error("Lỗi lấy kết quả tiêm chủng:", error);
      } finally {
        setLoading(false);
      }
    };
    if (campaignStatus) fetchRecords();
  }, [id, campaignStatus]);

  const isEditable = campaignStatus === "Đang diễn ra";

  const handleResultChange = (index, value) => {
    const updated = [...records];
    updated[index].result = value;
    setRecords(updated);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...records];
    updated[index].followUpNote = value;
    setRecords(updated);
  };

  const handleSave = async () => {
    try {
      // Lọc bản ghi hợp lệ và có kết quả
      const validRecords = records.filter(
        (r) => r.studentId && r.studentId !== 0 && r.result
      );
      if (validRecords.length === 0) {
        alert("Không có bản ghi hợp lệ để lưu!");
        return;
      }
      for (const r of validRecords) {
        await axios.post(
          "https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/records",
          {
            studentId: r.studentId,
            campaignId: id,
            consentStatusId: r.consentStatusId || 2, // 2 = Đồng ý, hoặc lấy đúng từ API nếu có
            vaccinationDate: r.vaccinationDate || new Date().toISOString(),
            result: r.result,
            followUpNote: r.followUpNote || "",
            isActive: true,
          },
          { headers: { "Content-Type": "application/json" } }
        );
      }
      alert("Đã lưu kết quả thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu:", error.response?.data || error);
      alert("Lỗi khi lưu dữ liệu: " + JSON.stringify(error.response?.data));
    }
  };

  const exportToExcel = () => {
    const headers = [
      ["STT", "Học sinh", "Phụ huynh", "Ngày phản hồi", "Kết quả", "Ghi chú"],
    ];
    const data = records.map((r, idx) => [
      idx + 1,
      r.studentName,
      r.parentName,
      r.consentDate ? new Date(r.consentDate).toLocaleDateString() : "",
      r.result || "",
      r.followUpNote || "",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kết quả tiêm");
    XLSX.writeFile(wb, `DanhSach_TiemChung_${id}.xlsx`);
  };

  return (
    <div className={style.container}>
      <h2 className={style.title}>Danh sách học sinh đã đồng ý tiêm</h2>
      <button
        className={style.btnBack}
        onClick={() => navigate(-1)} // quay lại trang trước đó
      >
        ← Quay lại
      </button>
      {isEditable && (
        <button className={style.btnExport} onClick={handleSave}>
          Lưu kết quả
        </button>
      )}

      <button className={style.btnExport} onClick={exportToExcel}>
        Xuất Excel
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
          </tr>
        </thead>
        <tbody>
          {records.length === 0 && !loading ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "12px" }}>
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
                {isEditable ? (
                  <>
                    <td>
                      <select
                        value={r.result || ""}
                        onChange={(e) =>
                          handleResultChange(index, e.target.value)
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
                          handleNoteChange(index, e.target.value)
                        }
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>{r.result}</td>
                    <td>{r.followUpNote}</td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VaccineResult;
