// Hiệu ứng AOS cho React (tương tự MediLab)
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function useAosInit() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
      once: true,
      offset: 60,
    });
  }, []);
}
