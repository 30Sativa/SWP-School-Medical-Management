import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/ChildCareHistory.module.css";
import axios from "axios";
import dayjs from "dayjs";

const ChildCareHistory = () => {
  const parentId = localStorage.getItem("userId");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(Number(localStorage.getItem("studentId")) || null);

  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [totalVaccinesThisMonth, setTotalVaccinesThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/Student/by-parent/${parentId}`
        );
        const studentList = res.data?.data || [];
        setStudents(studentList);
        if (!selectedStudentId && studentList.length > 0) {
          setSelectedStudentId(studentList[0].studentId);
          localStorage.setItem("studentId", studentList[0].studentId);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách học sinh:", err);
      }
    };

    fetchStudents();
  }, [parentId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedStudentId) return;

        const fetchWith404Handling = async (url) => {
          try {
            const res = await axios.get(url);
            return res.data?.data || [];
          } catch (err) {
            if (err.response && err.response.status === 404) {
              return [];
            } else {
              throw err;
            }
          }
        };

        const [
          medicalHistoryData,
          vaccinationData,
          medicalEventsData,
          studentResponse
        ] = await Promise.all([
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/MedicalHistory/student/${selectedStudentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/VaccinationCampaign/records/student/${selectedStudentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/MedicalEvent/student/${selectedStudentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/Student/${selectedStudentId}`)
        ]);

        setMedicalHistory(medicalHistoryData);
        setVaccinationHistory(Array.isArray(vaccinationData) ? vaccinationData : []);
        setMedicalEvents(Array.isArray(medicalEventsData) ? medicalEventsData : []);
        setStudentName(studentResponse?.fullName || "");

        const currentMonth = dayjs().month() + 1;
        const currentYear = dayjs().year();

        const vaccineCount = vaccinationData?.filter(item => {
          const date = dayjs(item.vaccinationDate);
          return date.month() + 1 === currentMonth && date.year() === currentYear;
        }).length || 0;

        setTotalVaccinesThisMonth(vaccineCount);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStudentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  const matchesSearch = (text, dateStr, extra = "") => {
    const keyword = searchKeyword.toLowerCase().trim();
    if (!keyword) return true;

    const formattedDate = dayjs(dateStr).format("DD/MM/YYYY");
    return (
      (text && text.toLowerCase().includes(keyword)) ||
      formattedDate.includes(keyword) ||
      (extra && extra.toLowerCase().includes(keyword))
    );
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>
        <p className={styles.subtitle}>
          Xin chào, bạn đang đăng nhập với tư cách phụ huynh em <strong>{studentName || "..."}</strong>
        </p>

        {/* Dropdown chọn học sinh */}
        <label style={{ color: '#059669', fontWeight: 'bold', marginBottom: '8px', display: 'inline-block' }}>
          Chọn học sinh:
        </label>
        <select
          value={selectedStudentId || ""}
          onChange={(e) => {
            const selected = Number(e.target.value);
            localStorage.setItem("studentId", selected);
            window.location.reload();
          }}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "1px solid #3b82f6",
            fontSize: "15px",
            outline: "none",
            marginBottom: "20px",
            width: "100%",
            maxWidth: "400px"
          }}
        >
          {students.map((s) => (
            <option key={s.studentId} value={s.studentId}>
              {s.fullName} - Lớp {s.className}
            </option>
          ))}
        </select>

        {/* Thanh tìm kiếm */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo bệnh, chiến dịch, ngày hoặc theo dõi sau tiêm..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{
              padding: "10px 16px",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "15px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ marginBottom: "30px", fontSize: "16px" }}>
          🧮 <strong>Thống kê tháng này:</strong> {totalVaccinesThisMonth} lần tiêm
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            <div className={styles.section}>
              <h3>🩺 Lịch Sử Bệnh Án</h3>
              {medicalHistory.filter(item =>
                matchesSearch(item.diseaseName, item.diagnosedDate)
              ).length === 0 ? (
                <p>Không có bệnh án phù hợp.</p>
              ) : (
                medicalHistory
                  .filter(item => matchesSearch(item.diseaseName, item.diagnosedDate))
                  .map((item) => (
                    <div className={styles.historyCard} key={item.historyId}>
                      <h4>{item.diseaseName}</h4>
                      <p><strong>Ngày chẩn đoán:</strong> {formatDate(item.diagnosedDate)}</p>
                      <p><strong>Ghi chú:</strong> {item.note}</p>
                    </div>
                  ))
              )}
            </div>

            <div className={styles.section}>
              <h3>💉 Lịch Sử Tiêm Chủng</h3>
              {vaccinationHistory.filter(item =>
                matchesSearch(item.campaignName, item.vaccinationDate, item.followUpNote)
              ).length === 0 ? (
                <p>Không có lịch sử tiêm chủng phù hợp.</p>
              ) : (
                vaccinationHistory
                  .filter(item => matchesSearch(item.campaignName, item.vaccinationDate, item.followUpNote))
                  .map((item) => (
                    <div className={styles.historyCard} key={item.recordId}>
                      <p><strong>Chiến dịch:</strong> {item.campaignName}</p>
                      <p><strong>Ngày tiêm:</strong> {formatDate(item.vaccinationDate)}</p>
                      <p><strong>Kết quả:</strong> {item.result}</p>
                      <p><strong>Theo dõi sau tiêm:</strong> {item.followUpNote}</p>
                    </div>
                  ))
              )}
            </div>

            <div className={styles.section}>
              <h3>🚨 Sự Kiện Y Tế</h3>
              {medicalEvents.filter(item =>
                matchesSearch(item.eventType, item.eventDate)
              ).length === 0 ? (
                <p>Không có sự kiện y tế phù hợp.</p>
              ) : (
                medicalEvents
                  .filter(item => matchesSearch(item.eventType, item.eventDate))
                  .map((item) => (
                    <div className={styles.historyCard} key={item.eventId}>
                      <h4>{item.eventType}</h4>
                      <p><strong>Mức độ:</strong> {item.severityLevelName}</p>
                      <p><strong>Ngày:</strong> {formatDate(item.eventDate)}</p>
                      <p><strong>Ghi chú:</strong> {item.description}</p>
                      <p><strong>Điều dưỡng phụ trách:</strong> {item.nurseName}</p>
                    </div>
                  ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChildCareHistory;




