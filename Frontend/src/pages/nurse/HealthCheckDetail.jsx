import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import styles from "../../assets/css/HealthCheckDetail.module.css";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

const HealthCheckDetail = () => {
  const { campaignId } = useParams(); // Lấy campaignId từ URL
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false); // loading khi submit modal
  const [campaign, setCampaign] = useState(null); // Thêm state cho chiến dịch
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [healthCheckSummaries, setHealthCheckSummaries] = useState([]);
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [modalType, setModalType] = useState(''); // 'add' hoặc 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null); // Học sinh được chọn
  const [selectedRecord, setSelectedRecord] = useState(null); // Record được chọn để edit

  // Hàm xử lý dữ liệu form khi submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    const formData = new FormData(e.target);
    const healthDetails = Object.fromEntries(formData.entries());

    // Log dữ liệu form để kiểm tra
    console.log("Dữ liệu form: ", healthDetails);

    // Gửi dữ liệu đến API
    const dataToSubmit = {
      studentId: selectedStudent.studentId,
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
      isActive: true,
    };

    console.log("Dữ liệu gửi đi: ", dataToSubmit); // Kiểm tra dữ liệu gửi đi

    try {
      const response = await axios.post(
        "https://swp-school-medical-management.onrender.com/api/health-checks/summaries",
        dataToSubmit
      );
      console.log("Dữ liệu đã được lưu:", response.data);
      notifySuccess("Thông tin sức khỏe đã được ghi nhận!");
      setShowModal(false); // Đóng modal sau khi lưu thành công
      // Reload data
      fetchData();
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      if (error.response) {
        console.error("Lỗi từ server:", error.response.data);
       notifyError("Có lỗi xảy ra khi lưu thông tin: " + error.response.data.message);
      } else {
        notifyError("Có lỗi xảy ra khi gửi yêu cầu!");
      }
    } finally {
      setModalLoading(false);
    }
  };

  // Hàm chỉnh sửa thông tin sức khỏe học sinh
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
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
      isActive: true,
    };

    try {
      const response = await axios.put(
        `https://swp-school-medical-management.onrender.com/api/health-checks/summaries/${selectedRecord.recordId}`,
        dataToUpdate
      );
      console.log("Dữ liệu đã được cập nhật:", response.data);
      notifySuccess("Cập nhật thông tin sức khỏe thành công!");
      setShowModal(false); // Đóng modal sau khi cập nhật thành công
      // Reload data
      fetchData();
    } catch (error) {
      console.error("Lỗi khi cập nhật dữ liệu:", error);
      if (error.response) {
        notifyError("Có lỗi xảy ra khi cập nhật: " + error.response.data.message);
      } else {
        notifyError("Có lỗi xảy ra khi gửi yêu cầu cập nhật!");
      }
    } finally {
      setModalLoading(false);
    }
  };

  const sendNotificationToAll = async () => {
    if (!campaign) return;
    try {
      await Promise.all(
        students.map(async (student) => {
          if (!student.parentId) return;
          await axios.post(
            "https://swp-school-medical-management.onrender.com/api/Notification/send",
            {
              receiverId: student.parentId,
              title: "Thông báo kiểm tra sức khỏe",
              message: `Học sinh ${student.fullName} sẽ tham gia chiến dịch kiểm tra sức khỏe: ${campaign.title}.\nMô tả: ${campaign.description}.\nNgày kiểm tra: ${campaign.date}`,
              typeId: 2,
              isRead: false,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        })
      );
      notifySuccess("Đã gửi thông báo cho tất cả phụ huynh!");
    } catch (error) {
      console.error("Lỗi khi gửi thông báo hàng loạt:", error);
      notifyError("Gửi thông báo thất bại. Vui lòng thử lại!");
    }
  };

  const fetchData = async () => {
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
      setStudents(studentsRes.data.data || []);
      // Lấy toàn bộ health check summaries
      const summariesRes = await axios.get(
        `https://swp-school-medical-management.onrender.com/api/health-checks/summaries`
      );
      setHealthCheckSummaries(summariesRes.data.data || []);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [campaignId]);

  // Hàm mở modal để thêm mới
  const openAddModal = (student) => {
    setSelectedStudent(student);
    setSelectedRecord(null);
    setModalType('add');
    setShowModal(true);
  };

  // Hàm mở modal để chỉnh sửa
  const openEditModal = (student, record) => {
    setSelectedStudent(student);
    setSelectedRecord(record);
    setModalType('edit');
    setShowModal(true);
  };

  // Hàm đóng modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setSelectedRecord(null);
    setModalType('');
  };

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

  if (loading || modalLoading) return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
    </div>
  );

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
          {campaign.statusName === "Chưa bắt đầu" && (
            <button
              onClick={sendNotificationToAll}
              className={styles.notifyButton}
            >
              Gửi thông báo
            </button>
          )}
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
                              <button
                                className={styles.editButton}
                                onClick={() => openEditModal(student, summary)}
                              >
                                Chỉnh sửa
                              </button>
                            )}
                        </>
                      ) : (
                        campaign &&
                        campaign.statusName === "Đang diễn ra" && (
                          <button
                            className={styles.editButton}
                            onClick={() => openAddModal(student)}
                          >
                            Ghi nhận
                          </button>
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

      {/* Modal Form */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={modalType === 'add' ? 'Ghi nhận thông tin sức khỏe' : 'Chỉnh sửa thông tin sức khỏe'}
      >
        <form onSubmit={modalType === 'add' ? handleFormSubmit : handleEditSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="bloodPressure">Huyết áp:</label>
            <input
              type="number"
              id="bloodPressure"
              name="bloodPressure"
              defaultValue={modalType === 'edit' ? selectedRecord?.bloodPressure : ''}
              placeholder="Nhập huyết áp"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="heartRate">Nhịp tim:</label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              defaultValue={modalType === 'edit' ? selectedRecord?.heartRate : ''}
              placeholder="Nhập nhịp tim"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="height">Chiều cao (cm):</label>
            <input
              type="number"
              id="height"
              name="height"
              defaultValue={modalType === 'edit' ? selectedRecord?.height : ''}
              placeholder="Nhập chiều cao"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="weight">Cân nặng (kg):</label>
            <input
              type="number"
              id="weight"
              name="weight"
              defaultValue={modalType === 'edit' ? selectedRecord?.weight : ''}
              placeholder="Nhập cân nặng"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="bmi">BMI:</label>
            <input
              type="number"
              id="bmi"
              name="bmi"
              defaultValue={modalType === 'edit' ? selectedRecord?.bmi : ''}
              placeholder="Nhập BMI"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="vision">Mắt:</label>
            <input
              type="text"
              id="vision"
              name="vision"
              defaultValue={modalType === 'edit' ? selectedRecord?.visionSummary : ''}
              placeholder="Mắt"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="ent">Tai-Mũi-Họng:</label>
            <input
              type="text"
              id="ent"
              name="ent"
              defaultValue={modalType === 'edit' ? selectedRecord?.ent : ''}
              placeholder="Tai-Mũi-Họng"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="entNotes">Ghi chú TMH:</label>
            <input
              type="text"
              id="entNotes"
              name="entNotes"
              defaultValue={modalType === 'edit' ? selectedRecord?.entNotes : ''}
              placeholder="Ghi chú TMH"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="mouth">Miệng:</label>
            <input
              type="text"
              id="mouth"
              name="mouth"
              defaultValue={modalType === 'edit' ? selectedRecord?.mouth : ''}
              placeholder="Miệng"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="throat">Họng:</label>
            <input
              type="text"
              id="throat"
              name="throat"
              defaultValue={modalType === 'edit' ? selectedRecord?.throat : ''}
              placeholder="Họng"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="teeth">Sâu răng:</label>
            <input
              type="text"
              id="teeth"
              name="teeth"
              defaultValue={modalType === 'edit' ? selectedRecord?.toothDecay : ''}
              placeholder="Sâu răng"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="teethNotes">Ghi chú răng:</label>
            <input
              type="text"
              id="teethNotes"
              name="teethNotes"
              defaultValue={modalType === 'edit' ? selectedRecord?.toothNotes : ''}
              placeholder="Ghi chú răng"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="overallHealth">Sức khỏe chung:</label>
            <input
              type="text"
              id="overallHealth"
              name="overallHealth"
              defaultValue={modalType === 'edit' ? selectedRecord?.generalNote : ''}
              placeholder="Sức khỏe chung"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="recommendation">Khuyến nghị:</label>
            <input
              type="text"
              id="recommendation"
              name="recommendation"
              defaultValue={modalType === 'edit' ? selectedRecord?.followUpNote : ''}
              placeholder="Khuyến nghị"
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="button" onClick={closeModal} className={styles.cancelButton}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton}>
              {modalType === 'add' ? 'Lưu' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </Modal>
      <Notification />
    </div>
  );
  
};

export default HealthCheckDetail;
