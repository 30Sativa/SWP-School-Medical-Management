// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import style from "./MainLayout.module.css";

const MainLayout = () => {
  return (
    <div className={style.layoutContainer}>
      <Sidebar />
      <main className={style.layoutContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
