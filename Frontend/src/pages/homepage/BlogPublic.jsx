import React, { useEffect, useState } from "react";
import blogStyle from "../../assets/css/Blog.module.css";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import style from "../../assets/css/homepage.module.css";
import logo from "../../assets/icon/eduhealth.jpg";
import { useNavigate } from "react-router-dom";

const apiUrl = "https://swp-school-medical-management.onrender.com/api/BlogPost";

const BlogPublic = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(apiUrl);
        const blogsData = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setBlogs(blogsData.filter(blog => blog.isActive !== false));
      } catch {
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const matchSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchText.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);

  return (
    <div style={{ background: "#f8fafb", minHeight: "100vh" }}>
      <header className={style.navbar}>
        <div className={style.logo}>
          <img src={logo} alt="EduHealth Logo" className={style.logoImg} />
        </div>
        <nav className={style.navLinks}>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); navigate("/"); }}>Trang chủ</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); navigate("/#about"); }}>Giới thiệu</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); navigate("/blog"); }}>Blog Y Tế</a>
          <a href="#" className={style.navLink} onClick={e => { e.preventDefault(); navigate("/#contact"); }}>Liên hệ</a>
          <button className={style.loginBtn} onClick={() => navigate("/login")}>Đăng nhập</button>
        </nav>
      </header>
      <div className={blogStyle.headerBlog} style={{ marginTop: 0, borderRadius: 0 }}>
        <div className={blogStyle.headerContent} style={{ margin: "0 auto", textAlign: "center" }}>
          <h1 className={blogStyle.titleBlog} style={{ fontSize: "2.5rem" }}>Blog Y Tế Học Đường</h1>
          <p className={blogStyle.descBlog} style={{ fontSize: "1.15rem" }}>
            Cập nhật kiến thức y tế mới nhất, hướng dẫn chăm sóc sức khỏe và các mẹo hay cho cuộc sống khỏe mạnh
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "32px 0 18px 0", gap: 12 }}>
          <div style={{ position: "relative", width: 340 }}>
            <SearchOutlined style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#20b2aa", fontSize: 20, zIndex: 2 }} />
            <input
              className={blogStyle.blogSearch}
              style={{ paddingLeft: 38, width: 340, fontSize: "1.08rem", border: "1.5px solid #20b2aa", boxShadow: "0 1px 6px rgba(32,178,170,0.07)" }}
              placeholder="Tìm kiếm bài viết..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") setSearchText(""); }}
            />
            {searchText && (
              <span
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#aaa", cursor: "pointer", fontSize: 18 }}
                onClick={() => setSearchText("")}
                title="Xóa tìm kiếm"
              >&#10005;</span>
            )}
          </div>
        </div>
        <div className={blogStyle.blogListSection}>
          {loading && <div style={{ textAlign: "center", color: "#888", margin: "32px 0" }}>Đang tải dữ liệu...</div>}
          {paginatedBlogs.length === 0 && !loading && (
            <div style={{ textAlign: "center", color: "#888", margin: "32px 0" }}>Không tìm thấy bài viết nào.</div>
          )}
          {paginatedBlogs.map((blog) => {
            const isExpanded = expanded[blog.postId];
            return (
              <div className={blogStyle.blogCard} key={blog.postId}>
                <div className={blogStyle.blogCardContent}>
                  <div className={blogStyle.blogMetaRow}>
                    <span className={blogStyle.blogAuthor} style={{ color: "#20b2aa", fontWeight: 700 }}>
                      {blog.authorName ? ` ${blog.authorName}` : "Tác giả ẩn danh"}
                    </span>
                    <span className={blogStyle.blogDate} style={{ marginLeft: 16 }}>
                      {blog.postedDate}
                    </span>
                    <span style={{ color: "#888", fontSize: 13, marginLeft: 16 }}>5 phút đọc</span>
                  </div>
                  <h2 className={blogStyle.blogTitle}>{blog.title}</h2>
                  <div className={blogStyle.blogDesc} style={{ marginBottom: 8 }}>
                    {isExpanded ? (
                      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: blog.content.length > 180 ? blog.content.slice(0, 180) + "..." : blog.content }} />
                    )}
                  </div>
                  <div className={blogStyle.blogTagsRow}>
                    {blog.tags && blog.tags.map((tag, idx) => (
                      <span className={blogStyle.blogTag} key={idx}>#{tag}</span>
                    ))}
                  </div>
                  <div style={{ textAlign: "right", marginTop: 8 }}>
                    <button
                      className={blogStyle.blogDetailLink}
                      style={{ fontWeight: 600, fontSize: "1.05rem" }}
                      onClick={() => setExpanded(prev => ({ ...prev, [blog.postId]: !isExpanded }))}
                    >
                      {isExpanded ? "Thu gọn" : "Đọc thêm"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Phân trang */}
          {totalPages > 1 && (
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    margin: "0 4px",
                    padding: "6px 14px",
                    borderRadius: 6,
                    border: "1px solid #20b2aa",
                    background: currentPage === i + 1 ? "#20b2aa" : "#fff",
                    color: currentPage === i + 1 ? "#fff" : "#20b2aa",
                    fontWeight: currentPage === i + 1 ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPublic; 