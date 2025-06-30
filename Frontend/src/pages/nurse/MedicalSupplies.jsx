import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileDown, FileSpreadsheet, FileText } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/MedicalSupplies.module.css";

const MedicalSupplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    expiryDate: "",
  });

  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_URL =
    "https://swp-school-medical-management.onrender.com/api/MedicalSupplies";

  useEffect(() => {
    fetchSupplies();
  }, []);
  const fetchSupplies = () => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log("API data:", res.data);
        setSupplies(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => console.error("❌ Lỗi khi tải vật tư:", err));
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "put" : "post";

    axios[method](url, formData)
      .then(() => {
        fetchSupplies();
        setShowModal(false);
        setEditingId(null);
        setFormData({ name: "", quantity: "", unit: "", expiryDate: "" });
      })
      .catch((err) => console.error("❌ Lỗi thêm/cập nhật:", err));
  };

  const filteredSupplies = Array.isArray(supplies)
    ? supplies.filter((s) =>
        (s.name || "").toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

  const paginatedSupplies = filteredSupplies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSupplies.length / itemsPerPage);

  const isNearExpiry = (dateStr) => {
    const daysLeft = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    return daysLeft <= 30;
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredSupplies);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vật tư y tế");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Danh_sach_vat_tu.xlsx");
  };

  const top5Supplies = Array.isArray(supplies)
    ? [...supplies].sort((a, b) => b.quantity - a.quantity).slice(0, 5)
    : [];

  return (
    <div className={style.wrapper}>
      <Sidebar />
      <div className={style.content}>
        <div className={style.header}>
          <h2 className={style.title}>Danh sách vật tư y tế</h2>
          <div className={style.actions}>
            <input
              type="text"
              placeholder="Tìm vật tư..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className={style.searchInput}
            />
            <button className={style.exportBtn} onClick={handleExportExcel}>
              <FileSpreadsheet size={18} style={{ marginRight: "6px" }} />
              Xuất Excel
            </button>

            <button
              className={style.addButton}
              onClick={() => {
                setFormData({
                  name: "",
                  quantity: "",
                  unit: "",
                  expiryDate: "",
                });
                setEditingId(null);
                setShowModal(true);
              }}
            >
              + Thêm vật tư
            </button>
          </div>
        </div>

        <table className={style.table}>
          <thead>
            <tr>
              <th>Tên vật tư</th>
              <th>Số lượng</th>
              <th>Đơn vị</th>
              <th>Hạn sử dụng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSupplies.length > 0 ? (
              paginatedSupplies.map((item) => (
                <tr key={item.supplyID}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td
                    style={{
                      color: isNearExpiry(item.expiryDate) ? "red" : "#333",
                      fontWeight: isNearExpiry(item.expiryDate)
                        ? "bold"
                        : "normal",
                    }}
                  >
                    {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <button
                      className={style.editBtn}
                      onClick={() => {
                        setFormData(item);
                        setEditingId(item.supplyID);
                        setShowModal(true);
                      }}
                    >
                      Sửa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    color: "#888",
                  }}
                >
                  Không có dữ liệu vật tư.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className={style.pagination}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? style.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Biểu đồ tồn kho */}
        <div className={style.chartBox}>
          <h3>Biểu đồ tồn kho (Top 5)</h3>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={top5Supplies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#20b2aa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={style.modalOverlay}>
            <div className={style.modal}>
              <h3>{editingId ? "Cập nhật vật tư" : "Thêm vật tư mới"}</h3>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên vật tư"
              />
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Số lượng"
              />
              <input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Đơn vị"
              />
              <input
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="Hạn sử dụng"
              />
              <div className={style.modalActions}>
                <button onClick={handleSubmit}>
                  {editingId ? "Cập nhật" : "Thêm"}
                </button>
                <button onClick={() => setShowModal(false)}>Huỷ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalSupplies;
