import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import blogStyle from "../../assets/css/Blog.module.css";
import { BookOutlined, EyeOutlined, MessageOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("blogs") || "[]");
    setBlogs(stored);
  }, []);

  const handleDelete = (idx) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!confirm) return;
    const newBlogs = blogs.filter((_, i) => i !== idx);
    setBlogs(newBlogs);
    localStorage.setItem("blogs", JSON.stringify(newBlogs));
  };

  const handleEdit = (idx) => {
    localStorage.setItem("editBlogIdx", idx);
    window.location.href = "/blog/create";
  };

  // Lọc theo category và search
  const filteredBlogs = blogs.filter(blog => {
    const matchCategory = selectedCategory === 'Tất cả' || blog.category === selectedCategory;
    const matchSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent}>
        {/* Header đồng bộ, không có icon */}
        <header className={blogStyle.dashboardHeaderBar}>
          <div className={blogStyle.titleGroup}>
            <h1>
              <span className={blogStyle.textBlack}>Quản lý</span>
              <span className={blogStyle.textAccent}> Blog sức khỏe học đường</span>
            </h1>
          </div>
        </header>
        <section className={blogStyle.statsRow}>
          <div className={blogStyle.statCard}>
            <div className={blogStyle.statIcon}><BookOutlined style={{ fontSize: 32, color: "#6a8dff" }} /></div>
            <div>
              <div className={blogStyle.statValue}>{blogs.length}</div>
              <div className={blogStyle.statLabel}>Tổng số bài viết</div>
              <div className={blogStyle.statChangePositive}>+12.3% so với tháng trước</div>
            </div>
          </div>
          <div className={blogStyle.statCard}>
            <div className={blogStyle.statIcon}><EyeOutlined style={{ fontSize: 32, color: "#059669" }} /></div>
            <div>
              <div className={blogStyle.statValue}>45,986</div>
              <div className={blogStyle.statLabel}>Lượt xem</div>
              <div className={blogStyle.statChangePositive}>+8.7% so với tháng trước</div>
            </div>
          </div>
          <div className={blogStyle.statCard}>
            <div className={blogStyle.statIcon}><MessageOutlined style={{ fontSize: 32, color: "#d97706" }} /></div>
            <div>
              <div className={blogStyle.statValue}>1,245</div>
              <div className={blogStyle.statLabel}>Bình luận</div>
              <div className={blogStyle.statChangePositive}>+15.2% so với tháng trước</div>
            </div>
          </div>
        </section>
        <section className={blogStyle.blogCategoryRow}>
          <div className={blogStyle.categoryList}>
            {["Tất cả", "Dinh dưỡng", "Y tế", "Thể thao", "Tâm lý", "Sức khỏe"].map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? blogStyle.categoryActive : ''}
                onClick={() => setSelectedCategory(cat)}
                style={{ minWidth: 100, fontWeight: selectedCategory === cat ? 600 : 400 }}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className={blogStyle.blogSearchSort}>
            <input
              className={blogStyle.blogSearch}
              placeholder="Tìm kiếm bài viết..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <button
              className={blogStyle.createBtn}
              style={{marginLeft: 12}}
              onClick={() => window.location.href='/blog/create'}
            >
              + Tạo bài viết mới
            </button>
          </div>
        </section>
        <section className={blogStyle.blogListSection}>
          {filteredBlogs.length === 0 && (
            <div style={{textAlign: 'center', color: '#888', margin: '32px 0'}}>Không tìm thấy bài viết nào.</div>
          )}
          {filteredBlogs.map((blog, idx) => (
            <div className={blogStyle.blogCard} key={idx}>
              {blog.image && <img className={blogStyle.blogImg} src={blog.image} alt="blog" />}
              <div className={blogStyle.blogCardContent}>
                <div className={blogStyle.blogMetaRow}>
                  <span className={blogStyle.blogCategoryTag}>{blog.category}</span>
                  <span className={blogStyle.blogDate}>{blog.date}</span>
                  <span className={blogStyle.blogReadTime}>{blog.readTime}</span>
                </div>
                <h2 className={blogStyle.blogTitle}>{blog.title}</h2>
                <p className={blogStyle.blogDesc}>{blog.content}</p>
                <div className={blogStyle.blogTagsRow}>
                  {blog.tags && blog.tags.map((tag, i) => (
                    <span className={blogStyle.blogTag} key={i}>{tag}</span>
                  ))}
                </div>
                <div className={blogStyle.blogActionsRow}>
                  <div className={blogStyle.blogActionIcons}>
                    <EditOutlined style={{color: '#6a8dff', fontSize: 20, cursor: 'pointer'}} onClick={() => handleEdit(idx)} />
                    <DeleteOutlined style={{color: '#ff4d4f', fontSize: 20, cursor: 'pointer'}} onClick={() => handleDelete(idx)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
        <footer className={blogStyle.footerBlog}>
          EduHealth © 2025 - Hệ thống quản lý sức khỏe học đường
        </footer>
      </main>
    </div>
  );
};

export default Blog;
