import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import blogStyle from "../../assets/css/Blog.module.css";
import axios from "axios";
import { Spin } from "antd";
import Notification from "../../components/Notification";
import { notifySuccess, notifyError } from "../../utils/notification";
import LoadingOverlay from "../../components/LoadingOverlay";

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const apiUrl = "https://swp-school-medical-management.onrender.com/api/BlogPost";

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const id = getQueryParam('id');
    if (id && id !== 'undefined') {
      setEditId(id);
      setLoading(true);
      axios.get(`${apiUrl}/${id}`)
        .then(res => {
          const blog = res.data;
          setTitle(blog.title);
          setContent(blog.content);
        })
        .catch(() => notifyError('Không thể tải dữ liệu bài viết!'))
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const authorId = localStorage.getItem('userId') || '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const postedDate = new Date().toISOString().slice(0, 10);
    try {
      if (editId && editId !== 'undefined') {
        await axios.put(`${apiUrl}/${editId}`, {
          title,
          content,
          isActive: true
        });
        notifySuccess('Cập nhật bài viết thành công!');
      } else {
        await axios.post(apiUrl, {
          title,
          content,
          authorId,
          postedDate,
          isActive: true
        });
        notifySuccess('Tạo bài viết thành công!');
      }
      window.location.href = "/manager/blog";
    } catch {
      notifyError('Lưu bài viết thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent}>
        <header className={blogStyle.dashboardHeaderBar}>
          <div className={blogStyle.titleGroup}>
            <h1>
              <span className={blogStyle.textBlack}>{editId ? "Chỉnh sửa" : "Tạo"}</span>
              <span className={blogStyle.textAccent}> bài viết mới</span>
            </h1>
          </div>
          <button
            type="button"
            className={blogStyle.backBtn}
            onClick={() => window.location.href = '/manager/blog'}
          >
            ← Quay lại trang Blog
          </button>
        </header>
        {loading && <LoadingOverlay text="Đang tải dữ liệu..." />}
        <Spin spinning={loading} tip={editId ? "Đang lưu..." : "Đang tạo..."}>
        <form className={blogStyle.blogForm} onSubmit={handleSubmit}>
          <div className={blogStyle.formGroup}>
            <label>Tiêu đề bài viết</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className={blogStyle.input}
            />
          </div>
          <div className={blogStyle.formGroup}>
            <label>Nội dung</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={8}
              className={blogStyle.input}
            />
          </div>
          <button type="submit" className={blogStyle.createBtn} style={{marginTop: 16}} disabled={loading}>
            {loading ? (editId ? 'Đang lưu...' : 'Đang tạo...') : (editId ? "Lưu thay đổi" : "Tạo bài viết")}
          </button>
        </form>
        </Spin>
        <Notification />
      </main>
    </div>
  );
};

export default BlogCreate;
