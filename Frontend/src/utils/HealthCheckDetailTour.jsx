import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";

const HealthCheckDetailTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: "#page-title",
      content: "Đây là tiêu đề trang thể hiện bạn đang xem chiến dịch nào.",
      placement: "bottom",
    },
    {
      target: "#btn-back",
      content: "Nhấn để quay lại trang danh sách chiến dịch.",
      placement: "right",
    },
    {
      target: "#btn-notify",
      content: "Gửi thông báo và email đến phụ huynh học sinh về chiến dịch.",
      placement: "left",
    },
    {
      target: "#btn-complete",
      content: "Hoàn thành đợt khám sức khỏe.",
      placement: "left",
    },
    {
      target: "#btn-send-result",
      content: "Gửi kết quả khám sức khỏe đến phụ huynh học sinh.",
      placement: "left",
    },
    {
      target: "#student-table",
      content: "Danh sách học sinh tham gia chiến dịch.",
      placement: "top",
    },
    {
      target: "#btn-view-detail",
      content: "Xem chi tiết thông tin sức khỏe của học sinh này.",
      placement: "top",
    },
    {
      target: "#btn-add-edit",
      content: "Ghi nhận hoặc chỉnh sửa thông tin sức khỏe học sinh.",
      placement: "top",
    },
    {
      target: "#pagination",
      content: "Chuyển trang để xem các học sinh khác trong chiến dịch.",
      placement: "top",
    },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("health_check_tour_done");
    if (!seen) {
      setRun(true);
      localStorage.setItem("health_check_tour_done", "true");
    }
  }, []);

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
          tooltip: {
            padding: "16px",
            fontSize: "14px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
          },
        }}
        callback={(data) => {
          if (["finished", "skipped"].includes(data.status)) {
            setRun(false);
            localStorage.setItem("health_check_tour_done", "true");
          }
        }}
      />

      {/* Nút xem lại hướng dẫn */}
      <button
        onClick={() => setRun(true)}
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        Xem lại hướng dẫn
      </button>
    </>
  );
};

export default HealthCheckDetailTour;
