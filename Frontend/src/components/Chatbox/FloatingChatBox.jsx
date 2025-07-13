import React, { useState } from "react";
import ChatBox from "../../components/Chatbox/chatbox";
import { MessageCircle } from "lucide-react";

const FloatingChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 55,
          height: 55,
          borderRadius: "50%",
          background: "#3FE0C5",
          boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          border: "none",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s",
          padding: 0,
        }}
        title="Medical AI"
      >
        <MessageCircle color="#111" size={34} strokeWidth={2.5} />
      </button>

      {/* Luôn render ChatBox, chỉ ẩn/hiện bằng style */}
      <div
        style={{
          position: "fixed",
          bottom: 100,
          right: 30,
          width: 350,
          maxWidth: "95vw",
          height: 500,
          maxHeight: "80vh",
          background: "transparent",
          borderRadius: 18,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          zIndex: 9998,
          overflow: "hidden",
          display: isOpen ? "block" : "none",
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        }}
      >
        <ChatBox />
      </div>
    </>
  );
};

export default FloatingChatBox;
