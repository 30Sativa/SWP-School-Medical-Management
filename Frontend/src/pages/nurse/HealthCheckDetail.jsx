import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/css/HealthCheckDetail.module.css";

const HealthCheckDetail = () => {
  const { campaignId } = useParams(); // Lấy campaignId từ URL
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null); // Thêm state cho chiến dịch
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [healthCheckSummaries, setHealthCheckSummaries] = useState([]);
  const [showSaveStudentId, setShowSaveStudentId] = useState(null); // Lưu studentId đang ghi nhận
  const [editRecordId, setEditRecordId] = useState(null); // Lưu recordId đang chỉnh sửa

  // Hàm xử lý dữ liệu form khi submit
  const handleFormSubmit = async (e, studentId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const healthDetails = Object.fromEntries(formData.entries());

    // Log dữ liệu form để kiểm tra
    console.log("Dữ liệu form: ", healthDetails);

    // Gửi dữ liệu đến API
    const dataToSubmit = {
      studentId: studentId,
      campaignId: campaignId,
      bloodPressure: healthDetails.bloodPressure,
      heartRate: healthDetails.heartRate,
      height: healthDetails.height,
      weight: healthDetails.weight,
      bmi: healthDetails.bmi,
      visionSummary: healthDetails.vision,
      ent: healthDetails.ent,
      entNotes: healthDetails.entNotes,
      mouth: healthDetails.mouth,
      throat: healthDetails.throat,
      toothDecay: healthDetails.teeth,
      toothNotes: healthDetails.teethNotes,
      generalNote: healthDetails.overallHealth,
      followUpNote: healthDetails.recommendation,
      consentStatusId: 1, // Giả sử consentStatusId là 1 khi đồng ý
      isActive: true
    };

    console.log("Dữ liệu gửi đi: ", dataToSubmit); // Kiểm tra dữ liệu gửi đi

    try {
      const response = await axios.post(
        "https://swp-school-medical-management.onrender.com/api/health-checks/summaries",
        dataToSubmit
      );
      console.log("Dữ liệu đã được lưu:", response.data);
      alert("Thông tin sức khỏe đã được ghi nhận!");
      setShowSaveStudentId(null); // Đóng form sau khi lưu thành công
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
        alert("Có lỗi xảy ra khi lưu thông tin: " + error.response.data.message);
      } else {
        alert("Có lỗi xảy ra khi gửi yêu cầu!");
      }
    }
  };

  // Hàm chỉnh sửa thông tin sức khỏe học sinh
  const handleEditSubmit = async (e, recordId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const healthDetails = Object.fromEntries(formData.entries());

    // Gửi dữ liệu cập nhật đến API
    const dataToUpdate = {
      bloodPressure: healthDetails.bloodPressure,
      heartRate: healthDetails.heartRate,
      height: healthDetails.height,
      weight: healthDetails.weight,
      bmi: healthDetails.bmi,
      visionSummary: healthDetails.vision,
      ent: healthDetails.ent,
      entNotes: healthDetails.entNotes,
      mouth: healthDetails.mouth,
      throat: healthDetails.throat,
      toothDecay: healthDetails.teeth,
      toothNotes: healthDetails.teethNotes,
      generalNote: healthDetails.overallHealth,
      followUpNote: healthDetails.recommendation,
      consentStatusId: 1, // hoặc lấy từ form nếu cần
      isActive: true
    };

    try {
      const response = await axios.put(
        `https://swp-school-medical-management.onrender.com/api/health-checks/summaries/${recordId}`,
        dataToUpdate
      );
      console.log("Dữ liệu đã được cập nhật:", response.data);
      alert("Cập nhật thông tin sức khỏe thành công!");
      // Có thể reload lại dữ liệu hoặc đóng form chỉnh sửa ở đây
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      if (error.response) {
        alert("Có lỗi xảy ra khi cập nhật: " + error.response.data.message);
      } else {
        alert("Có lỗi xảy ra khi gửi yêu cầu cập nhật!");
      }
    }
  };

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        const campaignRes = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/HealthCheckCampaign/${campaignId}`
        );
        console.log("Campaign data:", campaignRes.data); // Kiểm tra dữ liệu chiến dịch
        setCampaign(campaignRes.data.data); // Lưu chiến dịch
        // Lấy danh sách học sinh tham gia chiến dịch
        const studentsRes = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/student/`
        );
        setStudents(studentsRes.data);
        // Lấy toàn bộ health check summaries
        const summariesRes = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/health-checks/summaries`
        );
        setHealthCheckSummaries(summariesRes.data || []);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignDetail();
  }, [campaignId]);

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  if (loading) return <div>Đang tải danh sách học sinh...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Danh sách học sinh - Chiến dịch #{campaignId}
      </h1>

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ⬅ Quay lại
      </button>

      {campaign && (
        <div>
          <p>
            <strong>Tên chiến dịch:</strong> {campaign.title}
          </p>
          <p>
            <strong>Ngày tiêm:</strong> {campaign.date}
          </p>
          <p>
            <strong>Mô tả:</strong> {campaign.description}
          </p>
          <p>
            <strong>Trạng thái:</strong> {campaign.statusName}
          </p>
        </div>
      )}

      {students.length === 0 ? (
        <p>Không có học sinh trong chiến dịch này.</p>
      ) : (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên học sinh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => {
                const filteredSummaries = healthCheckSummaries.filter(
                  (s) => Number(s.campaignId) === Number(campaignId)
                );
                const summary = filteredSummaries.find(
                  (s) => Number(s.studentId) === Number(student.studentId)
                );
                const recordId = summary ? summary.recordId : null;
                return (
                  <tr key={student.studentId}>
                    <td>{indexOfFirstItem + index + 1}</td>
                    <td>{student.fullName || "Tên học sinh không có"}</td>
                    <td className={styles.actionButtons}>
                      {recordId ? (
                        <>
                          <Link to={`/health-record/${recordId}`}>
                            <button className={styles.viewButton}>
                              Xem chi tiết
                            </button>
                          </Link>
                          {campaign &&
                            campaign.statusName === "Đang diễn ra" && (
                              editRecordId === recordId ? (
                                <form
                                  className={styles.saveForm}
                                  onSubmit={(e) => handleEditSubmit(e, recordId)}
                                >
                                  <label htmlFor="bloodPressure">Huyết áp:</label>
                                  <input
                                    type="number"
                                    id="bloodPressure"
                                    name="bloodPressure"
                                    defaultValue={summary.bloodPressure}
                                    required
                                  />
                                  <label htmlFor="heartRate">Nhịp tim:</label>
                                  <input
                                    type="number"
                                    id="heartRate"
                                    name="heartRate"
                                    defaultValue={summary.heartRate}
                                    required
                                  />
                                  <label htmlFor="height">Chiều cao (cm):</label>
                                  <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    defaultValue={summary.height}
                                    required
                                  />
                                  <label htmlFor="weight">Cân nặng (kg):</label>
                                  <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    defaultValue={summary.weight}
                                    required
                                  />
                                  <label htmlFor="bmi">BMI:</label>
                                  <input
                                    type="number"
                                    id="bmi"
                                    name="bmi"
                                    defaultValue={summary.bmi}
                                    required
                                  />
                                  <label htmlFor="vision">Mắt:</label>
                                  <input
                                    type="text"
                                    id="vision"
                                    name="vision"
                                    defaultValue={summary.visionSummary}
                                    required
                                  />
                                  <label htmlFor="ent">Tai-Mũi-Họng:</label>
                                  <input
                                    type="text"
                                    id="ent"
                                    name="ent"
                                    defaultValue={summary.ent}
                                    required
                                  />
                                  <label htmlFor="entNotes">Ghi chú TMH:</label>
                                  <input
                                    type="text"
                                    id="entNotes"
                                    name="entNotes"
                                    defaultValue={summary.entNotes}
                                  />
                                  <label htmlFor="mouth">Miệng:</label>
                                  <input
                                    type="text"
                                    id="mouth"
                                    name="mouth"
                                    defaultValue={summary.mouth}
                                    required
                                  />
                                  <label htmlFor="teeth">Sâu răng:</label>
                                  <input
                                    type="text"
                                    id="teeth"
                                    name="teeth"
                                    defaultValue={summary.toothDecay}
                                  />
                                  <label htmlFor="teethNotes">Ghi chú răng:</label>
                                  <input
                                    type="text"
                                    id="teethNotes"
                                    name="teethNotes"
                                    defaultValue={summary.toothNotes}
                                  />
                                  <label htmlFor="overallHealth">Sức khỏe chung:</label>
                                  <input
                                    type="text"
                                    id="overallHealth"
                                    name="overallHealth"
                                    defaultValue={summary.generalNote}
                                    required
                                  />
                                  <label htmlFor="recommendation">Khuyến nghị:</label>
                                  <input
                                    type="text"
                                    id="recommendation"
                                    name="recommendation"
                                    defaultValue={summary.followUpNote}
                                  />
                                  <button type="submit" className={styles.saveButton}>
                                    Lưu chỉnh sửa
                                  </button>
                                  <button type="button" onClick={() => setEditRecordId(null)}>
                                    Hủy
                                  </button>
                                </form>
                              ) : (
                                <button
                                  className={styles.editButton}
                                  onClick={() => setEditRecordId(recordId)}
                                >
                                  Chỉnh sửa
                                </button>
                              )
                            )}
                        </>
                      ) : (
                        campaign &&
                        campaign.statusName === "Đang diễn ra" && (
                          <div>
                            {showSaveStudentId === student.studentId ? (
                              <form
                                className={styles.saveForm}
                                onSubmit={(e) => handleFormSubmit(e, student.studentId)}
                              >
                                <label htmlFor="bloodPressure">Huyết áp:</label>
                                <input
                                  type="number"
                                  id="bloodPressure"
                                  name="bloodPressure"
                                  placeholder="Nhập huyết áp"
                                  required
                                />
                                <label htmlFor="heartRate">Nhịp tim:</label>
                                <input
                                  type="number"
                                  id="heartRate"
                                  name="heartRate"
                                  placeholder="Nhập nhịp tim"
                                  required
                                />
                                <label htmlFor="height">Chiều cao (cm):</label>
                                <input
                                  type="number"
                                  id="height"
                                  name="height"
                                  placeholder="Nhập chiều cao"
                                  required
                                />
                                <label htmlFor="weight">Cân nặng (kg):</label>
                                <input
                                  type="number"
                                  id="weight"
                                  name="weight"
                                  placeholder="Nhập cân nặng"
                                  required
                                />
                                <label htmlFor="bmi">BMI:</label>
                                <input
                                  type="number"
                                  id="bmi"
                                  name="bmi"
                                  placeholder="Nhập BMI"
                                  required
                                />
                                <label htmlFor="vision">Mắt:</label>
                                <input
                                  type="text"
                                  id="vision"
                                  name="vision"
                                  placeholder="Mắt"
                                  required
                                />
                                <label htmlFor="ent">Tai-Mũi-Họng:</label>
                                <input
                                  type="text"
                                  id="ent"
                                  name="ent"
                                  placeholder="Tai-Mũi-Họng"
                                  required
                                />
                                <label htmlFor="entNotes">Ghi chú TMH:</label>
                                <input
                                  type="text"
                                  id="entNotes"
                                  name="entNotes"
                                  placeholder="Ghi chú TMH"
                                />
                                <label htmlFor="mouth">Miệng:</label>
                                <input
                                  type="text"
                                  id="mouth"
                                  name="mouth"
                                  placeholder="Miệng"
                                  required
                                />
                                <label htmlFor="throat">Họng:</label>
                                <input
                                  type="text"
                                  id="throat"
                                  name="throat"
                                  placeholder="Họng"
                                  required
                                />
                                <label htmlFor="teeth">Sâu răng:</label>
                                <input
                                  type="text"
                                  id="teeth"
                                  name="teeth"
                                  placeholder="Sâu răng"
                                />
                                <label htmlFor="teethNotes">Ghi chú răng:</label>
                                <input
                                  type="text"
                                  id="teethNotes"
                                  name="teethNotes"
                                  placeholder="Ghi chú răng"
                                />
                                <label htmlFor="overallHealth">Sức khỏe chung:</label>
                                <input
                                  type="text"
                                  id="overallHealth"
                                  name="overallHealth"
                                  placeholder="Sức khỏe chung"
                                  required
                                />
                                <label htmlFor="recommendation">Khuyến nghị:</label>
                                <input
                                  type="text"
                                  id="recommendation"
                                  name="recommendation"
                                  placeholder="Khuyến nghị"
                                />
                                <button type="submit" className={styles.saveButton}>
                                  Lưu
                                </button>
                                <button type="button" onClick={() => setShowSaveStudentId(null)}>
                                  Hủy
                                </button>
                              </form>
                            ) : (
                              <button
                                className={styles.editButton}
                                onClick={() => setShowSaveStudentId(student.studentId)}
                              >
                                Ghi nhận
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button onClick={handlePrev} disabled={currentPage === 1}>
              ⬅ Trang trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? styles.activePage : ""}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={handleNext} disabled={currentPage === totalPages}>
              Trang sau ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HealthCheckDetail;
