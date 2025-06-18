import React, { useState } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import styles from "../../assets/css/SendNotification.module.css";
import { Bell } from "lucide-react";

const SendNotifications = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!title || !content) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }
    setLoading(true);
    try {
      // TODO: Gọi API gửi thông báo ở đây
      setTimeout(() => {
        setSuccess("Gửi thông báo thành công!");
        setLoading(false);
        setTitle("");
        setContent("");
      }, 1000);
    } catch  {
      setError("Gửi thông báo thất bại!");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <header className={styles.headerBar}>
          <div className={styles.titleGroup}>
            <h1>
              <span className={styles.textBlack}>Gửi</span>
              <span className={styles.textAccent}> thông báo</span>
            </h1>
          </div>
        </header>
        <section className={styles.cardSection}>
          <form className={styles.card} onSubmit={handleSend}>
            <div>
              <label style={{fontWeight: 700, color: "#20b2aa", fontSize: 16, marginBottom: 6, display: "block", letterSpacing: 0.2}}>Tiêu đề</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={styles.input}
                placeholder="Nhập tiêu đề thông báo"
                autoFocus
              />
            </div>
            <div>
              <label style={{fontWeight: 700, color: "#20b2aa", fontSize: 16, marginBottom: 6, display: "block", letterSpacing: 0.2}}>Nội dung</label>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                className={styles.textarea}
                placeholder="Nhập nội dung thông báo"
              />
            </div>
            {error && <div style={{color: "#e53e3e", marginBottom: 12, fontWeight: 500, textAlign: "center"}}>{error}</div>}
            {success && <div style={{color: "#059669", marginBottom: 12, fontWeight: 500, textAlign: "center", animation: "fadeIn 0.5s"}}>{success}</div>}
            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              <Bell size={20} style={{marginRight: 4, marginBottom: -2}}/>
              {loading ? "Đang gửi..." : "Gửi thông báo"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default SendNotifications;
