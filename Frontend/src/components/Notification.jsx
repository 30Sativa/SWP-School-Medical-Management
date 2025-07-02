import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const notifySuccess = (msg) => toast.success(msg);
export const notifyError = (msg) => toast.error(msg);
export const notifyInfo = (msg) => toast.info(msg);
export const notifyWarn = (msg) => toast.warn(msg);

const Notification = () => (
  <ToastContainer
    position="top-center"
    autoClose={2500}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    theme="colored"
  />
);

export default Notification;
