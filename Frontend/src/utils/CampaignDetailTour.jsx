import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";

const CampaignDetailTour = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: "#campaign-title",
      content: "Đây là tiêu đề trang chi tiết chiến dịch tiêm chủng.",
    },
    {
      target: "#info-row",
      content:
        "Thông tin cơ bản về chiến dịch như tên, mô tả, thời gian và trạng thái.",
    },
    {
      target: "#btn-send",
      content: "Nhấn vào đây để gửi phiếu xác nhận đến phụ huynh, nếu chiến dịch chưa được kích hoạt thì sau khi nhận được Phản hồi sẽ xuất hiện nút Kích hoạt",
    },
    {
      target: "#btn-start",
      content: "Khi đủ điều kiện, bạn có thể khởi động chiến dịch.",
    },
    {
      target: "#btn-complete",
      content:
        "Chiến dịch đang diễn ra có thể được đánh dấu hoàn thành sau khi kết thúc.",
    },
    {
        target: "#btn-result",
        content: "Nhấn vào đây để ghi nhận và xem lại kết quả tiêm chủng.",
      },
    {
      target: "#btn-export",
      content: "Xuất báo cáo phản hồi ra file Excel.",
    },
    {
      target: "#tab-row",
      content: "Bộ lọc để xem phản hồi theo từng loại trạng thái.",
    },
    {
      target: "#consent-table",
      content: "Danh sách chi tiết các phản hồi từ phụ huynh.",
    },
    {
      target: "#btn-back",
      content: "Quay lại trang trước.",
    },
  ];

  useEffect(() => {
    const seen = localStorage.getItem("campaign_detail_tour_done");
    if (!seen) {
      setRun(true);
      localStorage.setItem("campaign_detail_tour_done", "true");
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
            zIndex: 10000,
            primaryColor: "#d91b5c",
            textColor: "#333",
            overlayColor: "rgba(0, 0, 0, 0.4)",
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
            localStorage.setItem("campaign_detail_tour_done", "true");
          }
        }}
      />

      <button
        onClick={handleStartTour}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          backgroundColor: "#d91b5c",
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

export default CampaignDetailTour;
