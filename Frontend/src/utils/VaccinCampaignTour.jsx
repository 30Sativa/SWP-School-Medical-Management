import React, { useState, useEffect } from "react";
import Joyride from "react-joyride";

const VaccinCampaignTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: "#search-campaign",
      content: "Tìm kiếm chiến dịch bằng tên vắc xin tại đây.",
    },
    {
      target: "#filter-year",
      content: "Lọc chiến dịch theo năm diễn ra.",
    },
    {
      target: "#filter-status",
      content: "Lọc chiến dịch theo trạng thái hoạt động.",
    },
    {
      target: "#show-all",
      content: "Hiển thị tất cả các chiến dịch hiện có.",
    },
    {
      target: "#latest-campaign",
      content: "Chỉ xem chiến dịch vừa được tạo gần nhất.",
    },
    {
      target: ".campaignCard",
      content: "Mỗi thẻ hiển thị thông tin tổng quan về một chiến dịch.",
    },
    {
      target: ".btn-detail-tour",
      content: "Nhấn để xem chi tiết chiến dịch này.",
    },
   
  ];

  useEffect(() => {
    const hasSeen = localStorage.getItem("vaccin_campaign_tour_done");
    if (!hasSeen) {
      setRun(true);
      localStorage.setItem("vaccin_campaign_tour_done", "true");
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
          },
          tooltip: {
            padding: "16px",
            fontSize: "14px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
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
