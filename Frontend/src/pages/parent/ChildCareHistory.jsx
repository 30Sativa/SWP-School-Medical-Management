import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/ChildCareHistory.module.css";
import axios from "axios";
import dayjs from "dayjs";

const ChildCareHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [healthProfiles, setHealthProfiles] = useState([]);
  const [medicalEvents, setMedicalEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!studentId) throw new Error("Không tìm thấy studentId");

        // Hàm gọi API với xử lý 404
        const fetchWith404Handling = async (url) => {
          try {
            const res = await axios.get(url);
            return res.data;
          } catch (err) {
            if (err.response && err.response.status === 404) {
              return []; // Nếu 404 => không có dữ liệu
            } else {
              throw err; // Nếu lỗi khác 404 => ném lỗi ra ngoài
            }
          }
        };

        const [
          medicalHistoryData,
          vaccinationData,
          healthProfilesData,
          medicalEventsData
        ] = await Promise.all([
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/MedicalHistory/student/${studentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/VaccinationHistory/student/${studentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/HealthProfiles/student/${studentId}`),
          fetchWith404Handling(`https://swp-school-medical-management.onrender.com/api/MedicalEvent/student/${studentId}`)
        ]);

        setMedicalHistory(medicalHistoryData);
        setVaccinationHistory(vaccinationData);
        setHealthProfiles(healthProfilesData);
        setMedicalEvents(medicalEventsData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dayjs(dateStr).format("DD/MM/YYYY");
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc Sức Khỏe</h2>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <>
            {/* Lịch sử bệnh án */}
            <div className={styles.section}>
              <h3>Bệnh Án</h3>
              {medicalHistory.length === 0 ? (
                <p>Không có bệnh án.</p>
              ) : (
                medicalHistory.map(item => (
                  <div className={styles.historyCard} key={item.historyId}>
                    <h4>{item.diseaseName}</h4>
                    <p><strong>Ngày chẩn đoán:</strong> {formatDate(item.diagnosedDate)}</p>
                    <p><strong>Ghi chú:</strong> {item.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Lịch sử tiêm chủng */}
            <div className={styles.section}>
              <h3>Tiêm Chủng</h3>
              {vaccinationHistory.length === 0 ? (
                <p>Không có lịch sử tiêm chủng.</p>
              ) : (
                vaccinationHistory.map(item => (
                  <div className={styles.historyCard} key={item.vaccinationHistoryId}>
                    <h4>{item.vaccineName}</h4>
                    <p><strong>Ngày tiêm:</strong> {formatDate(item.injectionDate)}</p>
                    <p><strong>Ghi chú:</strong> {item.note}</p>
                  </div>
                ))
              )}
            </div>

            {/* Lịch sử khám sức khỏe */}
            <div className={styles.section}>
              <h3>Khám Sức Khỏe</h3>
              {healthProfiles.length === 0 ? (
                <p>Không có hồ sơ khám sức khỏe.</p>
              ) : (
                healthProfiles.map(item => (
                  <div className={styles.historyCard} key={item.healthProfileId}>
                    <p><strong>Ngày khám:</strong> {formatDate(item.examDate)}</p>
                    <p><strong>Chiều cao:</strong> {item.height} cm - <strong>Cân nặng:</strong> {item.weight} kg</p>
                    <p><strong>Tổng quan:</strong> {item.overallStatus}</p>
                  </div>
                ))
              )}
            </div>

            {/* Lịch sử sự kiện y tế */}
            <div className={styles.section}>
              <h3>Sự Kiện Y Tế</h3>
              {medicalEvents.length === 0 ? (
                <p>Không có sự kiện y tế nào.</p>
              ) : (
                medicalEvents.map(item => (
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
