import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Login from "../pages/auth/Login";
import ParentDashboard from "../pages/parent/Dashboard";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/Dashboard" element={<ParentDashboard />} />
    </Routes>
  );
};

export default AppRouter;
