import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "../../assets/css/viewBlog.module.css";

const ViewBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("https://swp-school-medical-management.onrender.com/api/BlogPost");
        if (res.data.status === "200") {
          setBlogs(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải blog:", error);
      }
    };
    fetchBlogs();
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPostId((prev) => (prev === postId ? null : postId));
  };

  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className={style.container}>
      <Sidebar />
      <main className={style.dashboardWrapper}>
        <div className={style.header}>
          <h2>Bài viết y tế</h2>
          <p>Các chia sẻ hữu ích từ y tá trường mầm non</p>
        </div>

        <div className={style.cardList}>
          {currentBlogs.map((blog) => (
            <section key={blog.postId} className={style.card}>
              <h3>{blog.title}</h3>
              {expandedPostId === blog.postId ? (
                <>
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
                    🖊️ Người viết: {blog.authorName} — Ngày đăng: {new Date(blog.postedDate).toLocaleDateString("vi-VN")}
                  </p>
                </>
              ) : (
                <button className={style.btnViewMore} onClick={() => toggleExpand(blog.postId)}>
                  Xem thêm
                </button>
              )}
              {expandedPostId === blog.postId && (
                <button className={style.btnViewMore} onClick={() => toggleExpand(blog.postId)}>
                  Thu gọn
                </button>
              )}
            </section>
          ))}
        </div>

        <div className={style.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`${style.pageBtn} ${currentPage === i + 1 ? style.active : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ViewBlog;