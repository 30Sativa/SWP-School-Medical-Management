import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sb-Manager/Sidebar";
import style from "../../components/sb-Manager/MainLayout.module.css";
import blogStyle from "../../assets/css/Blog.module.css";
import { BookOutlined, EyeOutlined, MessageOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { message, Modal, Spin } from "antd";
import axios from "axios";

const apiUrl = "https://swp-school-medical-management.onrender.com/api/BlogPost";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  // Fetch blogs from API
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      setBlogs(res.data.filter(blog => blog.isActive !== false));
    } catch {
      message.error("Không thể tải danh sách blog!");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Xóa mềm bài viết
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa bài viết này?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        setLoading(true);
        try {
          await axios.put(`${apiUrl}/${id}`, { title: '', content: '', isActive: false });
          message.success("Đã xóa bài viết!");
          fetchBlogs();
        } catch {
          message.error("Xóa thất bại!");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Sửa bài viết
  const handleEdit = (id) => {
    window.location.href = `/blog/create?id=${id}`;
  };

  // Lọc theo category và search
  const filteredBlogs = blogs.filter(blog => {
    
    const matchSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase());
    return  matchSearch;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

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
          <div style={{flex: 1}}></div>
          <div className={blogStyle.blogSearchSort}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <SearchOutlined style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#20b2aa', fontSize: 20, zIndex: 2 }} />
              <input
                className={blogStyle.blogSearch}
                style={{ paddingLeft: 38, minWidth: 260, fontSize: '1.05rem', border: '1.5px solid #20b2aa', boxShadow: '0 1px 6px rgba(32,178,170,0.07)' }}
                placeholder="Tìm kiếm bài viết..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setSearchText(''); }}
              />
              {searchText && (
                <span
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', cursor: 'pointer', fontSize: 18 }}
                  onClick={() => setSearchText('')}
                  title="Xóa tìm kiếm"
                >&#10005;</span>
              )}
            </div>
            <button
              className={blogStyle.createBtn + ' ' + blogStyle.createBtnPrimary}
              style={{marginLeft: 12}}
              onClick={() => window.location.href='/blog/create'}
            >
              <span style={{fontWeight:700, fontSize:'1.1rem', letterSpacing:0.5, padding:'0 2px'}}>+ Tạo bài viết mới</span>
            </button>
          </div>
        </section>
        <Spin spinning={loading} tip="Đang tải...">
        <section className={blogStyle.blogListSection}>
          {paginatedBlogs.length === 0 && !loading && (
            <div style={{textAlign: 'center', color: '#888', margin: '32px 0'}}>Không tìm thấy bài viết nào.</div>
          )}
          {paginatedBlogs.map((blog) => (
            <div className={blogStyle.blogCard} key={blog.postId}>
              <div className={blogStyle.blogCardContent}>
                <div className={blogStyle.blogMetaRow}>
                  <span className={blogStyle.blogDate}>{blog.postedDate}</span>
                  <span className={blogStyle.blogAuthor}>Tác giả: {blog.authorName}</span>
                </div>
                <h2 className={blogStyle.blogTitle}>{blog.title}</h2>
                <p className={blogStyle.blogDesc}>{blog.content}</p>
                <div className={blogStyle.blogActionsRow}>
                  <div className={blogStyle.blogActionIcons}>
                    <EditOutlined style={{color: '#6a8dff', fontSize: 20, cursor: 'pointer'}} onClick={() => handleEdit(blog.postId)} />
                    <DeleteOutlined style={{color: '#ff4d4f', fontSize: 20, cursor: 'pointer'}} onClick={() => handleDelete(blog.postId)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Phân trang */}
          {totalPages > 1 && (
            <div style={{textAlign: 'center', margin: '24px 0'}}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    margin: '0 4px',
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #20b2aa',
                    background: currentPage === i + 1 ? '#20b2aa' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#20b2aa',
                    fontWeight: currentPage === i + 1 ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>
        </Spin>
        <footer className={blogStyle.footerBlog}>
          EduHealth © 2025 - Hệ thống quản lý sức khỏe học đường
        </footer>
      </main>
    </div>
  );
};

export default Blog;
