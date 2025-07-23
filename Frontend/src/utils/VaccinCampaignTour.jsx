import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const VaccinCampaignTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: "#search-campaign",
      content: "Tìm kiếm chiến dịch bằng tên vắc xin tại đây.",
      placement: "auto"
    },
    {
      target: "#filter-year",
      content: "Lọc chiến dịch theo năm diễn ra.",
      placement: "auto"
    },
    {
      target: "#filter-status",
      content: "Lọc chiến dịch theo trạng thái hoạt động.",
      placement: "auto"
    },
    {
      target: "#show-all",
      content: "Hiển thị tất cả các chiến dịch hiện có.",
      placement: "auto"
    },
    {
      target: "#latest-campaign",
      content: "Chỉ xem chiến dịch vừa được tạo gần nhất.",
      placement: "auto"
    },
    {
      target: ".campaignCard",
      content: "Mỗi thẻ hiển thị thông tin tổng quan về một chiến dịch.",
      placement: "auto"
    },
    {
      target: ".btn-detail-tour",
      content: "Nhấn để xem chi tiết chiến dịch này.",
      placement: "auto"
    },
   
  ];

  useEffect(() => {
    const hasSeen = localStorage.getItem("vaccin_campaign_tour_done");
    if (!hasSeen) {
      setRun(true);
      localStorage.setItem("vaccin_campaign_tour_done", "true");
    }
  }, []);

  useEffect(() => {
    if (run) {
      document.body.style.overflowX = "hidden";
      document.body.style.paddingRight = "16px"; // Thêm dòng này
    } else {
      document.body.style.overflowX = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflowX = "";
      document.body.style.paddingRight = "";
    };
  }, [run]);

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
          tooltipContainer: {
            textAlign: "left",
            maxWidth: 320,
            width: "100%",
            boxSizing: "border-box",
          },
          tooltip: {
            padding: "16px",
            fontSize: "14px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
            maxWidth: "90vw", // Thêm dòng này
            minWidth: "200px",
            wordBreak: "break-word",
          },
          buttonNext: {
            backgroundColor: "#d91b5c",
          },
          buttonBack: {
            color: "#666",
            marginRight: 10,
          },
          buttonClose: {
            display: "none",
          },
        }}
        callback={(data) => {
          if (["finished", "skipped"].includes(data.status)) {
            setRun(false);
            localStorage.setItem("vaccin_campaign_tour_done", "true");
          }
        }}
      />

      {/* Nút xem lại hướng dẫn */}
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
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
       Xem lại hướng dẫn
      </button>
    </>
  );
};

export default VaccinCampaignTour;
