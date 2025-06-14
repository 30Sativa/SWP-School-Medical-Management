import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Login from "../pages/auth/Login";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import NurseDashboard from "../pages/nurse/NurseDashboard";
import UsersList from "../pages/manager/UsersList";
import StudentList from "../pages/nurse/StudentList";
import StudentDetail from "../pages/nurse/StudentDetail";
import ParentDashboard from "../pages/parent/ParentDashboard";
import HealthProfile from "../pages/parent/HealthProfile";
import LogsPage from "../pages/manager/Logs";
import SendMedicine from "../pages/parent/SendMedicine";
import VaccinCampaign from "../pages/nurse/VaccinCampaign";
import ChildCareHistory from "../pages/parent/ChildCareHistory";
import NotificationAndReport from "../pages/parent/NotificationAndReport";
import Incident from "../pages/nurse/Incident";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/nurse" element={<NurseDashboard />} />
      <Route path="/parent" element={<ParentDashboard />} />
      <Route path="/users" element={<UsersList />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/:id" element={<StudentDetail />} />
      <Route path="/healthprofile" element={<HealthProfile />} />
      <Route path="/logs" element={<LogsPage />} />
      <Route path="/sendmedicine" element={<SendMedicine />} />
      <Route path="/hisofcare" element={<ChildCareHistory />} />
      <Route path="/notiAndRep" element={<NotificationAndReport />} />
      <Route path="/incidents" element={<Incident />} />
      <Route path="/vaccines" element={<VaccinCampaign />} />
    </Routes>
  );
};

export default AppRouter;
