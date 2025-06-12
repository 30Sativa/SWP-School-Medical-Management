import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/ChildCareHistory.module.css";

const ChildCareHistory = () => {
  const [careHistory, setCareHistory] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        activity: "Đo nhiệt độ buổi sáng",
        date: "2025-06-10",
        note: "Nhiệt độ ổn định, không có dấu hiệu sốt",
        status: "completed"
      },
      {
        activity: "Cho uống thuốc ho",
        date: "2025-06-09",
        note: "Uống sau bữa sáng 30 phút",
        status: "processing"
      },
      {
        activity: "Đo huyết áp định kỳ",
        date: "2025-06-08",
        note: "Huyết áp bình thường",
        status: "completed"
      },
      {
        activity: "Tư vấn dinh dưỡng",
        date: "2025-06-07",
        note: "Tăng cường vitamin C cho trẻ",
        status: "completed"
      }
    ];
    setCareHistory(dummyData);
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Lịch Sử Chăm Sóc|</h2>
        <p className={styles.subtitle}>Xin chào, đây là toàn bộ lịch sử chăm sóc sức khỏe cho học sinh</p>

        <div className={styles.historyList}>
          {careHistory.map((item, index) => (
            <div className={styles.historyCard} key={index}>
              <h3>{item.activity}</h3>
              <p><strong>Thời gian:</strong> {item.date}</p>
              <p><strong>Ghi chú:</strong> {item.note}</p>
              <span className={`${styles.status} ${item.status === "completed" ? styles.completed : styles.processing}`}>
                {item.status === "completed" ? "Đã hoàn thành" : "Đang thực hiện"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChildCareHistory;