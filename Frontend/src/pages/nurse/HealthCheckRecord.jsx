import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import styles from "../../assets/css/HealthCheckRecord.module.css";

const HealthCheckRecord = () => {
  const { recordId } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const campaignStatus = location.state?.campaignStatus;
  const isEditMode = location.pathname.includes('/healthcheck-detail/');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  // Nếu là ghi nhận mới (recordId === 'new')
  const isNewRecord = recordId === 'new';
  const state = location.state || {};
  const [newRecord, setNewRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    height: '',
    weight: '',
    bmi: '',
    visionSummary: '',
    ent: '',
    entNotes: '',
    mouth: '',
    toothDecay: '',
    toothNotes: '',
    throat: '',
    generalNote: '',
    followUpNote: '',
    consentStatusId: 1,
    isActive: true,
  });

  // Tự động tính BMI khi height/weight thay đổi
  useEffect(() => {
    if (newRecord.height && newRecord.weight) {
      const h = parseFloat(newRecord.height) / 100;
      const w = parseFloat(newRecord.weight);
      if (h > 0 && w > 0) {
        setNewRecord(r => ({ ...r, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
  }, [newRecord.height, newRecord.weight]);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(r => ({ ...r, [name]: value }));
  };

  const handleNewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://swp-school-medical-management.onrender.com/api/health-checks/summaries', {
        ...newRecord,
        studentId: state.studentId,
        campaignId: state.campaignId,
        throat: newRecord.throat || '',
        consentStatusId: 1,
        isActive: true,
        generalNote: newRecord.generalNote,
        bloodPressure: Number(newRecord.bloodPressure),
        heartRate: Number(newRecord.heartRate),
        height: Number(newRecord.height),
        weight: Number(newRecord.weight),
        bmi: Number(newRecord.bmi),
      });
      alert('Ghi nhận thành công!');
      navigate(-1);
    } catch (error) {
      alert('Lỗi ghi nhận! ' + (error.response?.data?.message || error.message));
    }
  };

  useEffect(() => {
    const fetchRecord = async () => {
      console.log("Fetching record with ID:", recordId);
      try {
        const res = await axios.get(
          `https://swp-school-medical-management.onrender.com/api/health-checks/summaries/${recordId}`
        );
        console.log("Full API Response:", res);
        console.log("Response data:", res.data);

        if (res.data.status === "200") {
          console.log("Setting record data:", res.data.data);
          setRecord(res.data.data);
          if (res.data.data.campaignStatus === "Đang diễn ra" && isEditMode) {
            setIsEditing(true);
          }
        } else {
          console.log("No data found or invalid status");
          setRecord(null);
        }
      } catch (error) {
        console.error("API Error Details:", {
          message: error.message,
          response: error.response,
          status: error.response?.status,
        });
        setRecord(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [recordId, isEditMode, campaignStatus]);

  // Tự động tính BMI khi height/weight thay đổi ở chế độ chỉnh sửa
  useEffect(() => {
    if (isEditing && record && record.height && record.weight) {
      const h = parseFloat(record.height) / 100;
      const w = parseFloat(record.weight);
      if (h > 0 && w > 0) {
        setRecord(r => ({ ...r, bmi: (w / (h * h)).toFixed(1) }));
      }
    }
    // eslint-disable-next-line
  }, [isEditing, record?.height, record?.weight]);

  if (loading) return <div>Đang tải dữ liệu...</div>;

  if (!record)
    return (
      <div>
        <p>Không tìm thấy thông tin khám sức khỏe.</p>
        <button onClick={() => navigate(-1)}>⬅ Quay lại</button>
      </div>
    );

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isNewRecord) {
        // Tạo mới
        await axios.post('https://swp-school-medical-management.onrender.com/api/health-checks/summaries', {
          ...record,
          throat: record.throat || '',
          consentStatusId: 1,
          isActive: true,
          generalNote: record.generalNote,
          bloodPressure: Number(record.bloodPressure),
          heartRate: Number(record.heartRate),
          height: Number(record.height),
          weight: Number(record.weight),
          bmi: Number(record.bmi),
        });
        alert('Ghi nhận thành công!');
        navigate(-1);
      } else {
        // Cập nhật
        const res = await axios.put(
          `https://swp-school-medical-management.onrender.com/api/health-checks/summaries/${recordId}`,
          {
            ...record,
            throat: record.throat || '',
            consentStatusId: 1,
            isActive: true,
            generalNote: record.generalNote,
            bloodPressure: Number(record.bloodPressure),
            heartRate: Number(record.heartRate),
            height: Number(record.height),
            weight: Number(record.weight),
            bmi: Number(record.bmi),
          }
        );
        if (res.status === 200) {
          alert("Cập nhật thành công!");
          setIsEditing(false);
        } else {
          alert("Lỗi cập nhật! " + (res.data?.message || ""));
        }
      }
    } catch (error) {
      alert("Lỗi khi gửi dữ liệu: " + (error.response?.data?.message || error.message));
      console.error("Error while submitting the data", error);
    }
  };

  if (isNewRecord) {
    return (
      <div className={styles.container}>
        <h2>Ghi nhận khám sức khỏe</h2>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ⬅ Quay lại
        </button>
        <form onSubmit={handleNewSubmit} className={styles.form}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Huyết áp</td>
                <td><input name="bloodPressure" value={newRecord.bloodPressure} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Nhịp tim</td>
                <td><input name="heartRate" value={newRecord.heartRate} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Chiều cao</td>
                <td><input name="height" value={newRecord.height} onChange={handleNewChange} required /> cm</td>
              </tr>
              <tr>
                <td>Cân nặng</td>
                <td><input name="weight" value={newRecord.weight} onChange={handleNewChange} required /> kg</td>
              </tr>
              <tr>
                <td>BMI</td>
                <td><input name="bmi" value={newRecord.bmi} readOnly /></td>
              </tr>
              <tr>
                <td>Mắt</td>
                <td><input name="visionSummary" value={newRecord.visionSummary} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Tai-Mũi-Họng</td>
                <td><input name="ent" value={newRecord.ent} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Ghi chú TMH</td>
                <td><input name="entNotes" value={newRecord.entNotes} onChange={handleNewChange} /></td>
              </tr>
              <tr>
                <td>Miệng</td>
                <td><input name="mouth" value={newRecord.mouth} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Sâu răng</td>
                <td><input name="toothDecay" value={newRecord.toothDecay} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Ghi chú răng</td>
                <td><input name="toothNotes" value={newRecord.toothNotes} onChange={handleNewChange} /></td>
              </tr>
              <tr>
                <td>Họng</td>
                <td><input name="throat" value={newRecord.throat} onChange={handleNewChange} /></td>
              </tr>
              <tr>
                <td>Sức khỏe chung</td>
                <td><input name="generalNote" value={newRecord.generalNote} onChange={handleNewChange} required /></td>
              </tr>
              <tr>
                <td>Khuyến nghị</td>
                <td><input name="followUpNote" value={newRecord.followUpNote} onChange={handleNewChange} /></td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Lưu ghi nhận</button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Thông tin khám sức khỏe: {record.studentName}</h2>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ⬅ Quay lại
      </button>

      {(!isEditing && record.campaignStatus === "Đang diễn ra" && isEditMode) && (
        <button onClick={() => setIsEditing(true)} style={{ marginBottom: '10px' }}>Ghi nhận</button>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>Chiến dịch</td>
                <td>{record.campaignTitle}</td>
              </tr>
              <tr>
                <td>Huyết áp</td>
                <td>
                  <input
                    type="text"
                    value={record.bloodPressure}
                    onChange={(e) =>
                      setRecord({ ...record, bloodPressure: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Nhịp tim</td>
                <td>
                  <input
                    type="text"
                    value={record.heartRate}
                    onChange={(e) =>
                      setRecord({ ...record, heartRate: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Chiều cao</td>
                <td>
                  <input
                    type="number"
                    value={record.height}
                    onChange={(e) =>
                      setRecord({ ...record, height: e.target.value })
                    }
                  /> cm
                </td>
              </tr>
              <tr>
                <td>Cân nặng</td>
                <td>
                  <input
                    type="number"
                    value={record.weight}
                    onChange={(e) =>
                      setRecord({ ...record, weight: e.target.value })
                    }
                  /> kg
                </td>
              </tr>
              <tr>
                <td>BMI</td>
                <td>{record.bmi}</td>
              </tr>
              <tr>
                <td>Mắt</td>
                <td>
                  <input
                    type="text"
                    value={record.visionSummary}
                    onChange={(e) =>
                      setRecord({ ...record, visionSummary: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Tai-Mũi-Họng</td>
                <td>
                  <input
                    type="text"
                    value={record.ent}
                    onChange={(e) =>
                      setRecord({ ...record, ent: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Ghi chú TMH</td>
                <td>
                  <input
                    type="text"
                    value={record.entNotes}
                    onChange={(e) =>
                      setRecord({ ...record, entNotes: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Miệng</td>
                <td>
                  <input
                    type="text"
                    value={record.mouth}
                    onChange={(e) =>
                      setRecord({ ...record, mouth: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Sâu răng</td>
                <td>
                  <input
                    type="text"
                    value={record.toothDecay}
                    onChange={(e) =>
                      setRecord({ ...record, toothDecay: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Ghi chú răng</td>
                <td>
                  <input
                    type="text"
                    value={record.toothNotes}
                    onChange={(e) =>
                      setRecord({ ...record, toothNotes: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Họng</td>
                <td>
                  <input
                    type="text"
                    value={record.throat || ''}
                    onChange={(e) =>
                      setRecord({ ...record, throat: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Sức khỏe chung</td>
                <td>
                  <input
                    type="text"
                    value={record.generalNote}
                    onChange={(e) =>
                      setRecord({ ...record, generalNote: e.target.value })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Khuyến nghị</td>
                <td>
                  <input
                    type="text"
                    value={record.followUpNote}
                    onChange={(e) =>
                      setRecord({ ...record, followUpNote: e.target.value })
                    }
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="submit">Lưu thông tin</button>
        </form>
      ) : (
        <table className={styles.table}>
          <tbody>
            <tr>
              <td>Chiến dịch</td>
              <td>{record.campaignTitle}</td>
            </tr>
            <tr>
              <td>Huyết áp</td>
              <td>{record.bloodPressure}</td>
            </tr>
            <tr>
              <td>Nhịp tim</td>
              <td>{record.heartRate}</td>
            </tr>
            <tr>
              <td>Chiều cao</td>
              <td>{record.height} cm</td>
            </tr>
            <tr>
              <td>Cân nặng</td>
              <td>{record.weight} kg</td>
            </tr>
            <tr>
              <td>BMI</td>
              <td>{record.bmi}</td>
            </tr>
            <tr>
              <td>Mắt</td>
              <td>{record.visionSummary}</td>
            </tr>
            <tr>
              <td>Tai-Mũi-Họng</td>
              <td>{record.ent}</td>
            </tr>
            <tr>
              <td>Ghi chú TMH</td>
              <td>{record.entNotes}</td>
            </tr>
            <tr>
              <td>Miệng</td>
              <td>{record.mouth}</td>
            </tr>
            <tr>
              <td>Sâu răng</td>
              <td>{record.toothDecay}</td>
            </tr>
            <tr>
              <td>Ghi chú răng</td>
              <td>{record.toothNotes}</td>
            </tr>
            <tr>
              <td>Họng</td>
              <td>{record.throat || ''}</td>
            </tr>
            <tr>
              <td>Sức khỏe chung</td>
              <td>{record.generalNote}</td>
            </tr>
            <tr>
              <td>Khuyến nghị</td>
              <td>{record.followUpNote}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HealthCheckRecord;
