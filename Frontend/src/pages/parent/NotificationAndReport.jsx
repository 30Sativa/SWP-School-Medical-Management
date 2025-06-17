import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Parent/Sidebar";
import styles from "../../assets/css/NotificationAndReport.module.css";

const NotificationAndReport = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const dummyData = [
      {
        title: "Health Schedule Notification",
        date: "2025-06-12",
        content: `
⚕️ THÔNG BÁO VỀ LỊCH KHÁM SỨC KHỎE ĐỊNH KỲ CHO HỌC SINH

Kính gửi Quý Phụ huynh,

Nhằm theo dõi và chăm sóc tốt tình trạng sức khỏe của học sinh, nhà trường sẽ tổ chức khám sức khỏe định kỳ cho các em học sinh theo kế hoạch như sau:

- Thời gian: Từ ngày 03/06/2025 đến ngày 05/06/2025
- Địa điểm: Phòng Y tế – Trường Tiểu học Tam Binh
- Đối tượng: Tất cả học sinh từ khối lớp 1 đến lớp 5
- Nội dung khám: Đo chiều cao, cân nặng, khám mắt, tai mũi họng, răng miệng và các xét nghiệm cần thiết.

Kính mong Quý Phụ huynh phối hợp nhắc nhở các em ăn sáng đầy đủ, mặc đồng phục gọn gàng và có mặt đúng thời gian quy định để buổi khám diễn ra thuận lợi.

Trân trọng cảm ơn sự quan tâm và đồng hành của Quý Phụ huynh!

Ban Giám Hiệu
        `,
        type: "notification"
      },
      {
        title: "Vaccination Schedule",
        date: "2025-06-15",
        content: `
📢 LỊCH TIÊM VẮC-XIN BỔ SUNG

Kính gửi Quý Phụ huynh,

Để phòng ngừa dịch bệnh và bảo vệ sức khỏe học sinh, nhà trường phối hợp với trung tâm y tế tổ chức tiêm vắc-xin bổ sung:

- Thời gian: 20/06/2025
- Địa điểm: Phòng y tế trường học
- Đối tượng: Toàn bộ học sinh các khối lớp 1 đến 5

Kính mong Quý Phụ huynh cho phép các em tham gia và điền vào phiếu đồng ý gửi lại giáo viên chủ nhiệm.

Xin chân thành cảm ơn!
        `,
        type: "report"
      }
    ];
    setNotifications(dummyData);
  }, []);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>Thông Báo & Phản Hồi</h2>
        <p className={styles.subtitle}>Xin chào, bạn đang đăng nhập với tư cách phụ huynh em Trần Văn Hùng</p>

        <div className={styles.listWrapper}>
          {notifications.map((item, index) => (
            <div className={`${styles.card} ${item.type === "report" ? styles.reportCard : styles.notifyCard}`} key={index}>
              <h3>{item.title}</h3>
              <p><strong>Ngày:</strong> {item.date}</p>
              <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{item.content}</pre>
              <button className={styles.replyButton}>Reply</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationAndReport;

