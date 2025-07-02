import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/nursedashboard.module.css";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const NurseDashBoard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("https://swp-school-medical-management.onrender.com/api/Dashboard/overview");
        if (res.data.status === "200") {
          setDashboardData(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className={style.loadingOverlay}>
      <div className={style.spinner}></div>
      <div className={style.loadingText}>Đang tải dữ liệu...</div>
    </div>
  );
  if (!dashboardData) return <div className={style.loadingText}>Không có dữ liệu dashboard</div>;

  const userData = [
    { name: "Admin", value: dashboardData.totalUsers.admin },
    { name: "Y tá", value: dashboardData.totalUsers.nurse },
    { name: "Phụ huynh", value: dashboardData.totalUsers.parent }
  ];

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <div className={style.container}>
      <Sidebar />
      <main className={style.dashboardWrapper}>
        <div className={style.header}>
          <h2>Nurse Dashboard</h2>
          <p>Hệ thống y tế học đường EduHealth</p>
        </div>

        <div className={style.summaryGrid}>
          <div className={style.summaryBox}>
            <h4>Yêu cầu thuốc chờ xử lý</h4>
            <p>{dashboardData.pendingMedicationRequests}</p>
            <span>{dashboardData.totalMedicationRequests - dashboardData.pendingMedicationRequests} đã xử lý</span>
          </div>
          <div className={style.summaryBox}>
            <h4>Mũi tiêm sắp tới</h4>
            <p>87</p>
            <span>Trong tuần này</span>
          </div>
          <div className={style.summaryBox}>
            <h4>Kiểm tra sức khỏe</h4>
            <p>{dashboardData.totalHealthCheckCampaigns}</p>
            <span>{dashboardData.activeHealthCheckCampaigns} đã lên lịch</span>
          </div>
          <div className={style.summaryBox}>
            <h4>Sự cố được báo cáo</h4>
            <p>{dashboardData.recentMedicalEvents.length}</p>
            <span>{dashboardData.totalMedicalEvents - dashboardData.recentMedicalEvents.length} sự cố hôm qua</span>
          </div>
        </div>

        <div className={style.contentRow}>
          <div className={style.leftPanel}>
            <section className={style.card}>
              <div className={style.cardHeader}>
                <h3>Yêu cầu thuốc</h3>
                <a href="#">Xem tất cả →</a>
              </div>
              <table className={style.styledTable}>
                <thead>
                  <tr>
                    <th>Học sinh</th>
                    <th>Thuốc</th>
                    <th>Trạng thái</th>
                    <th>Thời gian</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentMedicationRequests.map((req) => (
                    <tr key={req.requestId}>
                      <td>{req.studentName}</td>
                      <td>{req.medicationName}</td>
                      <td><span className={`${style.pill} ${req.status === "Đã duyệt" ? style.green : style.yellow}`}>{req.status}</span></td>
                      <td>{new Date(req.requestDate).toLocaleString()}</td>
                      <td><button className={style.btnAction}>Đã cấp</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>

          <div className={style.rightPanel}>
            <section className={style.card}>
              <h3>Biểu đồ người dùng</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {userData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseDashBoard;