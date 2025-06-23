import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import styles from "../../assets/css/SendNotification.module.css";
import { Bell, Trash2, Plus, Filter, X, Search } from "lucide-react";

const API_BASE = "/api"; // Sử dụng proxy để tránh lỗi CORS

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.2)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:10,padding:24,minWidth:340,boxShadow:'0 2px 16px #0002',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:10,right:10,background:'none',border:'none',cursor:'pointer'}}><X size={20}/></button>
        {children}
      </div>
    </div>
  );
};

const SendNotifications = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // Số lượng thông báo mỗi trang (giảm từ 10 xuống 5)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryEdit, setCategoryEdit] = useState(null);
  // Thêm state cho form category
  const [catName, setCatName] = useState("");
  const [catError, setCatError] = useState("");
  const [parents, setParents] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [typeId, setTypeId] = useState(0);

  // State lưu toàn bộ danh sách notification để lọc client
  const [allNotifications, setAllNotifications] = useState([]);

  // Fetch categories
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/NotificationType`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        else if (Array.isArray(data.data)) setCategories(data.data);
        else setCategories([]);
      })
      .catch(() => setCategories([]));
  }, []);

  // Fetch tất cả notification 1 lần (không phân trang, không search)
  useEffect(() => {
    const token = localStorage.getItem("token");
    let url = `${API_BASE}/Notification`;
    fetch(url, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllNotifications(data);
        else if (Array.isArray(data.items)) setAllNotifications(data.items);
        else setAllNotifications([]);
        setTotalPages(1); // chỉ 1 trang khi lọc client
      })
      .catch(() => setAllNotifications([]));
  }, []);

  // Lọc client khi search/category thay đổi
  useEffect(() => {
    let filtered = allNotifications;
    if (selectedCategory) {
      filtered = filtered.filter(n => n.typeId === selectedCategory);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      filtered = filtered.filter(n =>
        (n.title && n.title.toLowerCase().includes(s)) ||
        (n.message && n.message.toLowerCase().includes(s))
      );
    }
    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    setTotalPages(maxPage);
    // Nếu page vượt quá tổng số trang sau khi lọc, reset về trang cuối cùng
    if (page > maxPage) {
      setPage(maxPage);
      // Không setNotifications ở đây để tránh hiển thị trống khi vừa chuyển trang
      return;
    }
    // CHỈ slice khi page <= maxPage
    setNotifications(filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize));
  }, [allNotifications, selectedCategory, search, page]);

  // Khi mở modal edit category
  useEffect(() => {
    if (showCategoryModal && categoryEdit) {
      setCatName(categoryEdit.typeName);
      setCatError("");
    } else if (showCategoryModal) {
      setCatName("");
      setCatError("");
    }
  }, [showCategoryModal, categoryEdit]);

  // Lấy danh sách phụ huynh trực tiếp từ user
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE}/User?role=Parent`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : undefined
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setParents(data);
        else if (Array.isArray(data.data)) setParents(data.data);
        else setParents([]);
      })
      .catch(() => setParents([]));
  }, []);

  // Gửi thông báo
  const handleSend = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!title || !content || !receiverId || !typeId) {
      setError("Vui lòng nhập đầy đủ tiêu đề, nội dung, chọn phụ huynh và loại thông báo!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/Notification/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : undefined
        },
        body: JSON.stringify({
          receiverId,
          title,
          message: content,
          typeId: Number(typeId),
          isRead: false
        })
      });
      setSuccess("Gửi thông báo thành công!");
      setLoading(false);
      setTitle("");
      setContent("");
      setReceiverId("");
      setTypeId("");
      // reload danh sách: chỉ setAllNotifications, KHÔNG setNotifications
      fetch(`${API_BASE}/Notification`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      })
        .then(res => res.json())
        .then(data => setAllNotifications(data.items || data));
    } catch {
      setError("Gửi thông báo thất bại!");
      setLoading(false);
    }
  };

  // Xóa notification
  const handleDeleteNotification = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/Notification/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      // reload danh sách: chỉ setAllNotifications, KHÔNG setNotifications
      fetch(`${API_BASE}/Notification`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      })
        .then(res => res.json())
        .then(data => setAllNotifications(data.items || data));
    } catch {}
  };

  // Thêm/sửa category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!catName) {
      setCatError("Vui lòng nhập tên loại!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (categoryEdit) {
        // Sửa
        await fetch(`${API_BASE}/NotificationType/${categoryEdit.typeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
          },
          body: JSON.stringify({ typeName: catName })
        });
      } else {
        // Thêm
        await fetch(`${API_BASE}/NotificationType`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : undefined
          },
          body: JSON.stringify({ typeName: catName })
        });
      }
      setShowCategoryModal(false);
      setCategoryEdit(null);
      // reload
      fetch(`${API_BASE}/NotificationType`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      })
        .then(res => res.json())
        .then(data => setCategories(data));
    } catch {
      setCatError("Lưu thất bại!");
    }
  };

  // Xóa category
  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE}/NotificationType/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      });
      // reload
      fetch(`${API_BASE}/NotificationType`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : undefined
        }
      })
        .then(res => res.json())
        .then(data => setCategories(data));
    } catch {}
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        {/* Header gửi thông báo */}
        <header className={styles.headerBar}>
          <div className={styles.titleGroup}>
            <h1>
              <span className={styles.textBlack}>Gửi</span>
              <span className={styles.textAccent}> thông báo</span>
            </h1>
          </div>
        </header>
        {/* Form nhập thông tin dạng card hiện đại */}
        <section className={styles.cardSection}>
          <form className={styles.card} onSubmit={handleSend}>
            <div style={{display:'flex',flexDirection:'column',gap:18}}>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Nhập tiêu đề thông báo"
                autoFocus
              />
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className={styles.textarea}
                placeholder="Nhập nội dung thông báo"
                rows={3}
              />
              <select
                className={styles.input}
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
              >
                <option value="">Chọn phụ huynh</option>
                {parents.filter(p => p.roleName === "Parent").map(p => (
                  <option key={p.userID} value={p.userID}>
                    {p.fullName || p.username || p.email}
                  </option>
                ))}
              </select>
              <select
                className={styles.input}
                value={typeId || ""}
                onChange={e => setTypeId(Number(e.target.value))}
                required
              >
                <option value="">Chọn loại thông báo</option>
                {categories.map(cat => (
                  <option key={cat.typeId || cat.id} value={cat.typeId}>{cat.typeName}</option>
                ))}
              </select>
              {(error || success) && (
                <div style={{textAlign:'center'}}>
                  {error && <div style={{color: "#e53e3e", marginBottom: 6, fontWeight: 500}}>{error}</div>}
                  {success && <div style={{color: "#059669", marginBottom: 6, fontWeight: 500}}>{success}</div>}
                </div>
              )}
              <button
                type="submit"
                className={styles.button}
                style={{minWidth: 120, alignSelf:'center'}}
                disabled={loading}
              >
                <Bell size={20} style={{marginRight: 4, marginBottom: -2}}/>
                {loading ? "Đang gửi..." : "Gửi thông báo"}
              </button>
            </div>
          </form>
        </section>
        {/* Danh sách thông báo xuống dưới */}
        <section className={styles.listSection}>
          <div className={styles.filterBar} style={{display:'flex', alignItems:'center', gap: 12, marginBottom: 0, width: '100%'}}>
            <div className={styles.filterGroup} style={{display:'flex', alignItems:'center', gap:12, flex: '0 1 auto'}}>
              <div className={styles.searchWrapper}>
                <input
                  className={styles.searchInput}
                  placeholder="Tìm kiếm tiêu đề/nội dung..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <Search size={18} className={styles.searchIcon} />
              </div>
              <select
                className={styles.input}
                style={{width: 200, marginRight: 10}}
                value={selectedCategory}
                onChange={e => setSelectedCategory(Number(e.target.value))}
              >
                <option value={0}>Tất cả loại thông báo</option>
                {categories.map(cat => (
                  <option key={cat.typeId || cat.id} value={cat.typeId}>{cat.typeName}</option>
                ))}
              </select>
            </div>
            <div style={{flex: '0 0 auto', display: 'flex', alignItems: 'center'}}>
              <button
                className={styles.button}
                onClick={() => { setShowCategoryModal(true); setCategoryEdit(null); }}
                style={{minWidth: 60, borderRadius: 8, fontWeight: 600, fontSize: 15, padding: '8px 16px', height: 36, display: 'flex', alignItems: 'center'}}
              >
                <Plus size={16} style={{marginRight: 4}}/> Quản lý loại
              </button>
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{minWidth:120}}>Tiêu đề</th>
                <th style={{minWidth:180}}>Nội dung</th>
                <th style={{minWidth:120}}>Loại</th>
                <th style={{minWidth:140}}>Phụ huynh nhận</th>
                <th style={{minWidth:120}}>Ngày gửi</th>
                <th style={{textAlign:'center',minWidth:80}}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {notifications.length === 0 ? (
                <tr key="no-data"><td colSpan={6} style={{textAlign: 'center'}}>Không có thông báo</td></tr>
              ) : notifications.slice((page-1)*pageSize, page*pageSize).map(n => {
                const parent = parents.find(p => String(p.userID) === String(n.receiverId));
                return (
                  <tr key={n.id || n.notificationId || n._id} style={{transition:'background 0.15s'}} className={styles.tableRow}>
                    <td style={{maxWidth:180,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={n.title}>{n.title}</td>
                    <td style={{maxWidth:260,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}} title={n.message}>{n.message}</td>
                    <td>{categories.find(c => c.typeId === n.typeId)?.typeName || n.typeName || ''}</td>
                    <td>{parent ? (parent.fullName || parent.username || parent.email) : n.receiverId || ''}</td>
                    <td style={{whiteSpace:'nowrap'}}>{n.sentDate ? new Date(n.sentDate).toLocaleString() : ""}</td>
                    <td style={{textAlign:'center'}}>
                      <button className={styles.iconBtn} style={{border:'none'}} title="Xóa" onClick={() => { setDeleteId(n.id || n.notificationId); setShowDeleteModal(true); }}><Trash2 size={16}/></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className={styles.pagination}>
            <button disabled={page <= 1} onClick={() => setPage(page-1)}>Trước</button>
            <span style={{margin: '0 8px'}}>Trang {page}/{totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page+1)}>Sau</button>
          </div>
        </section>
        {/* Popup/modal cho CRUD notification & category */}
        <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <div style={{textAlign:'center', minWidth: 320, padding: 8}}>
            <h3 style={{fontWeight:600, fontSize:20, marginBottom:16, marginTop:8}}>Bạn chắc chắn muốn xóa thông báo này?</h3>
            <div style={{display:'flex',justifyContent:'center',gap:16,marginTop:24}}>
              <button
                className={styles.button}
                style={{minWidth:100, borderRadius:8, fontWeight:600, fontSize:16, padding:'10px 0'}}
                onClick={handleDeleteNotification}
              >
                Xác nhận
              </button>
              <button
                className={styles.button}
                style={{background:'#f5f5f5',color:'#222',minWidth:100, borderRadius:8, fontWeight:600, fontSize:16, padding:'10px 0', border:'1px solid #ddd'}}
                onClick={()=>setShowDeleteModal(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </Modal>
        <Modal open={showCategoryModal} onClose={() => { setShowCategoryModal(false); setCategoryEdit(null); }}>
          <h2>{categoryEdit ? 'Sửa' : 'Thêm'} loại thông báo</h2>
          <form onSubmit={handleSaveCategory}>
            <input className={styles.input} value={catName} onChange={e=>setCatName(e.target.value)} placeholder="Tên loại thông báo" />
            {catError && <div style={{color:'#e53e3e',marginBottom:8}}>{catError}</div>}
            <button className={styles.button} type="submit">Lưu</button>
          </form>
          <div style={{marginTop:24}}>
            <h4>Danh sách loại thông báo</h4>
            <ul style={{padding:0,listStyle:'none'}}>
              {categories.map(cat => (
                <li key={cat.typeId} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span>{cat.typeName}</span>
                  {/* Xóa nút sửa loại thông báo */}
                  <button className={styles.iconBtn} onClick={()=>handleDeleteCategory(cat.typeId)}><Trash2 size={14}/></button>
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default SendNotifications;
