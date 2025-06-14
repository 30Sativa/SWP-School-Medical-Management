import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import blogStyle from "../../assets/css/Blog.module.css";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const BlogCreate = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [editIdx, setEditIdx] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Nếu đang sửa bài viết, lấy dữ liệu từ localStorage
    const idx = localStorage.getItem("editBlogIdx");
    const allBlogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(allBlogs);
    if (idx !== null) {
      const blog = allBlogs[Number(idx)];
      if (blog) {
        setTitle(blog.title);
        setCategory(blog.category);
        setContent(blog.content);
        setImage(null); // Không set lại file, chỉ preview nếu muốn
        setEditIdx(Number(idx));
      }
      localStorage.removeItem("editBlogIdx");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageData = null;
    if (image) {
      imageData = await getBase64(image);
    }
    const newBlog = {
      title,
      category,
      content,
      image: imageData || (editIdx !== null ? JSON.parse(localStorage.getItem("blogs"))[editIdx].image : null),
      date: new Date().toLocaleDateString("vi-VN"),
      readTime: "5 phút đọc",
      tags: [category],
    };
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    if (editIdx !== null) {
      blogs[editIdx] = newBlog;
    } else {
      blogs.unshift(newBlog);
    }
    localStorage.setItem("blogs", JSON.stringify(blogs));
    window.location.href = "/blog";
  };

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent}>
        <header className={blogStyle.dashboardHeaderBar}>
          <div className={blogStyle.titleGroup}>
            <h1>
              <span className={blogStyle.textBlack}>{editIdx !== null ? "Chỉnh sửa" : "Tạo"}</span>
              <span className={blogStyle.textAccent}> bài viết mới</span>
            </h1>
          </div>
          <button
            type="button"
            className={blogStyle.backBtn}
            onClick={() => window.location.href = '/blog'}
          >
            ← Quay lại trang Blog
          </button>
        </header>
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
            <label>Danh mục</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              required
              className={blogStyle.input}
            >
              <option value="">Chọn danh mục</option>
              <option value="Dinh dưỡng">Dinh dưỡng</option>
              <option value="Y tế">Y tế</option>
              <option value="Thể thao">Thể thao</option>
              <option value="Tâm lý">Tâm lý</option>
              <option value="Sức khỏe">Sức khỏe</option>
            </select>
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
          <div className={blogStyle.formGroup}>
            <label>Ảnh minh họa</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className={blogStyle.input}
            />
            {/* Hiển thị preview ảnh nếu có */}
            {(image && typeof image !== 'string') && (
              <img className={blogStyle.imagePreview} src={URL.createObjectURL(image)} alt="preview" />
            )}
            {/* Nếu đang sửa và chưa chọn ảnh mới, hiển thị ảnh cũ */}
            {(!image && editIdx !== null && blogs && blogs[editIdx] && blogs[editIdx].image) && (
              <img className={blogStyle.imagePreview} src={blogs[editIdx].image} alt="preview" />
            )}
          </div>
          <button type="submit" className={blogStyle.createBtn} style={{marginTop: 16}}>{editIdx !== null ? "Lưu thay đổi" : "Tạo bài viết"}</button>
        </form>
      </main>
    </div>
  );
};

export default BlogCreate;
