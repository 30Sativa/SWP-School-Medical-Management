import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Login from "../pages/auth/Login";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import NurseDashboard from "../pages/nurse/NurseDashboard";
import UsersList from "../pages/manager/UsersList";
import StudentList from "../pages/nurse/StudentList";
import StudenntDetail from "../pages/nurse/StudentDetail"
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/nurse" element={<NurseDashboard />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/students" element={<StudentList />} />
    </Routes>
  );
};

export default AppRouter;
