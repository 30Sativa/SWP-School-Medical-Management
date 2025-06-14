import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/incidentPage.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Search, Plus } from "lucide-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const COLORS = ["#F4C430", "#FF6B6B", "#4D96FF", "#9AE6B4", "#FFA500"];

const Incident = () => {
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [eventTypeFilter, setEventTypeFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    sent: 0,
    draft: 0,
    pending: 0,
  });
  const [distributionData, setDistributionData] = useState([]);
  const [groupBy, setGroupBy] = useState("day");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const itemsPerPage = 5;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    studentName: "",
    parentName: "",
    eventType: "Sốt",
    severityLevelName: "Nhẹ",
    eventDate: new Date().toISOString().slice(0, 16), // format yyyy-MM-ddTHH:mm
    description: "",
    handledByName: "",
  });

  useEffect(() => {
    axios
      .get(
        "https://swp-school-medical-management.onrender.com/api/MedicalEvent"
      )
      .then((res) => {
        if (res.status === 200) {
          setEvents(res.data);
          setFilteredEvents(res.data);
          updateStats(res.data);
        }
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchType =
        eventTypeFilter === "Tất cả" || event.eventType === eventTypeFilter;
      const matchSearch = event.studentName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchDate =
        !dateFilter ||
        new Date(event.eventDate).toISOString().split("T")[0] === dateFilter;
      return matchType && matchSearch && matchDate;
    });
    setFilteredEvents(filtered);
    updateStats(filtered);
    setCurrentPage(1);
  }, [search, eventTypeFilter, dateFilter, events, groupBy]);

  const updateStats = (data) => {
    const typeMap = {};
    const dateMap = {};
    let sent = 0,
      draft = 0,
      pending = 0;

    data.forEach((event) => {
      typeMap[event.eventType] = (typeMap[event.eventType] || 0) + 1;
      const status = event.status?.toLowerCase() || "";
      if (status.includes("gửi")) sent++;
      else if (status.includes("nháp")) draft++;
      else pending++;

      const d = dayjs(event.eventDate);
      let groupKey =
        groupBy === "day"
          ? d.format("YYYY-MM-DD")
          : groupBy === "week"
          ? `${d.year()}-W${d.isoWeek()}`
          : d.format("YYYY-MM");
      dateMap[groupKey] = (dateMap[groupKey] || 0) + 1;
    });

    setChartData(
      Object.entries(typeMap).map(([name, value]) => ({ name, value }))
    );
    setDistributionData(
      Object.entries(dateMap)
        .map(([key, value]) => ({ date: key, value }))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    setSummary({ total: data.length, sent, draft, pending });
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handleExportExcel = () => {
    if (filteredEvents.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(
      filteredEvents.map((e) => ({
        "Học sinh": e.studentName,
        "Loại sự cố": e.eventType,
        "Thời gian": new Date(e.eventDate).toLocaleString(),
        "Mức độ": e.severityLevelName,
        "Người xử lý": e.handledByName || "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sự cố y tế");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "su_co_y_te.xlsx");
  };

  const handleCreate = () => {
    const payload = {
      ...newEvent,
      status: "Đã gửi", // bắt buộc nếu backend require
      suppliesUsed: [],
      medicalHistory: [],
    };

    console.log("Sending payload:", payload); // debug

    axios
      .post(
        "https://swp-school-medical-management.onrender.com/api/MedicalEvent",
        payload
      )
      .then((res) => {
        setEvents((prev) => [...prev, res.data]);
        setShowCreateForm(false);
      })
      .catch((err) => {
        console.error("Create error:", err.response?.data || err.message);
        alert("Lỗi khi tạo mới sự cố");
      });
  };

  const handleEdit = (event) => {
    // Ví dụ mở form hoặc điều hướng tới trang chỉnh sửa
    console.log("Chỉnh sửa:", event);
    alert("Tính năng Chỉnh sửa đang được phát triển!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sự cố này?")) {
      axios
        .delete(
          `https://swp-school-medical-management.onrender.com/api/MedicalEvent/${id}`
        )
        .then(() => {
          setEvents((prev) => prev.filter((e) => e.eventId !== id));
          setSelectedEvent(null);
        })
        .catch((err) => alert("Lỗi khi xoá: " + err));
    }
  };

  return (
    <div className={style.pageContainer}>
      <Sidebar />
      <div className={style.contentArea}>
        <div className={style.header}>
          <h2>Báo cáo sự cố y tế học đường</h2>
          <button
            className={style.addButton}
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={16} /> Tạo sự cố mới
          </button>
        </div>

        <div className={style.filters}>
          <select
            value={eventTypeFilter}
            onChange={(e) => setEventTypeFilter(e.target.value)}
          >
            <option>Tất cả</option>
            <option>Sốt</option>
            <option>Đau bụng</option>
            <option>Dị ứng</option>
            <option>Té ngã</option>
            <option>Tai nạn nhỏ</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <div className={style.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Tìm học sinh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
            <option value="day">Theo ngày</option>
            <option value="week">Theo tuần</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>

        <div className={style.incidentTable}>
          <table>
            <thead>
              <tr>
                <th>Học sinh</th>
                <th>Loại sự cố</th>
                <th>Thời gian</th>
                <th>Mức độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((event) => (
                <tr key={event.eventId}>
                  <td>{event.studentName}</td>
                  <td>
                    <span className={style.tagBlue}>{event.eventType}</span>
                  </td>
                  <td>{new Date(event.eventDate).toLocaleString()}</td>
                  <td>
                    <span className={style.tagGray}>
                      {event.severityLevelName}
                    </span>
                  </td>
                  <td>
                    <button
                      className={style.viewDetail}
                      onClick={() => setSelectedEvent(event)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={style.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            〈
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? style.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            〉
          </button>
        </div>

        <div className={style.summarySection}>
          <div className={style.chartCard}>
            <h4>Thống kê theo loại</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className={style.summaryCard}>
            <h4>Tóm tắt</h4>
            <p>
              Tổng sự cố: <strong>{summary.total}</strong>
            </p>
            <p>
              Đã gửi thông báo: <strong>{summary.sent}</strong>
            </p>
            <p>
              Đang chờ xử lý: <strong>{summary.pending}</strong>
            </p>
            <p>
              Lưu nháp: <strong>{summary.draft}</strong>
            </p>
            <div className={style.links}>
              <button onClick={handleExportExcel}>Xuất dữ liệu Excel</button>
            </div>
          </div>

          <div className={style.chartCard}>
            <h4>
              Phân phối theo{" "}
              {groupBy === "day"
                ? "ngày"
                : groupBy === "week"
                ? "tuần"
                : "tháng"}
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4D96FF"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Chi tiết sự cố</h3>
            <p>
              <strong>Học sinh:</strong> {selectedEvent.studentName}
            </p>
            <p>
              <strong>Phụ huynh:</strong> {selectedEvent.parentName}
            </p>
            <p>
              <strong>Loại sự cố:</strong> {selectedEvent.eventType}
            </p>
            <p>
              <strong>Mức độ:</strong> {selectedEvent.severityLevelName}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {new Date(selectedEvent.eventDate).toLocaleString()}
            </p>
            <p>
              <strong>Mô tả:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Người xử lý:</strong> {selectedEvent.handledByName}
            </p>
            <div className={style.modalActions}>
              <button
                className={style.editBtn}
                onClick={() => handleEdit(selectedEvent)}
              >
                Chỉnh sửa
              </button>
              <button
                className={style.deleteBtn}
                onClick={() => handleDelete(selectedEvent.eventId)}
              >
                Xoá
              </button>
              <button onClick={() => setSelectedEvent(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Tạo sự cố mới</h3>
            <input
              type="text"
              placeholder="Học sinh"
              value={newEvent.studentName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, studentName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phụ huynh"
              value={newEvent.parentName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, parentName: e.target.value })
              }
            />
            <select
              value={newEvent.eventType}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventType: e.target.value })
              }
            >
              <option>Sốt</option>
              <option>Đau bụng</option>
              <option>Dị ứng</option>
              <option>Té ngã</option>
              <option>Tai nạn nhỏ</option>
            </select>
            <select
              value={newEvent.severityLevelName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, severityLevelName: e.target.value })
              }
            >
              <option>Nhẹ</option>
              <option>Trung bình</option>
              <option>Nặng</option>
            </select>
            <input
              type="datetime-local"
              value={newEvent.eventDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventDate: e.target.value })
              }
            />
            <textarea
              placeholder="Mô tả"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Người xử lý"
              value={newEvent.handledByName}
              onChange={(e) =>
                setNewEvent({ ...newEvent, handledByName: e.target.value })
              }
            />

            <div className={style.modalActions}>
              <button onClick={handleCreate}>Tạo</button>
              <button
                className={style.closeBtn}
                onClick={() => setShowCreateForm(false)}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incident;
