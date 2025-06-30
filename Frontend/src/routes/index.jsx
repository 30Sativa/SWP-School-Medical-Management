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

import Blog from "../pages/manager/Blog";
import BlogCreate from "../pages/manager/BlogCreate";
import MedicationHandle from "../pages/nurse/MedicationHandle";
import Incident from "../pages/nurse/Incident";
import MedicalSupplies from "../pages/nurse/MedicalSupplies";
import FirstLogin from "../pages/auth/FirstLogin";
import SendNotifications from "../pages/manager/SendNotifications";
import VaccinationCampaign from "../pages/manager/VaccinationCampaign";
import CampaignDetail from "../pages/nurse/CampaignDetail";
import VaccinationResultPage from "../pages/nurse/VaccinationResultPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import HealthCheckCampaign from "../pages/manager/HealthCheckCampaign";
import HealthCheckList from "../pages/nurse/HealthCheckList";
import HealthCheckDetail from "../pages/nurse/HealthCheckDetail";
import HealthCheckRecord from "../pages/nurse/HealthCheckRecord";
import NurseReport from "../pages/nurse/NurseReport";
import ViewBlog from "../pages/nurse/viewBlog";
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
      <Route path="/notification" element={<NotificationAndReport />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/create" element={<BlogCreate />} />
      <Route path="/firstlogin" element={<FirstLogin />} />
      <Route path="/sendnotifications" element={<SendNotifications />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Add more routes as needed */}
      <Route path="/medicine" element={<MedicationHandle />} />
      <Route path="/vaccines" element={<VaccinCampaign />} />
      <Route path="/hisofcare" element={<ChildCareHistory />} />
      <Route path="/incidents" element={<Incident />} />
      <Route path="/vaccines" element={<VaccinCampaign />} />
      <Route path="/supplies" element={<MedicalSupplies />} />
      <Route path="/vaccination-campaigns" element={<VaccinationCampaign />} />
      <Route path="/vaccines/:id" element={<CampaignDetail />} />
      <Route path="/vaccines/:id/result" element={<VaccinationResultPage />} />
      <Route path="/health-check-campaign" element={<HealthCheckCampaign />} />
      <Route path="/health-check" element={<HealthCheckList />} />
      <Route path="/healthcheck/:campaignId" element={<HealthCheckDetail />} />
      <Route path="/health-record/:recordId" element={<HealthCheckRecord />} />
      <Route path="/report" element={<NurseReport />} />
      <Route path="/viewBlog" element={<ViewBlog />} />
    </Routes>
  );
};

export default AppRouter;
