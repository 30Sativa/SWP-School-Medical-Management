import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";

const HealthCheckTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: "#search-campaign",
      content: "Nhập tên để tìm kiếm chiến dịch khám sức khỏe.",
    },
    {
      target: "#filter-year",
      content: "Lọc chiến dịch theo thời gian.",
    },
    {
      target: "#filter-status",
      content: "Lọc chiến dịch theo trạng thái.",
    },
    {
      target: "#btn-show-all",
      content: " Hiển thị tất cả chiến dịch.",
    },
    {
      target: "#btn-latest",
      content: " Xem chiến dịch vừa được tạo gần nhất.",
    },
    {
      target: "#card-0",
      content: " Đây là một chiến dịch khám sức khỏe.",
    },
    {
      target: "#btn-detail-0",
      content: " Nhấn để xem chi tiết chiến dịch.",
    },
    {
      target: "#btn-starts",
      content: "Nhấn kích hoạt để tiến hành khởi động chiến dịch & đồng thời gửi thông báo đến Phụ huynh",
    },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("healthcheck_tour_done");
    if (!seen) {
      setRun(true);
      localStorage.setItem("healthcheck_tour_done", "true");
    }
  }, []);

  const handleStartTour = () => setRun(true);

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        disableScrolling
        styles={{
          options: {
            zIndex: 9999,
            primaryColor: "#23b7b7",
            textColor: "#333",
            overlayColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
        callback={(data) => {
          if (["finished", "skipped"].includes(data.status)) {
            setRun(false);
          }
        }}
      />

      <button
        onClick={handleStartTour}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#23b7b7",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "10px 16px",
          fontWeight: "500",
          cursor: "pointer",
          zIndex: 10001,
        }}
      >
        📘 Xem lại hướng dẫn
      </button>
    </>
  );
};

export default HealthCheckTour;
