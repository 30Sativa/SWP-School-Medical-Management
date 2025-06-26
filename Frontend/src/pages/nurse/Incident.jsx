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
import { Search, Plus, Users } from "lucide-react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);
import Select from "react-select";

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
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBulkCreateForm, setShowBulkCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [students, setStudents] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [classStudents, setClassStudents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    studentId: "",
    eventTypeId: "",
    severityId: "",
    eventDate: new Date().toISOString().slice(0, 16),
    description: "",
    handledByUserId: "",
    location: "",
    notes: "",
  });
  const [bulkEvent, setBulkEvent] = useState({
    selectedStudents: [],
    eventTypeId: "",
    severityId: "",
    eventDate: new Date().toISOString().slice(0, 16),
    description: "",
    location: "",
    notes: "",
  });
  const [supplies, setSupplies] = useState([]);
  const [suppliesUsed, setSuppliesUsed] = useState([]);
  const [bulkSuppliesUsed, setBulkSuppliesUsed] = useState([]);
  const [users, setUsers] = useState([]);

  const eventTypes = [
    { id: "1", name: "Sốt" },
    { id: "2", name: "Té ngã" },
    { id: "3", name: "Dị ứng" },
    { id: "4", name: "Đau bụng" },
    { id: "5", name: "Tai nạn nhỏ" },
  ];
  const severityLevels = [
    { id: "1", level: "Nhẹ" },
    { id: "2", level: "Trung bình" },
    { id: "3", level: "Nặng" },
  ];

  const fetchEvents = () => {
    const token = localStorage.getItem("token");
    axios
      .get("/api/MedicalEvent", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("📥 Danh sách sự cố:", res.data);
        // Sắp xếp theo thời gian tạo mới nhất
        const sortedEvents = [...res.data].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
        setEvents(sortedEvents);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy danh sách sự cố:", err);
      });
  };

  const getStaffName = (id, handledByName) => {
    if (handledByName && handledByName !== "") return handledByName;
    const user = users.find((u) => u.userId === id || u.userID === id);
    if (user) return user.fullName;
    if (id === localStorage.getItem("userId")) return "Bạn";
    return "Không rõ";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Token:", token);
    console.log("👤 UserId:", localStorage.getItem("userId"));

    fetchEvents();

    axios
      .get("/api/Student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("📥 Danh sách học sinh:", res.data);
        setStudents(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy danh sách học sinh:", err);
        setStudents([]);
      });

    axios
      .get("/api/User", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy danh sách user:", err);
      });

    axios
      .get("/api/MedicalSupplies", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setSupplies(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy vật tư:", err);
        setSupplies([]);
      });
  }, []);

  useEffect(() => {
    if (selectedEvent?.studentId) {
      axios
        .get(`/api/MedicalHistory/student/${selectedEvent.studentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          setSelectedMedicalHistory(res.data);
        })
        .catch((err) => {
          console.error("❌ Lỗi lấy tiền sử bệnh:", err);
          setSelectedMedicalHistory([]);
        });
    } else {
      setSelectedMedicalHistory([]);
    }
  }, [selectedEvent]);

  useEffect(() => {
    const filtered = events.filter((event) => {
      const matchType =
        eventTypeFilter === "Tất cả" || event.eventType === eventTypeFilter;
      const matchSearch = event.studentName
        ?.toLowerCase()
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
    const typeMap = {},
      dateMap = {};
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
      const groupKey =
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
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Kiểm tra các trường bắt buộc
    if (
      !newEvent.studentId ||
      isNaN(Number(newEvent.studentId)) ||
      Number(newEvent.studentId) === 0
    ) {
      alert("Vui lòng chọn học sinh!");
      return;
    }
    if (
      !newEvent.eventTypeId ||
      isNaN(Number(newEvent.eventTypeId)) ||
      Number(newEvent.eventTypeId) === 0
    ) {
      alert("Vui lòng chọn loại sự cố!");
      return;
    }
    if (
      !newEvent.severityId ||
      isNaN(Number(newEvent.severityId)) ||
      Number(newEvent.severityId) === 0
    ) {
      alert("Vui lòng chọn mức độ!");
      return;
    }
    if (!newEvent.eventDate) {
      alert("Vui lòng chọn thời gian!");
      return;
    }
    if (!newEvent.description) {
      alert("Vui lòng nhập mô tả!");
      return;
    }
    if (!currentUserId) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }

    const payload = {
      studentId: Number(newEvent.studentId),
      eventTypeId: Number(newEvent.eventTypeId),
      severityId: Number(newEvent.severityId),
      eventDate: newEvent.eventDate,
      description: newEvent.description,
      handledByUserId: currentUserId,
      status: "Đã gửi",
      location: newEvent.location,
      notes: newEvent.notes,
      suppliesUsed: suppliesUsed
        .filter(
          (item) =>
            item.supplyID &&
            !isNaN(parseInt(item.supplyID, 10)) &&
            Number(item.quantityUsed) > 0
        )
        .map((item) => ({
          supplyID: parseInt(item.supplyID, 10),
          quantityUsed: Number(item.quantityUsed),
          note: item.note || "",
        })),
      request: "Không có yêu cầu đặc biệt",
    };

    console.log("📤 Payload gửi API:", payload);
    console.log("🔑 Token:", token);

    axios
      .post("/api/MedicalEvent", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("✅ Tạo sự cố thành công:", res.data);
        const added = {
          ...res.data,
          handledByName: "Bạn",
        };
        setEvents((prev) => [...prev, added]);
        setShowCreateForm(false);
        setNewEvent({
          studentId: "",
          eventTypeId: "",
          severityId: "",
          eventDate: new Date().toISOString().slice(0, 16),
          description: "",
          handledByUserId: "",
          location: "",
          notes: "",
        });
        setSuppliesUsed([]);
        fetchEvents();
      })
      .catch((err) => {
        const errorDetail =
          err.response?.data?.errors || err.response?.data || err.message;
        console.error("❌ Lỗi tạo sự cố:", errorDetail);
        alert(
          "Lỗi khi tạo mới sự cố:\n" + JSON.stringify(errorDetail, null, 2)
        );
      });
  };

  const handleEdit = (event) => {
    const suppliesWithId = (event.suppliesUsed || []).map((used) => {
      const supplyData = supplies.find((s) => s.name === used.supplyName);
      return {
        ...used,
        supplyID: used.supplyID || supplyData?.supplyID,
      };
    });
    setEditingEvent({ ...event, suppliesUsed: suppliesWithId });
    setShowEditForm(true);
    setSelectedEvent(null); // Close detail view
  };

  const handleUpdate = () => {
    if (!editingEvent) return;

    const token = localStorage.getItem("token");
    const payload = {
      ...editingEvent,
      severityId: Number(editingEvent.severityId),
      description: editingEvent.description,
      location: editingEvent.location,
      notes: editingEvent.notes,
      suppliesUsed: (editingEvent.suppliesUsed || [])
        .filter(
          (item) =>
            item.supplyID &&
            !isNaN(parseInt(item.supplyID, 10)) &&
            Number(item.quantityUsed) > 0
        )
        .map((item) => ({
          supplyID: parseInt(item.supplyID, 10),
          quantityUsed: Number(item.quantityUsed),
          note: item.note || "",
        })),
    };

    console.log("📤 Payload cập nhật:", payload);

    axios
      .put(`/api/MedicalEvent/${editingEvent.eventId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("✅ Cập nhật sự cố thành công:", res.data);
        fetchEvents();
        setShowEditForm(false);
        setEditingEvent(null);
      })
      .catch((err) => {
        const errorDetail =
          err.response?.data?.errors || err.response?.data || err.message;
        console.error("❌ Lỗi cập nhật sự cố:", errorDetail);
        alert(
          "Lỗi khi cập nhật sự cố:\n" + JSON.stringify(errorDetail, null, 2)
        );
      });
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

  const handleBulkCreate = () => {
    const currentUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    // Kiểm tra các trường bắt buộc
    if (
      !bulkEvent.selectedStudents ||
      bulkEvent.selectedStudents.length === 0
    ) {
      alert("Vui lòng chọn ít nhất một học sinh!");
      return;
    }
    if (
      !bulkEvent.eventTypeId ||
      isNaN(Number(bulkEvent.eventTypeId)) ||
      Number(bulkEvent.eventTypeId) === 0
    ) {
      alert("Vui lòng chọn loại sự cố!");
      return;
    }
    if (
      !bulkEvent.severityId ||
      isNaN(Number(bulkEvent.severityId)) ||
      Number(bulkEvent.severityId) === 0
    ) {
      alert("Vui lòng chọn mức độ!");
      return;
    }
    if (!bulkEvent.eventDate) {
      alert("Vui lòng chọn thời gian!");
      return;
    }
    if (!bulkEvent.description) {
      alert("Vui lòng nhập mô tả!");
      return;
    }
    if (!currentUserId) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }

    const suppliesPayload = bulkSuppliesUsed
      .filter(
        (item) =>
          item.supplyID &&
          !isNaN(parseInt(item.supplyID, 10)) &&
          Number(item.quantityUsed) > 0
      )
      .map((item) => ({
        supplyID: parseInt(item.supplyID, 10),
        quantityUsed: Number(item.quantityUsed),
        note: item.note || "",
      }));

    // Tạo nhiều sự cố cùng lúc
    const promises = bulkEvent.selectedStudents.map((studentId) => {
      const payload = {
        studentId: Number(studentId),
        eventTypeId: Number(bulkEvent.eventTypeId),
        severityId: Number(bulkEvent.severityId),
        eventDate: bulkEvent.eventDate,
        description: bulkEvent.description,
        handledByUserId: currentUserId,
        status: "Đã gửi",
        location: bulkEvent.location,
        notes: bulkEvent.notes,
        suppliesUsed: suppliesPayload,
        request: "Không có yêu cầu đặc biệt",
      };

      return axios.post("/api/MedicalEvent", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });

    Promise.all(promises)
      .then((responses) => {
        console.log("✅ Tạo hàng loạt sự cố thành công:", responses);
        const addedEvents = responses.map((res) => ({
          ...res.data,
          handledByName: "Bạn",
        }));
        setEvents((prev) => [...prev, ...addedEvents]);
        setShowBulkCreateForm(false);
        setBulkEvent({
          selectedStudents: [],
          eventTypeId: "",
          severityId: "",
          eventDate: new Date().toISOString().slice(0, 16),
          description: "",
          location: "",
          notes: "",
        });
        setBulkSuppliesUsed([]);
        fetchEvents();
        alert(`Đã tạo thành công ${responses.length} sự cố y tế!`);
      })
      .catch((err) => {
        const errorDetail =
          err.response?.data?.errors || err.response?.data || err.message;
        console.error("❌ Lỗi tạo hàng loạt sự cố:", errorDetail);
        alert(
          "Lỗi khi tạo hàng loạt sự cố:\n" +
            JSON.stringify(errorDetail, null, 2)
        );
      });
  };

  return (
    <div className={style.pageContainer}>
      <Sidebar />
      <div className={style.contentArea}>
        <div className={style.header}>
          <h2>Báo cáo sự cố y tế học đường</h2>
          <div className={style.headerButtons}>
            <button
              className={style.bulkAddButton}
              onClick={() => setShowBulkCreateForm(true)}
            >
              <Users size={16} /> Tạo hàng loạt
            </button>
            <button
              className={style.addButton}
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={16} /> Tạo sự cố mới
            </button>
          </div>
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
                    <span
                      className={
                        event.severityLevelName === "Nhẹ"
                          ? style.tagYellow
                          : event.severityLevelName === "Trung bình"
                          ? style.tagOrange
                          : style.tagRed
                      }
                    >
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
            <table className={style.detailTable}>
              <tbody>
                <tr>
                  <td>
                    <strong>Học sinh:</strong>
                  </td>
                  <td>{selectedEvent.studentName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Phụ huynh:</strong>
                  </td>
                  <td>{selectedEvent.parentName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Loại sự cố:</strong>
                  </td>
                  <td>{selectedEvent.eventType}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Mức độ:</strong>
                  </td>
                  <td>{selectedEvent.severityLevelName}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Thời gian:</strong>
                  </td>
                  <td>{new Date(selectedEvent.eventDate).toLocaleString()}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Địa điểm:</strong>
                  </td>
                  <td>{selectedEvent.location || "Không rõ"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Mô tả:</strong>
                  </td>
                  <td>{selectedEvent.description}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Ghi chú:</strong>
                  </td>
                  <td>{selectedEvent.notes || "Không có"}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Người xử lý:</strong>
                  </td>
                  <td>
                    {getStaffName(
                      selectedEvent.handledByUserId,
                      selectedEvent.handledByName
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {selectedEvent.suppliesUsed?.length > 0 && (
              <>
                <p>
                  <h4 className={style.sectionTitle}>Vật tư đã sử dụng:</h4>
                </p>
                <table className={style.detailTable}>
                  <thead>
                    <tr>
                      <th>Tên vật tư</th>
                      <th>Số lượng</th>
                      <th>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.suppliesUsed.map((supply, index) => (
                      <tr key={index}>
                        <td>{supply.supplyName}</td>
                        <td>
                          {supply.quantityUsed} {supply.unit || ""}
                        </td>
                        <td>{supply.note || "Không ghi chú"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {selectedMedicalHistory.length > 0 && (
              <>
                <p>
                  <h4 className={style.sectionTitle}>Tiền sử bệnh:</h4>
                </p>
                <table className={style.detailTable}>
                  <thead>
                    <tr>
                      <th>Bệnh</th>
                      <th>Ghi chú</th>
                      <th>Ngày chẩn đoán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMedicalHistory.map((mh) => (
                      <tr key={mh.historyId}>
                        <td>{mh.diseaseName}</td>
                        <td>{mh.note || "Không ghi chú"}</td>
                        <td>
                          {new Date(mh.diagnosedDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

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
              <button
                className={style.sendBtn}
                onClick={async () => {
                  // Lấy parentId từ API Student
                  try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                      `/api/Student/${selectedEvent.studentId}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    const parentId = res.data?.data?.parentId;
                    if (!parentId) {
                      alert("Không tìm thấy phụ huynh của học sinh này!");
                      return;
                    }
                    // Soạn message
                    const message = `Học sinh: ${
                      selectedEvent.studentName
                    }\nLoại sự cố: ${
                      selectedEvent.eventType
                    }\nThời gian: ${new Date(
                      selectedEvent.eventDate
                    ).toLocaleString()}\nMức độ: ${
                      selectedEvent.severityLevelName
                    }\nMô tả: ${selectedEvent.description}`;
                    await axios.post(
                      "/api/Notification/send",
                      {
                        receiverId: parentId,
                        title: "Thông báo sự cố y tế học đường",
                        message,
                        typeId: 2,
                        isRead: false,
                      },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    alert("Đã gửi thông báo cho phụ huynh!");
                  } catch {
                    alert("Gửi thông báo thất bại!");
                  }
                }}
              >
                Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}
      {showCreateForm && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Tạo sự cố mới</h3>
            {/* Dropdown chọn lớp */}
            <select
              value={selectedClass}
              onClick={() => {
                if (classList.length === 0 && students.length > 0) {
                  const uniqueClasses = Array.from(
                    new Set(students.map((s) => s.className).filter(Boolean))
                  );
                  setClassList(uniqueClasses);
                }
              }}
              onChange={async (e) => {
                const className = e.target.value;
                setSelectedClass(className);
                setNewEvent({ ...newEvent, studentId: "" });
                if (className) {
                  try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                      `/api/Student/by-class/${encodeURIComponent(className)}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setClassStudents(
                      Array.isArray(res.data.data) ? res.data.data : []
                    );
                  } catch {
                    setClassStudents([]);
                  }
                } else {
                  setClassStudents([]);
                }
              }}
              style={{ marginBottom: 12 }}
            >
              <option value="">-- Chọn lớp --</option>
              {classList.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>
            <Select
              options={
                Array.isArray(classStudents)
                  ? classStudents.map((s) => ({
                      value: s.studentId,
                      label: s.fullName,
                    }))
                  : []
              }
              placeholder={selectedClass ? "Tìm học sinh..." : "Chọn lớp trước"}
              isDisabled={!selectedClass}
              value={
                classStudents.find((s) => s.studentId === newEvent.studentId)
                  ? {
                      value: newEvent.studentId,
                      label: classStudents.find(
                        (s) => s.studentId === newEvent.studentId
                      )?.fullName,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setNewEvent({ ...newEvent, studentId: selectedOption.value })
              }
            />

            <select
              value={newEvent.eventTypeId}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventTypeId: e.target.value })
              }
            >
              <option value="">-- Loại sự cố --</option>
              {eventTypes.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.name}
                </option>
              ))}
            </select>

            <select
              value={newEvent.severityId}
              onChange={(e) =>
                setNewEvent({ ...newEvent, severityId: e.target.value })
              }
            >
              <option value="">-- Mức độ --</option>
              {severityLevels.map((sl) => (
                <option key={sl.id} value={sl.id}>
                  {sl.level}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={newEvent.eventDate}
              onChange={(e) =>
                setNewEvent({ ...newEvent, eventDate: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Địa điểm xảy ra sự cố"
              value={newEvent.location}
              onChange={(e) =>
                setNewEvent({ ...newEvent, location: e.target.value })
              }
            />

            <textarea
              placeholder="Mô tả"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
            />

            <textarea
              placeholder="Ghi chú"
              value={newEvent.notes}
              onChange={(e) =>
                setNewEvent({ ...newEvent, notes: e.target.value })
              }
            />

            <h4 className={style.sectionTitle}>Vật tư đã sử dụng:</h4>
            {suppliesUsed.map((s, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <select
                  value={s.supplyID}
                  onChange={(e) => {
                    const updated = [...suppliesUsed];
                    updated[index].supplyID = e.target.value;
                    setSuppliesUsed(updated);
                  }}
                >
                  <option value="">-- Chọn vật tư --</option>
                  {Array.isArray(supplies)
                    ? supplies.map((supply) => (
                        <option key={supply.supplyID} value={supply.supplyID}>
                          {supply.name}
                        </option>
                      ))
                    : null}
                </select>

                <input
                  type="number"
                  placeholder="Số lượng"
                  value={s.quantityUsed}
                  onChange={(e) => {
                    const updated = [...suppliesUsed];
                    updated[index].quantityUsed = e.target.value;
                    setSuppliesUsed(updated);
                  }}
                  style={{ width: "80px" }}
                />

                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={s.note}
                  onChange={(e) => {
                    const updated = [...suppliesUsed];
                    updated[index].note = e.target.value;
                    setSuppliesUsed(updated);
                  }}
                />

                <button
                  onClick={() => {
                    const updated = [...suppliesUsed];
                    updated.splice(index, 1);
                    setSuppliesUsed(updated);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setSuppliesUsed([
                  ...suppliesUsed,
                  { supplyID: "", quantityUsed: 1, note: "" },
                ])
              }
              style={{ marginBottom: "10px" }}
            >
              + Thêm vật tư
            </button>

            <div className={style.modalActions}>
              <button className={style.tagBlue} onClick={handleCreate}>
                Tạo
              </button>

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
      {showEditForm && editingEvent && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Chỉnh sửa sự cố</h3>

            <label className={style.infoLabel}>
              Học sinh: <strong>{editingEvent.studentName}</strong>
            </label>
            <label className={style.infoLabel}>
              Loại sự cố: <strong>{editingEvent.eventType}</strong>
            </label>

            <select
              value={editingEvent.severityId}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, severityId: e.target.value })
              }
            >
              <option value="">-- Mức độ --</option>
              {severityLevels.map((sl) => (
                <option key={sl.id} value={sl.id}>
                  {sl.level}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Địa điểm xảy ra sự cố"
              value={editingEvent.location}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, location: e.target.value })
              }
            />

            <textarea
              placeholder="Mô tả"
              value={editingEvent.description}
              onChange={(e) =>
                setEditingEvent({
                  ...editingEvent,
                  description: e.target.value,
                })
              }
            />

            <textarea
              placeholder="Ghi chú"
              value={editingEvent.notes}
              onChange={(e) =>
                setEditingEvent({ ...editingEvent, notes: e.target.value })
              }
            />

            <h4 className={style.sectionTitle}>Vật tư đã sử dụng:</h4>
            {(editingEvent.suppliesUsed || []).map((s, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <select
                  value={s.supplyID}
                  onChange={(e) => {
                    const updated = [...editingEvent.suppliesUsed];
                    updated[index].supplyID = e.target.value;
                    setEditingEvent({
                      ...editingEvent,
                      suppliesUsed: updated,
                    });
                  }}
                >
                  <option value="">-- Chọn vật tư --</option>
                  {Array.isArray(supplies)
                    ? supplies.map((supply) => (
                        <option key={supply.supplyID} value={supply.supplyID}>
                          {supply.name}
                        </option>
                      ))
                    : null}
                </select>

                <input
                  type="number"
                  placeholder="Số lượng"
                  value={s.quantityUsed}
                  onChange={(e) => {
                    const updated = [...editingEvent.suppliesUsed];
                    updated[index].quantityUsed = e.target.value;
                    setEditingEvent({
                      ...editingEvent,
                      suppliesUsed: updated,
                    });
                  }}
                  style={{ width: "80px" }}
                />

                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={s.note}
                  onChange={(e) => {
                    const updated = [...editingEvent.suppliesUsed];
                    updated[index].note = e.target.value;
                    setEditingEvent({
                      ...editingEvent,
                      suppliesUsed: updated,
                    });
                  }}
                />

                <button
                  onClick={() => {
                    const updated = [...editingEvent.suppliesUsed];
                    updated.splice(index, 1);
                    setEditingEvent({
                      ...editingEvent,
                      suppliesUsed: updated,
                    });
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setEditingEvent({
                  ...editingEvent,
                  suppliesUsed: [
                    ...(editingEvent.suppliesUsed || []),
                    { supplyID: "", quantityUsed: 1, note: "" },
                  ],
                })
              }
              style={{ marginBottom: "10px" }}
            >
              + Thêm vật tư
            </button>

            <div className={style.modalActions}>
              <button className={style.tagBlue} onClick={handleUpdate}>
                Cập nhật
              </button>
              <button
                className={style.closeBtn}
                onClick={() => {
                  setShowEditForm(false);
                  setEditingEvent(null);
                }}
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
      {showBulkCreateForm && (
        <div className={style.modalOverlay}>
          <div className={style.modalContent}>
            <h3>Tạo sự cố hàng loạt</h3>
            <p className={style.bulkDescription}>
              Chọn nhiều học sinh có cùng triệu chứng để tạo sự cố cùng lúc
            </p>

            {/* Dropdown chọn lớp */}
            <select
              value={selectedClass}
              onClick={() => {
                // Lấy danh sách lớp từ students nếu chưa có
                if (classList.length === 0 && students.length > 0) {
                  const uniqueClasses = Array.from(
                    new Set(students.map((s) => s.className).filter(Boolean))
                  );
                  setClassList(uniqueClasses);
                }
              }}
              onChange={async (e) => {
                const className = e.target.value;
                setSelectedClass(className);
                setBulkEvent({ ...bulkEvent, selectedStudents: [] });
                if (className) {
                  try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(
                      `/api/Student/by-class/${encodeURIComponent(className)}`,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );
                    setClassStudents(
                      Array.isArray(res.data.data) ? res.data.data : []
                    );
                  } catch {
                    setClassStudents([]);
                  }
                } else {
                  setClassStudents([]);
                }
              }}
              style={{ marginBottom: 12 }}
            >
              <option value="">-- Chọn lớp --</option>
              {classList.map((cl) => (
                <option key={cl} value={cl}>
                  {cl}
                </option>
              ))}
            </select>

            {/* Dropdown chọn học sinh theo lớp */}
            <Select
              isMulti
              isDisabled={!selectedClass}
              options={
                Array.isArray(classStudents)
                  ? classStudents.map((s) => ({
                      value: s.studentId,
                      label: s.fullName,
                    }))
                  : []
              }
              placeholder={
                selectedClass ? "Chọn học sinh..." : "Chọn lớp trước"
              }
              value={bulkEvent.selectedStudents
                .map((id) => {
                  const stu = classStudents.find((s) => s.studentId === id);
                  return stu
                    ? { value: stu.studentId, label: stu.fullName }
                    : null;
                })
                .filter(Boolean)}
              onChange={(selectedOptions) =>
                setBulkEvent({
                  ...bulkEvent,
                  selectedStudents: selectedOptions.map(
                    (option) => option.value
                  ),
                })
              }
            />

            <select
              value={bulkEvent.eventTypeId}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, eventTypeId: e.target.value })
              }
            >
              <option value="">-- Loại sự cố --</option>
              {eventTypes.map((et) => (
                <option key={et.id} value={et.id}>
                  {et.name}
                </option>
              ))}
            </select>

            <select
              value={bulkEvent.severityId}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, severityId: e.target.value })
              }
            >
              <option value="">-- Mức độ --</option>
              {severityLevels.map((sl) => (
                <option key={sl.id} value={sl.id}>
                  {sl.level}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={bulkEvent.eventDate}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, eventDate: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Địa điểm xảy ra sự cố"
              value={bulkEvent.location}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, location: e.target.value })
              }
            />

            <textarea
              placeholder="Mô tả chung cho tất cả học sinh"
              value={bulkEvent.description}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, description: e.target.value })
              }
            />

            <textarea
              placeholder="Ghi chú chung"
              value={bulkEvent.notes}
              onChange={(e) =>
                setBulkEvent({ ...bulkEvent, notes: e.target.value })
              }
            />

            <h4 className={style.sectionTitle}>Vật tư đã sử dụng (chung):</h4>
            {bulkSuppliesUsed.map((s, index) => (
              <div
                key={index}
                style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
              >
                <select
                  value={s.supplyID}
                  onChange={(e) => {
                    const updated = [...bulkSuppliesUsed];
                    updated[index].supplyID = e.target.value;
                    setBulkSuppliesUsed(updated);
                  }}
                >
                  <option value="">-- Chọn vật tư --</option>
                  {Array.isArray(supplies)
                    ? supplies.map((supply) => (
                        <option key={supply.supplyID} value={supply.supplyID}>
                          {supply.name}
                        </option>
                      ))
                    : null}
                </select>

                <input
                  type="number"
                  placeholder="Số lượng"
                  value={s.quantityUsed}
                  onChange={(e) => {
                    const updated = [...bulkSuppliesUsed];
                    updated[index].quantityUsed = e.target.value;
                    setBulkSuppliesUsed(updated);
                  }}
                  style={{ width: "80px" }}
                />

                <input
                  type="text"
                  placeholder="Ghi chú"
                  value={s.note}
                  onChange={(e) => {
                    const updated = [...bulkSuppliesUsed];
                    updated[index].note = e.target.value;
                    setBulkSuppliesUsed(updated);
                  }}
                />

                <button
                  onClick={() => {
                    const updated = [...bulkSuppliesUsed];
                    updated.splice(index, 1);
                    setBulkSuppliesUsed(updated);
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setBulkSuppliesUsed([
                  ...bulkSuppliesUsed,
                  { supplyID: "", quantityUsed: 1, note: "" },
                ])
              }
              style={{ marginBottom: "10px" }}
            >
              + Thêm vật tư
            </button>

            {bulkEvent.selectedStudents.length > 0 && (
              <div className={style.selectedStudents}>
                <h4>Học sinh đã chọn ({bulkEvent.selectedStudents.length}):</h4>
                <div className={style.studentList}>
                  {bulkEvent.selectedStudents.map((studentId) => {
                    const student = students.find(
                      (s) => s.studentId === studentId
                    );
                    return (
                      <span key={studentId} className={style.studentTag}>
                        {student?.fullName || studentId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className={style.modalActions}>
              <button className={style.tagBlue} onClick={handleBulkCreate}>
                Tạo cho {bulkEvent.selectedStudents.length} học sinh
              </button>
              <button
                className={style.closeBtn}
                onClick={() => setShowBulkCreateForm(false)}
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
