import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminDashboard from "./Components/AdminDashboard";
import DashboardOverview from "./Components/DashboardOverview";
import UsersPanel from "./Components/UsersPanel";
import BlogsPanel from "./Components/BlogsPanel";
import NotificationsPanel from "./Components/NotificationsPanel";
import NotificationDetails from "./Components/NotificationDetails";
import AdminLogin from "./Components/AdminLogin";
import "./App.css";
import { NotificationProvider } from "./Components/Context/notificationContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* All routes wrapped by AdminDashboard */}
        <Route path="/" element={<AdminLogin />} />
        <Route element={<AdminDashboard />}>
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/users" element={<UsersPanel />} />
          <Route path="/blogs" element={<BlogsPanel />} />
          <Route path="/notifications" element={<NotificationsPanel />} />
          <Route path="/notifications/:id" element={<NotificationDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function WrappedApp() {
  return (
    <NotificationProvider>
      <App />
    </NotificationProvider>
  );
}

export default WrappedApp;
