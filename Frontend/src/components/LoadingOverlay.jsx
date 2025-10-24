import React from "react";
import styles from "../assets/css/LoadingOverlay.module.css";

const LoadingOverlay = ({ text = "Đang tải dữ liệu..." }) => (
  <div className={styles.loadingOverlay}>
    <div className={styles.spinner}></div>
    <div className={styles.loadingText}>{text}</div>
  </div>
);

export default LoadingOverlay;
