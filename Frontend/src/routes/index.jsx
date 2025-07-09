import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../pages/homepage/Homepage";
import Login from "../pages/auth/Login";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import NurseDashboard from "../pages/nurse/NurseDashboard";
import UsersList from "../pages/manager/UsersList";
import StudentList from "../pages/nurse/StudentList";
import StudentDetail from "../pages/nurse/StudentDetail";
import ParentDashboard from "../pages/parent/ParentDashboard";
import HealthProfile from "../pages/parent/HealthProfile";

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
import BlogPublic from '../pages/homepage/BlogPublic';

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blog" element={<BlogPublic />} />
      <Route path="/blog/create" element={<BlogCreate />} />
      {/* Protected routes */}
      <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/nurse" element={<ProtectedRoute><NurseDashboard /></ProtectedRoute>} />
      <Route path="/parent" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><ParentDashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><StudentList /></ProtectedRoute>} />
      <Route path="/students/:id" element={<ProtectedRoute><StudentDetail /></ProtectedRoute>} />
      <Route path="/healthprofile" element={<ProtectedRoute><HealthProfile /></ProtectedRoute>} />
      <Route path="/sendmedicine" element={<ProtectedRoute><SendMedicine /></ProtectedRoute>} />
      <Route path="/hisofcare" element={<ProtectedRoute><ChildCareHistory /></ProtectedRoute>} />
      <Route path="/notification" element={<ProtectedRoute><NotificationAndReport /></ProtectedRoute>} />
      <Route path="/manager/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
      <Route path="/firstlogin" element={<FirstLogin />} />
      <Route path="/sendnotifications" element={<ProtectedRoute><SendNotifications /></ProtectedRoute>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/medicine" element={<ProtectedRoute><MedicationHandle /></ProtectedRoute>} />
      <Route path="/vaccines" element={<ProtectedRoute><VaccinCampaign /></ProtectedRoute>} />
      <Route path="/incidents" element={<ProtectedRoute><Incident /></ProtectedRoute>} />
      <Route path="/supplies" element={<ProtectedRoute><MedicalSupplies /></ProtectedRoute>} />
      <Route path="/vaccination-campaigns" element={<ProtectedRoute><VaccinationCampaign /></ProtectedRoute>} />
      <Route path="/vaccines/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
      <Route path="/vaccines/:id/result" element={<ProtectedRoute><VaccinationResultPage /></ProtectedRoute>} />
      <Route path="/health-check-campaign" element={<ProtectedRoute><HealthCheckCampaign /></ProtectedRoute>} />
      <Route path="/health-check" element={<ProtectedRoute><HealthCheckList /></ProtectedRoute>} />
      <Route path="/healthcheck/:campaignId" element={<ProtectedRoute><HealthCheckDetail /></ProtectedRoute>} />
      <Route path="/health-record/:recordId" element={<ProtectedRoute><HealthCheckRecord /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><NurseReport /></ProtectedRoute>} />
      <Route path="/viewBlog" element={<ProtectedRoute><ViewBlog /></ProtectedRoute>} />
    </Routes>
  );
};

export default AppRouter;
