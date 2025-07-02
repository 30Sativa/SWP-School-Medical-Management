import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/nursedashboard.module.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const NurseReport = () => {
  const [stats, setStats] = useState({
    vaccination: null,
    medical: null,
    health: null,
    medication: null,
  });
  const [loading, setLoading] = useState(true); // loading fetch list
  const reportRef = useRef();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [vaccine, medical, health, medication] = await Promise.all([
          axios.get("https://swp-school-medical-management.onrender.com/api/Dashboard/vaccination-campaigns/statistics"),
          axios.get("https://swp-school-medical-management.onrender.com/api/Dashboard/medical-events-statistics"),
          axios.get("https://swp-school-medical-management.onrender.com/api/Dashboard/health-statistics"),
          axios.get("https://swp-school-medical-management.onrender.com/api/Dashboard/medication-statistics"),
        ]);
        setStats({
          vaccination: vaccine.data.data,
          medical: medical.data.data,
          health: health.data.data,
          medication: medication.data.data,
        });
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className={style.loadingOverlay}>
        <div className={style.spinner}></div>
      </div>
    );
  if (!stats.vaccination || !stats.medical || !stats.health || !stats.medication)
    return <div>Đang tải dữ liệu báo cáo...</div>;

  const vaccineData = [
    { name: "Chưa bắt đầu", value: stats.vaccination.notStartedCampaigns },
    { name: "Đang diễn ra", value: stats.vaccination.activeCampaigns },
    { name: "Đã hoàn thành", value: stats.vaccination.completedCampaigns },
    { name: "Đã huỷ", value: stats.vaccination.cancelledCampaigns },
  ];

  const healthChartData = [
    { name: "Đang diễn ra", value: stats.health.activeHealthCheckCampaigns },
    {
      name: "Chưa lên lịch",
      value:
        stats.health.totalHealthCheckCampaigns -
        stats.health.activeHealthCheckCampaigns,
    },
  ];

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const overviewData = [
      ["Loại", "Số lượng"],
      ["Chiến dịch tiêm chủng", stats.vaccination.totalCampaigns],
      ["Sự kiện y tế", stats.medical.totalMedicalEvents],
      ["Yêu cầu cấp thuốc", stats.medication.totalMedicationRequests],
      ["Chiến dịch sức khỏe", stats.health.totalHealthCheckCampaigns],
    ];
    const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, overviewSheet, "Tổng quan");

    const meds = stats.medication.recentMedicationRequests.map((item) => ({
      Học_sinh: item.studentName,
      Thuốc: item.medicationName,
      Trạng_thái: item.status,
      Thời_gian: new Date(item.requestDate).toLocaleString(),
    }));
    const medsSheet = XLSX.utils.json_to_sheet(meds);
    XLSX.utils.book_append_sheet(wb, medsSheet, "Thuốc gần đây");

    XLSX.writeFile(wb, "bao_cao_y_te.xlsx");
  };

  const exportToPDF = () => {
    const input = reportRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save("bao_cao_y_te.pdf");
    });
  };

  return (
    <div className={style.container}>
      <Sidebar />
      <main className={style.dashboardWrapper}>
        <div className={style.header}>
          <h2>Báo cáo tổng hợp</h2>
          <p>Tổng quan các hoạt động y tế trong trường</p>
        </div>

        <div className={style.exportControls}>
          <button onClick={exportToExcel} className={style.btnExport}>📥 Xuất Excel</button>
          <button onClick={exportToPDF} className={style.btnExport}>📄 Tải PDF</button>
        </div>

        <div ref={reportRef}>
          <div className={style.summaryGrid}>
            <div className={style.summaryBox}>
              <h4>Chiến dịch tiêm chủng</h4>
              <p>{stats.vaccination.totalCampaigns}</p>
            </div>
            <div className={style.summaryBox}>
              <h4>Sự kiện y tế</h4>
              <p>{stats.medical.totalMedicalEvents}</p>
            </div>
            <div className={style.summaryBox}>
              <h4>Yêu cầu cấp thuốc</h4>
              <p>{stats.medication.totalMedicationRequests}</p>
            </div>
            <div className={style.summaryBox}>
              <h4>Chiến dịch sức khoẻ</h4>
              <p>{stats.health.totalHealthCheckCampaigns}</p>
            </div>
          </div>

          <div className={style.contentRow}>
            <div className={style.leftPanel}>
              <section className={style.card}>
                <h3>Tiến độ chiến dịch tiêm chủng</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vaccineData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {vaccineData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </section>
            </div>

            <div className={style.rightPanel}>
              <section className={style.card}>
                <h3>Chiến dịch kiểm tra sức khoẻ</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={healthChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label
                    >
                      {healthChartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseReport;
