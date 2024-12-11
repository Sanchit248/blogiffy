import React, { useState, useContext } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Bell, FileText, Home, Menu, Users, X } from 'lucide-react';
import Button from "@mui/material/Button";
import './AdminDashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NotificationContext } from './Context/notificationContext';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { unread } = useContext(NotificationContext);

  const handleLogout = async () => {
    try {
      const res = await axios.post("https://blogifybackend-anmol-ramolas-projects.vercel.app/logoutAdmin", {}, { withCredentials: true });
      toast.success(res.data.msg);
      navigate('/');
    } catch (error) {
      if(error.response.status === 402){
        toast.error(error.response.data.msg);
      }
      console.log(error);
      navigate('/');
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          <Link to="/dashboard" className={location.pathname === '/' ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
            <Home className="icon" /> Dashboard
          </Link>
          <Link to="/users" className={location.pathname === '/users' ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
            <Users className="icon" /> Users
          </Link>
          <Link to="/blogs" className={location.pathname === '/blogs' ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
            <FileText className="icon" /> Blogs
          </Link>
          <Link to="/notifications" className={location.pathname.startsWith('/notifications') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
            <Bell className="icon" /> Notifications
            {unread.length > 0 && <span className="badge">{unread.length}</span>}
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <header>
          <button className="menu-button" onClick={() => setSidebarOpen(true)}>
            <Menu />
          </button>
          <div className="user-avatar">
            <Button
      variant="contained"
      color="primary" 
      onClick={handleLogout}
      sx={{  
        backgroundColor: 'black', // refers to the color in the theme
        '&:hover': {     // nested syntax for hover state
          backgroundColor: 'gray',
        }
      }}
    >
      Logout
    </Button>
          </div>
        </header>
        {/* Render the routed component here */}
        <Outlet />
      </div>
    </div>
  );
}
